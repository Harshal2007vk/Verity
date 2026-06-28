import { base44 } from "@/api/base44Client";
import { verifyCandidateTrust } from "@/lib/trustVerification";
import { runFullRanking } from "@/lib/rankingEngine";
import { seedDemoData } from "@/lib/seedData";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function generateCandidateIntelligence(candidate) {
  const result = await base44.integrations.Core.InvokeLLM({
    prompt: `You are Verity's Candidate Intelligence Engine. Analyze this candidate deeply.

Philosophy: "A resume is a claim. We look for evidence."

CANDIDATE:
Name: ${candidate.full_name}
Title: ${candidate.current_title || "N/A"}
Company: ${candidate.current_company || "N/A"}
Experience: ${candidate.total_experience_years || 0} years
Skills Claimed: ${(candidate.skills_claimed || []).join(", ")}
Evidence Links: ${JSON.stringify(candidate.evidence_links || [])}
Work History: ${JSON.stringify(candidate.work_history || [])}
Education: ${JSON.stringify(candidate.education || [])}

RESUME TEXT:
${(candidate.resume_text || "").substring(0, 3000)}

Generate a 360-degree candidate intelligence report:

1. skill_graph: For each skill claimed, assess confidence (0-100) and whether it's "claimed" (resume-only) or "evidenced" (backed by projects/certs/publications). ORDER from foundational to specialized.
2. career_trajectory_summary: 2-3 sentence analysis of career path and growth pattern.
3. transferable_skills: Skills implied by experience but not explicitly listed.
4. growth_signal: Assessment of growth trajectory.`,
    response_json_schema: {
      type: "object",
      properties: {
        skill_graph: {
          type: "array",
          items: {
            type: "object",
            properties: {
              skill: { type: "string" },
              confidence: { type: "number" },
              source: { type: "string" },
            },
          },
        },
        career_trajectory_summary: { type: "string" },
        transferable_skills: { type: "array", items: { type: "string" } },
        growth_signal: { type: "string" },
      },
    },
    model: "claude_sonnet_4_6",
  });
  return result;
}

// FEATURE 1: Candidate Decision Assistant
export async function askAboutCandidate(question, candidate, job, rankingResult, allRankings = [], allCandidates = {}) {
  const jobIntel = job.job_intelligence || {};
  const candidateIntel = candidate.candidate_intelligence || {};
  const trustAudit = candidate.trust_breakdown || {};

  const otherRankings = allRankings
    .filter((r) => r.candidate_id !== candidate.id)
    .slice(0, 5)
    .map((r) => {
      const c = allCandidates[r.candidate_id];
      return c
        ? {
            name: c.full_name,
            rank: r.rank_position,
            score: r.overall_score,
            trust: r.trust_score,
            risk: r.risk_level,
            title: c.current_title,
            transferable: r.top_transferable_skill,
          }
        : null;
    })
    .filter(Boolean);

  const result = await base44.integrations.Core.InvokeLLM({
    prompt: `You are Verity's AI Hiring Analyst — an intelligence assistant sitting beside a recruiter.

PHILOSOPHY: "A resume is a claim. We rank on evidence."

RULES:
1. Use ONLY the evidence provided below. NEVER hallucinate or invent information.
2. If the evidence doesn't fully answer the question, state exactly what's missing.
3. Reference specific evidence (scores, claims, evidence links, trust status) in your answer.
4. Be direct and concise — like a trusted analyst briefing a hiring manager.
5. When comparing candidates, use the ranking data and scores provided.

RECRUITER QUESTION: ${question}

=== JOB INTELLIGENCE ===
Title: ${job.title}
${JSON.stringify(jobIntel, null, 2)}

=== CANDIDATE PROFILE ===
Name: ${candidate.full_name}
Title: ${candidate.current_title}
Company: ${candidate.current_company}
Experience: ${candidate.total_experience_years} years
Skills Claimed: ${(candidate.skills_claimed || []).join(", ")}

=== CANDIDATE INTELLIGENCE (AI-generated) ===
${JSON.stringify(candidateIntel, null, 2)}

=== TRUST AUDIT ===
Trust Score: ${trustAudit.trust_score || "N/A"}
Risk Level: ${trustAudit.risk_level || "N/A"}
Risk Rationale: ${trustAudit.risk_rationale || "N/A"}
Claims Verified: ${JSON.stringify(trustAudit.claims || [], null, 2)}
Suspicious Patterns: ${JSON.stringify(trustAudit.suspicious_patterns || [], null, 2)}

=== RANKING RESULT ===
Rank: #${rankingResult?.rank_position}
Overall Score: ${rankingResult?.overall_score}
Sub-scores: ${JSON.stringify(rankingResult?.sub_scores || {}, null, 2)}
Risk Level: ${rankingResult?.risk_level}
Trust Score: ${rankingResult?.trust_score}
AI Explanation: ${rankingResult?.explanation}
Top Transferable Skill: ${rankingResult?.top_transferable_skill}

=== OTHER CANDIDATES (for comparison) ===
${JSON.stringify(otherRankings, null, 2)}

Answer the recruiter's question using ONLY the evidence above.`,
    model: "claude_sonnet_4_6",
    response_json_schema: {
      type: "object",
      properties: {
        answer: { type: "string", description: "Direct answer referencing specific evidence" },
        evidence_references: {
          type: "array",
          items: { type: "string" },
          description: "Specific evidence points cited in the answer",
        },
        confidence: {
          type: "string",
          enum: ["high", "medium", "low"],
          description: "Confidence in the answer based on available evidence",
        },
      },
    },
  });
  return result;
}

// FEATURE 2: Interview Question Generator
export async function generateInterviewPlan(candidate, job, rankingResult) {
  const jobIntel = job.job_intelligence || {};
  const candidateIntel = candidate.candidate_intelligence || {};
  const trustAudit = candidate.trust_breakdown || {};

  const unsupportedClaims = (trustAudit.claims || [])
    .filter((c) => c.status === "unsupported" || c.status === "plausible")
    .map((c) => ({ claim: c.claim, status: c.status, reasoning: c.reasoning }));

  const result = await base44.integrations.Core.InvokeLLM({
    prompt: `You are Verity's Interview Plan Generator. Create a targeted interview plan for this candidate.

PHILOSOPHY: "A resume is a claim. We verify in interview."

Generate THREE categories of questions:

1. TECHNICAL QUESTIONS (5-7 questions): Based on claimed skills, evidence links, and projects. Test depth and real-world experience, not trivia. For each question, specify what a strong answer looks like.

2. BEHAVIORAL QUESTIONS (4-5 questions): Based on career trajectory, role changes, and leadership signals from their work history. Use real scenarios from their career.

3. VERIFICATION QUESTIONS (3-5 questions): Based on unsupported or plausible claims and risk areas from the trust audit. These should help the interviewer probe unverified claims. For each, explain what claim it's verifying and what a red flag answer looks like.

=== JOB ===
Title: ${job.title}
Job Intelligence: ${JSON.stringify(jobIntel, null, 2)}

=== CANDIDATE ===
Name: ${candidate.full_name}
Title: ${candidate.current_title}
Skills: ${(candidate.skills_claimed || []).join(", ")}
Evidence Links: ${JSON.stringify(candidate.evidence_links || [], null, 2)}
Work History: ${JSON.stringify((candidate.work_history || []).map(w => ({ company: w.company, title: w.title, description: w.description })), null, 2)}

=== CANDIDATE INTELLIGENCE ===
${JSON.stringify(candidateIntel, null, 2)}

=== TRUST AUDIT (claims to verify) ===
Trust Score: ${trustAudit.trust_score || "N/A"}
Risk Level: ${trustAudit.risk_level || "N/A"}
Claims Needing Verification: ${JSON.stringify(unsupportedClaims, null, 2)}
Suspicious Patterns: ${JSON.stringify(trustAudit.suspicious_patterns || [], null, 2)}

=== RANKING RESULT ===
Overall Score: ${rankingResult?.overall_score}
Sub-scores: ${JSON.stringify(rankingResult?.sub_scores || {}, null, 2)}

Generate the interview plan.`,
    model: "claude_sonnet_4_6",
    response_json_schema: {
      type: "object",
      properties: {
        technical_questions: {
          type: "array",
          items: {
            type: "object",
            properties: {
              question: { type: "string" },
              focus: { type: "string", description: "What to look for in the answer" },
            },
          },
        },
        behavioral_questions: {
          type: "array",
          items: {
            type: "object",
            properties: {
              question: { type: "string" },
              focus: { type: "string", description: "What to look for in the answer" },
            },
          },
        },
        verification_questions: {
          type: "array",
          items: {
            type: "object",
            properties: {
              question: { type: "string" },
              verifying: { type: "string", description: "Which claim this question verifies" },
              red_flag: { type: "string", description: "What a concerning answer looks like" },
            },
          },
        },
      },
    },
  });
  return result;
}

// FEATURE 3: Hiring Confidence Score
export async function generateHiringDecision(candidate, job, rankingResult) {
  const jobIntel = job.job_intelligence || {};
  const candidateIntel = candidate.candidate_intelligence || {};
  const trustAudit = candidate.trust_breakdown || {};

  const result = await base44.integrations.Core.InvokeLLM({
    prompt: `You are Verity's Hiring Decision Engine. Produce a hiring confidence assessment.

PHILOSOPHY: "A resume is a claim. We decide on evidence."

Analyze the candidate against the job and produce:

1. confidence_score (0-100): How confident should the recruiter be in hiring this candidate?
   - 80-100: Strong evidence, low risk, strong fit
   - 60-79: Good candidate with some gaps
   - 40-59: Notable concerns, needs verification
   - 0-39: Significant risks or poor fit

2. strengths[]: 3-5 specific, evidence-backed strengths. Reference actual evidence.

3. risks[]: 2-4 specific risks. Reference trust audit findings or score gaps.

4. interview_focus[]: 2-4 areas the interviewer should probe.

5. recommendation: One of "Strong Hire", "Consider", "Needs Verification", "Reject"
   - Strong Hire: 80+ confidence, low risk, strong evidence
   - Consider: 60-79 confidence, medium risk
   - Needs Verification: 40-59 confidence, high risk or unsupported claims
   - Reject: <40 confidence, critical risks or poor fit

6. rationale: 2-3 sentence summary of the recommendation.

=== JOB ===
Title: ${job.title}
Job Intelligence: ${JSON.stringify(jobIntel, null, 2)}

=== CANDIDATE ===
Name: ${candidate.full_name}
Title: ${candidate.current_title}
Experience: ${candidate.total_experience_years} years

=== CANDIDATE INTELLIGENCE ===
${JSON.stringify(candidateIntel, null, 2)}

=== TRUST AUDIT ===
Trust Score: ${trustAudit.trust_score || "N/A"}
Risk Level: ${trustAudit.risk_level || "N/A"}
Claims: ${JSON.stringify(trustAudit.claims || [], null, 2)}
Suspicious Patterns: ${JSON.stringify(trustAudit.suspicious_patterns || [], null, 2)}

=== RANKING RESULT ===
Rank: #${rankingResult?.rank_position}
Overall Score: ${rankingResult?.overall_score}
Sub-scores: ${JSON.stringify(rankingResult?.sub_scores || {}, null, 2)}
Trust Score: ${rankingResult?.trust_score}
Risk Level: ${rankingResult?.risk_level}
Explanation: ${rankingResult?.explanation}

Produce the hiring decision.`,
    model: "claude_sonnet_4_6",
    response_json_schema: {
      type: "object",
      properties: {
        confidence_score: { type: "number" },
        strengths: { type: "array", items: { type: "string" } },
        risks: { type: "array", items: { type: "string" } },
        interview_focus: { type: "array", items: { type: "string" } },
        recommendation: { type: "string", enum: ["Strong Hire", "Consider", "Needs Verification", "Reject"] },
        rationale: { type: "string" },
      },
    },
  });
  return result;
}

// FEATURE 4: Recruiter AI Summary
export async function generateHiringBrief(rankings, candidatesMap, job) {
  const topRankings = rankings.slice(0, 5);
  const topCandidates = topRankings.map((r) => {
    const c = candidatesMap[r.candidate_id];
    if (!c) return null;
    return {
      name: c.full_name,
      rank: r.rank_position,
      score: r.overall_score,
      trust: r.trust_score,
      risk: r.risk_level,
      title: c.current_title,
      company: c.current_company,
      transferable_skill: r.top_transferable_skill,
      explanation: r.explanation,
      trust_claims: (c.trust_breakdown?.claims || []).map((cl) => ({ claim: cl.claim, status: cl.status })),
      suspicious_patterns: c.trust_breakdown?.suspicious_patterns || [],
      skills: c.skills_claimed || [],
      evidence_count: (c.evidence_links || []).length,
    };
  }).filter(Boolean);

  const result = await base44.integrations.Core.InvokeLLM({
    prompt: `You are Verity's AI Hiring Analyst. Produce an executive hiring brief for the recruiter.

PHILOSOPHY: "A resume is a claim. We rank on evidence."

Create a concise executive brief covering:

1. top_candidate: Name of the #1 ranked candidate
2. top_candidate_score: Their overall score
3. summary: 3-4 sentences explaining why this candidate is on top. Reference specific evidence (GitHub repos, publications, trust scores). Mention the primary concern if any.
4. key_strengths[]: 2-3 strengths of the top candidate backed by evidence
5. key_risks[]: 1-2 risks or gaps identified
6. runner_up: Name of the #2 candidate and a one-line reason they're close
7. recommendation: Overall recommendation for the shortlist

=== JOB ===
Title: ${job.title}

=== TOP 5 CANDIDATES ===
${JSON.stringify(topCandidates, null, 2)}

Produce the hiring brief.`,
    model: "claude_sonnet_4_6",
    response_json_schema: {
      type: "object",
      properties: {
        top_candidate: { type: "string" },
        top_candidate_score: { type: "number" },
        summary: { type: "string" },
        key_strengths: { type: "array", items: { type: "string" } },
        key_risks: { type: "array", items: { type: "string" } },
        runner_up: { type: "string" },
        recommendation: { type: "string" },
      },
    },
  });
  return result;
}

// FEATURE 5: Bias Reduction Layer
export async function runBiasCheck(rankings, candidatesMap, job) {
  const candidateData = rankings.map((r) => {
    const c = candidatesMap[r.candidate_id];
    if (!c) return null;
    return {
      name: c.full_name,
      rank: r.rank_position,
      score: r.overall_score,
      trust: r.trust_score,
      risk: r.risk_level,
      location: c.location,
      education: (c.education || []).map((e) => `${e.degree} ${e.institution}`),
      evidence_count: (c.evidence_links || []).length,
      skills_count: (c.skills_claimed || []).length,
      sub_scores: r.sub_scores,
      transferable_skill: r.top_transferable_skill,
    };
  }).filter(Boolean);

  const result = await base44.integrations.Core.InvokeLLM({
    prompt: `You are Verity's Bias Reduction Engine. Audit the ranking for fairness and explainability.

PHILOSOPHY: "Rankings must be explainable and fair."

Check the ranking for THREE types of bias:

1. IRRELEVANT ATTRIBUTE BIAS: Is the ranking influenced by irrelevant attributes like candidate name, location, or education prestige? Candidates from elite schools or specific locations should not be ranked higher unless their skills and evidence justify it.

2. SKILL EVALUATION CONSISTENCY: Are skills evaluated consistently across candidates? If two candidates have similar evidence for a skill, they should receive similar skill_proof scores. Check for inconsistencies.

3. EVIDENCE SIGNAL WEIGHTING: Are evidence signals weighted correctly? Candidates with more evidence links (GitHub, publications, certificates) should generally have higher trust scores than those with none. Flag cases where a candidate with no evidence has a high trust score, or vice versa.

For each check, assign status "PASS" or "REVIEW" with a detailed explanation.

Overall fairness_status is "PASS" only if all checks pass. Otherwise "REVIEW".

=== JOB ===
Title: ${job.title}

=== RANKED CANDIDATES ===
${JSON.stringify(candidateData, null, 2)}

Produce the bias check.`,
    model: "claude_sonnet_4_6",
    response_json_schema: {
      type: "object",
      properties: {
        fairness_status: { type: "string", enum: ["PASS", "REVIEW"] },
        checks: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              status: { type: "string", enum: ["PASS", "REVIEW"] },
              detail: { type: "string" },
            },
          },
        },
        notes: { type: "array", items: { type: "string" } },
      },
    },
  });
  return result;
}

// FEATURE 6: Demo Mode
export async function runVerityDemo(onProgress) {
  // Step 1: Ensure data exists and find ML job
  onProgress({ step: 0, label: "Loading ML Engineer job..." });
  let jobs = await base44.entities.Job.list();
  if (jobs.length === 0) {
    await seedDemoData();
    jobs = await base44.entities.Job.list();
  }
  const mlJob = jobs.find((j) => j.title.includes("ML Engineer") || j.title.includes("Machine Learning")) || jobs[0];

  // Step 2: Load candidates
  onProgress({ step: 1, label: "Loading 10 candidates..." });
  const allCandidates = await base44.entities.Candidate.list();

  const mlKeywords = ["Python", "PyTorch", "Machine Learning", "ML", "TensorFlow", "AI", "Deep Learning", "NLP", "Computer Vision", "MLOps", "CUDA", "LLM", "Transformers"];
  let mlCandidates = allCandidates.filter((c) =>
    (c.skills_claimed || []).some((s) => mlKeywords.some((k) => s.toLowerCase().includes(k.toLowerCase())))
  );
  if (mlCandidates.length < 5) mlCandidates = allCandidates;
  mlCandidates = mlCandidates.slice(0, 10);

  // Step 3: AI analyzing resumes (visual)
  onProgress({ step: 2, label: "AI analyzing resumes..." });
  await sleep(2000);

  // Step 4: Checking evidence (trust verification)
  onProgress({ step: 3, label: "Checking evidence..." });
  for (let i = 0; i < mlCandidates.length; i++) {
    const c = mlCandidates[i];
    if (!c.trust_breakdown) {
      const trust = await verifyCandidateTrust(c);
      await base44.entities.Candidate.update(c.id, { trust_breakdown: trust });
      mlCandidates[i] = { ...c, trust_breakdown: trust };
    }
  }

  // Step 5: Building candidate intelligence
  onProgress({ step: 4, label: "Building candidate intelligence..." });
  for (let i = 0; i < mlCandidates.length; i++) {
    const c = mlCandidates[i];
    if (!c.candidate_intelligence) {
      const intel = await generateCandidateIntelligence(c);
      await base44.entities.Candidate.update(c.id, { candidate_intelligence: intel });
      mlCandidates[i] = { ...c, candidate_intelligence: intel };
    }
  }

  // Step 6: Generating shortlist (ranking)
  onProgress({ step: 5, label: "Generating shortlist..." });

  const existingRankings = await base44.entities.RankingResult.filter({ job_id: mlJob.id });
  if (existingRankings.length > 0) {
    await base44.entities.RankingResult.deleteMany({ job_id: mlJob.id });
  }

  const finalRankings = await runFullRanking(mlJob, mlCandidates, (p) => {
    onProgress({ step: 5, label: `Generating shortlist... ${p.current}/${p.total}` });
  });

  await base44.entities.RankingResult.bulkCreate(finalRankings);

  // Step 7: Done
  onProgress({ step: 6, label: "Shortlist ready!" });
  await sleep(1500);

  return { jobId: mlJob.id };
}