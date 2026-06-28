try {
  Write-Host "1. Creating Job..."
  $jobResponse = Invoke-RestMethod -Uri 'http://localhost:5000/api/jobs' -Method Post -ContentType 'application/json' -Body '{"title":"Backend Dev", "department":"Engineering", "location":"Remote", "description":"Test job", "requirements":["Node.js"], "responsibilities":["Coding"]}'
  $jobId = $jobResponse.id
  Write-Host "Job created: $jobId"

  Write-Host "2. Uploading Candidate Resume..."
  $uploadJson = curl.exe -s -F "resume=@dummy.pdf" http://localhost:5000/api/candidates/upload
  $candidateResponse = $uploadJson | ConvertFrom-Json
  Write-Host "Resume uploaded/parsed successfully."

  Write-Host "3. Creating Candidate with parsed data..."
  $candidateResponse.full_name = "Test E2E User"
  $candidateResponse.current_title = "Backend Dev"
  $candidateResponse.skills_claimed = @("Node.js")
  $candCreate = Invoke-RestMethod -Uri 'http://localhost:5000/api/candidates' -Method Post -ContentType 'application/json' -Body ($candidateResponse | ConvertTo-Json -Depth 10)
  $candId = $candCreate.id
  Write-Host "Candidate created: $candId"

  Write-Host "4. Running Ranking..."
  $rankResponse = Invoke-RestMethod -Uri 'http://localhost:5000/api/rankings/rank-candidates' -Method Post -ContentType 'application/json' -Body (@{ jobId = $jobId; candidates = @(@{ id = $candId; full_name = "Test E2E User"; skills_claimed = @("Node.js"); current_title = "Backend Dev"; resume_text = "Dummy PDF" }) } | ConvertTo-Json -Depth 10)
  Write-Host "Ranking completed! Ranked candidates count: $($rankResponse.length)"
  Write-Host "Smoke test SUCCESS."
} catch {
  Write-Error "Smoke test FAILED: $_"
}
