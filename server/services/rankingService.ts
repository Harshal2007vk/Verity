import Groq from 'groq-sdk';
import { calculateTrustScore } from './trustService';
import dotenv from 'dotenv';
dotenv.config();

let _groq: Groq | null = null;

function getGroq(): Groq {
  if (!_groq) {
    if (!process.env.GROQ_API_KEY) throw new Error('GROQ_API_KEY is not set');
    _groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return _groq;
}

export async function generateRanking(job: any, candidate: any, semanticScorePercent: number) {
  const { score: trustScore, riskLevel } = await calculateTrustScore(candidate);

  const prompt = `
You are an elite AI technical recruiter. Evaluate this candidate against the job description.
Your goal is NOT keyword matching — evaluate evidence, real-world impact, and transferable skills.

Return ONLY valid JSON matching this schema exactly:
{
  "skill_depth_score": 0,
  "experience_quality_score": 0,
  "project_impact_score": 0,
  "behavioral_signal_score": 0,
  "strengths": ["string", "string", "string"],
  "gaps": ["string"],
  "top_transferable_skill": "string",
  "hiring_recommendation": "Needs Verification",
  "confidence_percent": 0,
  "rank_reasoning": "string (2-3 sentences explaining the rank, referencing specific evidence from the candidate's resume)"
}

JOB:
Title: ${job.title}
Description: ${job.description}
Required Skills: ${Array.isArray(job.skills) ? job.skills.join(', ') : ''}

CANDIDATE:
Name: ${candidate.full_name}
Title: ${candidate.current_title}
Skills Claimed: ${Array.isArray(candidate.skills_claimed) ? candidate.skills_claimed.join(', ') : (Array.isArray(candidate.skills) ? candidate.skills.join(', ') : '')}
Work History: ${JSON.stringify(candidate.work_history || []).substring(0, 1500)}
Resume: ${(candidate.resume_text || '').substring(0, 2000)}
Evidence Links: ${JSON.stringify(candidate.evidence_links || [])}
`;

  let aiScores = {
    skill_depth_score: 50,
    experience_quality_score: 50,
    project_impact_score: 50,
    behavioral_signal_score: 50,
    strengths: ['Has relevant experience', 'Matches some requirements'],
    gaps: ['Limited evidence provided'],
    top_transferable_skill: 'Problem Solving',
    hiring_recommendation: 'Needs Verification',
    confidence_percent: 50,
    rank_reasoning: 'Candidate has some matching skills but limited verifiable evidence to make a strong determination.'
  };

  try {
    const response = await getGroq().chat.completions.create({
      model: 'llama3-8b-8192',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' }
    });
    const parsed = JSON.parse(response.choices[0]?.message?.content || '{}');
    aiScores = { ...aiScores, ...parsed };
  } catch (e) {
    console.error('Groq ranking error:', e);
  }

  const semanticFitScore = semanticScorePercent;
  const overallScore = Math.round(
    semanticFitScore * 0.40 +
    aiScores.skill_depth_score * 0.20 +
    aiScores.experience_quality_score * 0.15 +
    aiScores.project_impact_score * 0.15 +
    trustScore * 0.10
  );

  return {
    overall_score: overallScore,
    trust_score: trustScore,
    risk_level: riskLevel,
    explanation: aiScores.rank_reasoning,
    strengths: aiScores.strengths,
    gaps: aiScores.gaps,
    top_transferable_skill: aiScores.top_transferable_skill,
    hiring_recommendation: aiScores.hiring_recommendation,
    confidence_percent: aiScores.confidence_percent,
    sub_scores: {
      semantic_fit: semanticFitScore,
      skill_proof: aiScores.skill_depth_score,
      experience_match: aiScores.experience_quality_score,
      project_quality: aiScores.project_impact_score,
      career_growth: aiScores.experience_quality_score,
      behavioral_signal: aiScores.behavioral_signal_score
    }
  };
}
