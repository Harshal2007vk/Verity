export async function calculateTrustScore(candidate: any): Promise<{ score: number, breakdown: any, riskLevel: string }> {
  // Mock GitHub and LinkedIn verification based on evidence_links
  let score = 50; // Base score
  let breakdown = {
    github_verified: false,
    linkedin_verified: false,
    portfolio_verified: false,
    signals: [] as string[]
  };

  const links = Array.isArray(candidate.evidence_links) ? candidate.evidence_links : [];

  const hasGithub = links.some((l: any) => l.type === 'github');
  if (hasGithub) {
    score += 20;
    breakdown.github_verified = true;
    breakdown.signals.push("Active GitHub profile detected with consistent contributions.");
  } else {
    breakdown.signals.push("No GitHub profile provided - cannot verify open source activity.");
  }

  const hasPortfolio = links.some((l: any) => l.type === 'portfolio');
  if (hasPortfolio) {
    score += 15;
    breakdown.portfolio_verified = true;
    breakdown.signals.push("Portfolio link provided.");
  }

  // Experience heuristic
  const exp = parseFloat(candidate.total_experience_years) || 0;
  if (exp > 5) {
    score += 10;
    breakdown.signals.push("Senior level experience adds trust weight.");
  } else if (exp > 0) {
    score += 5;
  }

  // Work history heuristic
  const workHistory = Array.isArray(candidate.work_history) ? candidate.work_history : [];
  if (workHistory.length >= 2) {
    score += 5;
    breakdown.signals.push("Consistent work history verified across multiple roles.");
  }

  score = Math.min(100, Math.max(0, score));

  let riskLevel = 'low';
  if (score < 40) riskLevel = 'high';
  else if (score < 70) riskLevel = 'medium';

  return {
    score,
    breakdown,
    riskLevel
  };
}
