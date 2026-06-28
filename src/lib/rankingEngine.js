import { base44 } from "@/api/base44Client";
import { verifyCandidateTrust } from "@/lib/trustVerification";
import { getWeights, getRiskPenaltyStrength } from "@/lib/rankingConfig";

const BATCH_SIZE = 10;

const BASE_RISK_PENALTY = {
  low: 0,
  medium: 0.05,
  high: 0.15,
};

export function computeOverallScore(subScores, riskLevel) {
  const s = subScores || {};
  const weights = getWeights();
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0) || 1;

  const raw =
    ((s.semantic_fit || 0) * weights.semantic_fit +
     (s.skill_proof || 0) * weights.skill_proof +
     (s.experience_match || 0) * weights.experience_match +
     (s.project_quality || 0) * weights.project_quality +
     (s.career_growth || 0) * weights.career_growth +
     (s.behavioral_signal || 0) * weights.behavioral_signal) / totalWeight;

  const strengthMultiplier = getRiskPenaltyStrength() / 50;
  const penalty = (BASE_RISK_PENALTY[riskLevel] || 0) * strengthMultiplier;
  return Math.max(0, Math.round(raw * (1 - penalty)));
}

function buildCandidateSummary(c, trustBreakdown) {
  const evidenceLinks = (c.evidence_links || []).map(ev => ({
    type: ev.type,
    description: ev.description,
    url: ev.url,
  }));

  const workHistory = (c.work_history || []).map(w => ({
    company: w.company,
    title: w.title,
    start_date: w.start_date,
    end_date: w.end_date,
    description: (w.description || "").substring(0, 200),
  }));

  const transferableSkills = c.candidate_intelligence?.transferable_skills || [];

  return {
    id: c.id,
    full_name: c.full_name,
    current_title: c.current_title,
    current_company: c.current_company,
    total_experience_years: c.total_experience_years,
    skills_claimed: c.skills_claimed || [],
    work_history: workHistory,
    education: c.education || [],
    evidence_links: evidenceLinks,
    behavioral_signals: c.behavioral_signals || {},
    candidate_intelligence: c.candidate_intelligence || null,
    transferable_skills: transferableSkills,
    trust_score: trustBreakdown?.trust_score ?? null,
    risk_level: trustBreakdown?.risk_level ?? null,
    trust_claims: (trustBreakdown?.claims || []).map(cl => ({
      claim: cl.claim,
      status: cl.status,
    })),
    suspicious_patterns: trustBreakdown?.suspicious_patterns || [],
    resume_snippet: (c.resume_text || "").substring(0, 1000),
  };
}

async function rankBatch(job, candidatesBatch, jobIntel) {
  const summaries = candidatesBatch.map(c => buildCandidateSummary(c, c._trust_breakdown));

  const result = await base44.integrations.Core.InvokeLLM({
    prompt: `You are Verity's AI Ranking Engine. Philosophy: "A resume is a claim. We rank on evidence."

You are ranking candidates for a specific job. For EACH candidate, score 0-100 across these dimensions:

- semantic_fit (0-100): Does the candidate's actual career narrative suggest genuine fit for THIS role's responsibilities and hidden_requirements? Not just overlapping keywords — assess whether their trajectory, projects, and domain expertise suggest they would thrive in this specific role.
- skill_proof (0-100): Weight heavily toward skills that are evidence-backed (github, publications, certificates) over merely claimed. A skill with no proof in work history or evidence links should score lower. Use the trust_claims to see which claims are supported/plausible/unsupported.
- experience_match (0-100): Seniority and trajectory fit, not just years. Does their career arc align with what this role needs?
- project_quality (0-100): Based on evidence_links and project descriptions. Concrete, specific projects with measurable impact score higher.
- career_growth (0-100): Trajectory of increasing responsibility/scope over time.
- behavioral_signal (0-100): Derived from profile_completeness_score, response_rate, application_velocity, last_active_date in behavioral_signals.

- top_transferable_skill: Identify the SINGLE most relevant transferable skill for this candidate relative to THIS job — a skill they have that isn't explicitly required but would be valuable (e.g., a data engineer with strong pipeline skills applying for an ML role — "Data Pipeline Engineering" could be their top transferable skill). If no transferable skill is relevant, use "N/A".

- explanation: 2-3 sentences, written like a recruiter explaining to a hiring manager. Reference at least one specific piece of evidence or claim (e.g., "Their GitHub repo with 200 stars backs their PyTorch expertise" or "The 'expert in Kubernetes' claim is unsupported — no DevOps roles in work history").

JOB:
Title: ${job.title}
Job Intelligence: ${JSON.stringify(jobIntel)}

CANDIDATES (with their trust verification):
${JSON.stringify(summaries)}

Score each candidate independently. Do NOT compare candidates to each other — assess each on their own merit against the job requirements.`,
    response_json_schema: {
      type: "object",
      properties: {
        results: {
          type: "array",
          items: {
            type: "object",
            properties: {
              candidate_id: { type: "string" },
              semantic_fit: { type: "number" },
              skill_proof: { type: "number" },
              experience_match: { type: "number" },
              project_quality: { type: "number" },
              career_growth: { type: "number" },
              behavioral_signal: { type: "number" },
              top_transferable_skill: { type: "string" },
              explanation: { type: "string" }
            }
          }
        }
      }
    },
    model: "claude_sonnet_4_6"
  });

  return result.results || [];
}

export async function runFullRanking(job, candidates, onProgress) {
  const jobIntel = job.job_intelligence || {};

  // Step 1: Run trust verification for candidates that don't have it yet
  const candidatesWithTrust = [];
  for (let i = 0; i < candidates.length; i++) {
    const c = candidates[i];
    onProgress({ step: "verifying", current: i + 1, total: candidates.length, label: `Verifying trust · ${c.full_name}` });

    let trust = c.trust_breakdown;
    if (!trust) {
      trust = await verifyCandidateTrust(c);
      await base44.entities.Candidate.update(c.id, { trust_breakdown: trust });
    }
    candidatesWithTrust.push({ ...c, _trust_breakdown: trust });
  }

  // Step 2: Rank in batches
  const allResults = [];
  const batchCount = Math.ceil(candidatesWithTrust.length / BATCH_SIZE);

  for (let b = 0; b < batchCount; b++) {
    const batch = candidatesWithTrust.slice(b * BATCH_SIZE, (b + 1) * BATCH_SIZE);
    const batchStart = b * BATCH_SIZE;

    onProgress({
      step: "ranking",
      current: batchStart + 1,
      total: candidatesWithTrust.length,
      batchEnd: Math.min(batchStart + BATCH_SIZE, candidatesWithTrust.length),
      label: `Analyzing candidate ${batchStart + 1}-${Math.min(batchStart + BATCH_SIZE, candidatesWithTrust.length)} of ${candidatesWithTrust.length}`,
    });

    const batchResults = await rankBatch(job, batch, jobIntel);
    allResults.push(...batchResults);
  }

  // Step 3: Compute overall scores and build final rankings
  onProgress({ step: "finalizing", label: "Computing final scores..." });

  const resultMap = {};
  allResults.forEach(r => { resultMap[r.candidate_id] = r; });

  const finalRankings = candidatesWithTrust.map(c => {
    const r = resultMap[c.id] || {};
    const subScores = {
      semantic_fit: r.semantic_fit || 0,
      skill_proof: r.skill_proof || 0,
      experience_match: r.experience_match || 0,
      project_quality: r.project_quality || 0,
      career_growth: r.career_growth || 0,
      behavioral_signal: r.behavioral_signal || 0,
    };

    const trust = c._trust_breakdown;
    const riskLevel = trust?.risk_level || "medium";
    const overall = computeOverallScore(subScores, riskLevel);

    // Fall back to candidate_intelligence transferable_skills if LLM didn't provide one
    let topTransferable = r.top_transferable_skill;
    if (!topTransferable || topTransferable === "N/A") {
      const transferable = c.candidate_intelligence?.transferable_skills;
      topTransferable = transferable && transferable.length > 0 ? transferable[0] : null;
    }

    return {
      job_id: job.id,
      candidate_id: c.id,
      overall_score: overall,
      sub_scores: subScores,
      trust_score: trust?.trust_score || 0,
      risk_level: riskLevel,
      explanation: r.explanation || "",
      top_transferable_skill: topTransferable && topTransferable !== "N/A" ? topTransferable : null,
    };
  });

  finalRankings.sort((a, b) => b.overall_score - a.overall_score);
  finalRankings.forEach((r, idx) => { r.rank_position = idx + 1; });

  return finalRankings;
}