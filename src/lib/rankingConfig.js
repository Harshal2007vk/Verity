const DEFAULT_WEIGHTS = {
  semantic_fit: 30,
  skill_proof: 20,
  experience_match: 15,
  project_quality: 10,
  career_growth: 10,
  behavioral_signal: 10,
};

const DEFAULT_RISK_PENALTY_STRENGTH = 50;

export const WEIGHT_KEYS = [
  "semantic_fit",
  "skill_proof",
  "experience_match",
  "project_quality",
  "career_growth",
  "behavioral_signal",
];

export const WEIGHT_LABELS = {
  semantic_fit: "Semantic Fit",
  skill_proof: "Skill Proof",
  experience_match: "Experience Match",
  project_quality: "Project Quality",
  career_growth: "Career Growth",
  behavioral_signal: "Behavioral Signal",
};

export const DEFAULT_WEIGHTS_REF = { ...DEFAULT_WEIGHTS };
export const DEFAULT_RISK_PENALTY_REF = DEFAULT_RISK_PENALTY_STRENGTH;

export function getWeights() {
  try {
    const stored = localStorage.getItem("verity_weights");
    return stored ? { ...DEFAULT_WEIGHTS, ...JSON.parse(stored) } : { ...DEFAULT_WEIGHTS };
  } catch {
    return { ...DEFAULT_WEIGHTS };
  }
}

export function setWeights(weights) {
  localStorage.setItem("verity_weights", JSON.stringify(weights));
}

export function resetWeights() {
  localStorage.removeItem("verity_weights");
}

export function getRiskPenaltyStrength() {
  try {
    const stored = localStorage.getItem("verity_risk_penalty");
    return stored ? JSON.parse(stored) : DEFAULT_RISK_PENALTY_STRENGTH;
  } catch {
    return DEFAULT_RISK_PENALTY_STRENGTH;
  }
}

export function setRiskPenaltyStrength(strength) {
  localStorage.setItem("verity_risk_penalty", JSON.stringify(strength));
}

export function resetRiskPenaltyStrength() {
  localStorage.removeItem("verity_risk_penalty");
}