import { base44 } from "@/api/base44Client";

export async function verifyCandidateTrust(candidate) {
  const evidenceLinks = (candidate.evidence_links || []).map(ev =>
    `[${ev.type}] ${ev.url || "N/A"} — ${ev.description || "No description"}`
  ).join("\n");

  const workHistory = (candidate.work_history || []).map(w =>
    `- ${w.title} at ${w.company} (${w.start_date} - ${w.end_date || "Present"}): ${w.description || ""}`
  ).join("\n");

  const education = (candidate.education || []).map(e =>
    `- ${e.degree}, ${e.institution} (${e.year})`
  ).join("\n");

  const result = await base44.integrations.Core.InvokeLLM({
    prompt: `You are Verity's Trust Verification Engine. Your job is to audit candidate credibility.

PHILOSOPHY: "A resume is a claim. We verify against evidence."

You are NOT ranking this candidate. You are conducting a credibility audit — treating every resume statement as a claim that must be verified against available evidence.

CANDIDATE:
Name: ${candidate.full_name}
Current Title: ${candidate.current_title || "N/A"}
Current Company: ${candidate.current_company || "N/A"}
Total Experience: ${candidate.total_experience_years || 0} years

SKILLS CLAIMED: ${(candidate.skills_claimed || []).join(", ")}

WORK HISTORY:
${workHistory || "None provided"}

EDUCATION:
${education || "None provided"}

EVIDENCE LINKS (proof layer):
${evidenceLinks || "None provided"}

RESUME TEXT:
${(candidate.resume_text || "").substring(0, 3000)}

NOW CONDUCT THE AUDIT:

STEP 1 — EXTRACT CLAIMS: Extract 5-12 distinct, verifiable claims from the resume. Focus on:
- Skill proficiency claims (e.g., "Expert in Python")
- Impact/achievement claims (e.g., "Led ML deployment for 2M users")
- Experience claims (e.g., "5+ years in ML")
- Role/responsibility claims (e.g., "Built recommendation engine at X")

STEP 2 — CROSS-REFERENCE: For each claim, reason about:
- Plausibility: Does this fit the candidate's career trajectory and experience level?
- Specificity: Is the claim specific enough to be verifiable?
- Consistency: Does it align with the rest of the profile (work history, education, evidence)?

STEP 3 — CLASSIFY: For each claim, assign one of:
- "supported": Evidence directly backs this claim (GitHub repo, publication, certificate, or concrete work history detail confirms it)
- "plausible": Consistent with trajectory but no direct evidence — reasonable but unverified
- "unsupported": Vague, inflated, or inconsistent with the rest of the profile (e.g., "Expert" in a skill with no corroborating project, role, or duration; or a claim that contradicts the work history timeline)

STEP 4 — FLAG SUSPICIOUS PATTERNS: Identify any red flags:
- Wildly inconsistent seniority claims (e.g., "Senior" with 1 year experience)
- Skill lists that don't match role history (e.g., claiming DevOps with no DevOps roles)
- Timeline gaps or overlaps
- Inflated titles or responsibilities
- Claims that contradict each other

STEP 5 — OUTPUT: Provide trust_score (0-100), risk_level, and rationale. Scoring guide:
- 75-100 (low risk): Most claims supported, no major suspicious patterns
- 50-74 (medium risk): Mix of supported and plausible, some unverified claims
- 0-49 (high risk): Multiple unsupported claims or suspicious patterns

Be rigorous and skeptical. A claim is only "supported" if there is concrete evidence backing it.`,
    response_json_schema: {
      type: "object",
      properties: {
        trust_score: { type: "number" },
        risk_level: { type: "string" },
        risk_rationale: { type: "string" },
        claims: {
          type: "array",
          items: {
            type: "object",
            properties: {
              claim: { type: "string" },
              status: { type: "string" },
              reasoning: { type: "string" }
            }
          }
        },
        suspicious_patterns: {
          type: "array",
          items: { type: "string" }
        },
        summary: { type: "string" }
      }
    },
    model: "claude_sonnet_4_6"
  });

  return result;
}