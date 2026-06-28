param()
$BASE = "http://localhost:5000/api"
$passCount = 0
$failCount = 0
$testJobId = $null
$candAId = $null
$candBId = $null

function Test-Result {
  param([string]$name, [bool]$success, [string]$detail = "")
  if ($success) {
    Write-Host "  [PASS] $name" -ForegroundColor Green
    $script:passCount++
  } else {
    Write-Host "  [FAIL] $name : $detail" -ForegroundColor Red
    $script:failCount++
  }
}

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "  AI RECRUITER - QA TEST SUITE" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# --- 1. Health ---
Write-Host "[1] HEALTH CHECK" -ForegroundColor Yellow
try {
  $r = Invoke-RestMethod "$BASE/health" -ErrorAction Stop
  Test-Result "GET /api/health" ($r.status -eq "ok") "status=$($r.status)"
} catch {
  Test-Result "GET /api/health" $false "$_"
}

# --- 2. GET Candidates ---
Write-Host ""
Write-Host "[2] GET CANDIDATES" -ForegroundColor Yellow
try {
  $cands = Invoke-RestMethod "$BASE/candidates" -ErrorAction Stop
  Test-Result "GET /api/candidates" $true
  Write-Host "     -> $($cands.Count) in DB" -ForegroundColor DarkGray
} catch {
  Test-Result "GET /api/candidates" $false "$_"
}

# --- 3. GET Jobs ---
Write-Host ""
Write-Host "[3] GET JOBS" -ForegroundColor Yellow
try {
  $jobs = Invoke-RestMethod "$BASE/jobs" -ErrorAction Stop
  Test-Result "GET /api/jobs" $true
  Write-Host "     -> $($jobs.Count) in DB" -ForegroundColor DarkGray
} catch {
  Test-Result "GET /api/jobs" $false "$_"
}

# --- 4. Create Job ---
Write-Host ""
Write-Host "[4] CREATE JOB" -ForegroundColor Yellow
$jobPayload = '{"title":"Senior React Developer","description":"Looking for a senior React developer with TypeScript, Node.js, and cloud experience. Must have experience building scalable web applications.","skills":["React","TypeScript","Node.js","AWS"],"department":"Engineering","location":"Remote","type":"Full-time","experience":"5+ years","salary":"120k-160k"}'
try {
  $nj = Invoke-RestMethod -Uri "$BASE/jobs" -Method POST -ContentType "application/json" -Body $jobPayload -ErrorAction Stop
  $ok = ($null -ne $nj.id)
  Test-Result "POST /api/jobs" $ok "id=$($nj.id)"
  if ($ok) { $script:testJobId = $nj.id }
} catch {
  Test-Result "POST /api/jobs" $false "$_"
}

# --- 5. Create Candidate A ---
Write-Host ""
Write-Host "[5] CANDIDATE A (keyword-only, weaker)" -ForegroundColor Yellow
$cAPayload = '{"full_name":"Alice Keyword","current_title":"React Developer","email":"alice@test.com","skills_claimed":["React","JavaScript"],"work_history":[{"company":"TechCorp","title":"React Developer","start_date":"2021","end_date":"present","description":"React developer. Used React and JavaScript. 5 years experience."}],"resume_text":"React developer with 5 years experience using React and JavaScript."}'
try {
  $ca = Invoke-RestMethod -Uri "$BASE/candidates" -Method POST -ContentType "application/json" -Body $cAPayload -ErrorAction Stop
  $ok = ($null -ne $ca.id)
  Test-Result "POST /api/candidates (Alice)" $ok "id=$($ca.id)"
  if ($ok) { $script:candAId = $ca.id }
} catch {
  Test-Result "POST /api/candidates (Alice)" $false "$_"
}

# --- 6. Create Candidate B ---
Write-Host ""
Write-Host "[6] CANDIDATE B (evidence-rich, stronger)" -ForegroundColor Yellow
$cBPayload = '{"full_name":"Bob Evidence","current_title":"Senior Frontend Engineer","email":"bob@test.com","skills_claimed":["React","TypeScript","Node.js","AWS","Performance Optimization","Design Systems"],"work_history":[{"company":"ScaleUp Inc","title":"Senior Frontend Engineer","start_date":"2020","end_date":"present","description":"Built scalable React+TypeScript applications serving 2M users. Optimized LCP from 4.2s to 1.7s (60% improvement). Created design system adopted by 5 teams. Deployed Node.js microservices to AWS ECS with CI/CD pipelines."}],"resume_text":"Built scalable React TypeScript applications optimized performance 60% created design systems Node.js AWS cloud microservices"}'
try {
  $cb = Invoke-RestMethod -Uri "$BASE/candidates" -Method POST -ContentType "application/json" -Body $cBPayload -ErrorAction Stop
  $ok = ($null -ne $cb.id)
  Test-Result "POST /api/candidates (Bob)" $ok "id=$($cb.id)"
  if ($ok) { $script:candBId = $cb.id }
} catch {
  Test-Result "POST /api/candidates (Bob)" $false "$_"
}

# --- 7. AI invoke-llm ---
Write-Host ""
Write-Host "[7] AI INVOKE-LLM" -ForegroundColor Yellow
$llmPayload = '{"prompt":"Return valid JSON with keys test and score. Example: {\"test\":\"hello\",\"score\":42}"}'
try {
  $llm = Invoke-RestMethod -Uri "$BASE/ai/invoke-llm" -Method POST -ContentType "application/json" -Body $llmPayload -ErrorAction Stop
  Test-Result "POST /api/ai/invoke-llm" ($null -ne $llm) "response=$($llm | ConvertTo-Json -Compress)"
} catch {
  Test-Result "POST /api/ai/invoke-llm" $false "$_"
}

# --- 8. AI Ranking ---
Write-Host ""
Write-Host "[8] AI RANKING ENGINE (key test)" -ForegroundColor Yellow
if ($script:testJobId -and $script:candAId -and $script:candBId) {
  try {
    $allCands = Invoke-RestMethod "$BASE/candidates" -ErrorAction Stop
    $cAFull = $allCands | Where-Object { $_.id -eq $script:candAId }
    $cBFull = $allCands | Where-Object { $_.id -eq $script:candBId }

    $rankPayload = @{
      jobId = $script:testJobId
      candidates = @($cAFull, $cBFull)
    } | ConvertTo-Json -Depth 10

    Write-Host "     Calling Gemini to rank 2 candidates..." -ForegroundColor DarkGray
    $rankRes = Invoke-RestMethod -Uri "$BASE/rankings/rank-candidates" -Method POST -ContentType "application/json" -Body $rankPayload -ErrorAction Stop

    if ($null -ne $rankRes) {
      $resArray = @($rankRes)
      Test-Result "POST /api/rankings/rank-candidates" $true "$($resArray.Count) results"
      Write-Host ""
      Write-Host "  === RANKING RESULTS ===" -ForegroundColor Cyan
      $sorted = $resArray | Sort-Object -Property overall_score -Descending
      $rank = 1
      foreach ($res in $sorted) {
        $cname = if ($res.candidate_id -eq $script:candAId) { "Alice Keyword" } else { "Bob Evidence" }
        Write-Host "  Rank $rank`: $cname" -ForegroundColor White
        Write-Host "     Overall Score : $($res.overall_score)/100" -ForegroundColor Yellow
        Write-Host "     Risk Level    : $($res.risk_level)" -ForegroundColor $(if ($res.risk_level -eq "low") { "Green" } elseif ($res.risk_level -eq "medium") { "Yellow" } else { "Red" })
        if ($res.explanation) { Write-Host "     Explanation   : $($res.explanation.Substring(0, [Math]::Min(150, $res.explanation.Length)))..." -ForegroundColor DarkGray }
        $rank++
      }
      Write-Host ""

      $bobScore   = ($resArray | Where-Object { $_.candidate_id -eq $script:candBId } | Select-Object -First 1).overall_score
      $aliceScore = ($resArray | Where-Object { $_.candidate_id -eq $script:candAId } | Select-Object -First 1).overall_score
      Write-Host "  Bob (evidence-rich): $bobScore  |  Alice (keyword-only): $aliceScore" -ForegroundColor White
      Test-Result "Evidence-based ranking: Bob > Alice" ($bobScore -gt $aliceScore) "Bob=$bobScore Alice=$aliceScore"
    } else {
      Test-Result "POST /api/rankings/rank-candidates" $false "null response"
    }
  } catch {
    Test-Result "POST /api/rankings/rank-candidates" $false "$_"
  }
} else {
  Write-Host "  [SKIP] Job/candidate IDs not available (prior step failed)" -ForegroundColor DarkYellow
}

# --- 9. Fetch stored rankings ---
Write-Host ""
Write-Host "[9] FETCH STORED RANKINGS" -ForegroundColor Yellow
if ($script:testJobId) {
  try {
    $stored = Invoke-RestMethod "$BASE/rankings/$($script:testJobId)" -ErrorAction Stop
    $arr = @($stored)
    Test-Result "GET /api/rankings/:jobId" $true "$($arr.Count) ranking(s)"
  } catch {
    Test-Result "GET /api/rankings/:jobId" $false "$_"
  }
}

# --- 10. Error handling ---
Write-Host ""
Write-Host "[10] ERROR HANDLING" -ForegroundColor Yellow

# Non-existent job
try {
  $bad = Invoke-RestMethod -Uri "$BASE/rankings/rank-candidates" -Method POST -ContentType "application/json" -Body '{"jobId":"DOES_NOT_EXIST_XYZ","candidates":[]}' -ErrorAction Stop
  Test-Result "Invalid jobId returns error" $false "Expected error but got 200"
} catch {
  Test-Result "Invalid jobId returns 4xx/5xx error" $true "$_"
}

# Empty candidates array
if ($script:testJobId) {
  try {
    $emptyBody = "{`"jobId`":`"$($script:testJobId)`",`"candidates`":[]}"
    $emptyRes = Invoke-RestMethod -Uri "$BASE/rankings/rank-candidates" -Method POST -ContentType "application/json" -Body $emptyBody -ErrorAction Stop
    $arr = @($emptyRes)
    Test-Result "Empty candidates returns empty array" ($arr.Count -eq 0) "count=$($arr.Count)"
  } catch {
    Test-Result "Empty candidates error handling" $true "graceful error: $_"
  }
}

# --- 11. Security ---
Write-Host ""
Write-Host "[11] SECURITY" -ForegroundColor Yellow
try {
  $h = Invoke-RestMethod "$BASE/health" -ErrorAction Stop
  $json = $h | ConvertTo-Json
  $leaksSecret = ($json -match "GEMINI_API_KEY" -or $json -match "DATABASE_URL" -or $json -match "supabase")
  Test-Result "No secrets leaked in /api/health" (-not $leaksSecret) $(if ($leaksSecret) { "SECRET FOUND IN RESPONSE" } else { "" })
} catch {
  Test-Result "Security check" $false "$_"
}

# --- 12. TypeScript server check ---
Write-Host ""
Write-Host "[12] SERVER TYPESCRIPT" -ForegroundColor Yellow
try {
  $tscOut = npx tsc -p tsconfig.server.json --noEmit 2>&1
  $hasErrors = ($LASTEXITCODE -ne 0) -and ($tscOut -match "error TS")
  Test-Result "Server TypeScript compiles" (-not $hasErrors) $(if ($hasErrors) { ($tscOut | Where-Object { $_ -match "error TS" } | Select-Object -First 3) -join "; " } else { "" })
} catch {
  Test-Result "TypeScript check" $false "$_"
}

# --- Summary ---
Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
$total = $passCount + $failCount
$color = if ($failCount -eq 0) { "Green" } elseif ($failCount -le 3) { "Yellow" } else { "Red" }
Write-Host "  RESULTS: $passCount/$total PASSED, $failCount FAILED" -ForegroundColor $color
$status = if ($failCount -eq 0) { "ALL SYSTEMS GO" } elseif ($failCount -le 3) { "MOSTLY WORKING" } else { "NEEDS ATTENTION" }
Write-Host "  STATUS : $status" -ForegroundColor $color
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""
