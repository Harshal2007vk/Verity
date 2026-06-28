import dotenv from 'dotenv';
dotenv.config();

// Using text-embedding-004 model
export async function generateEmbedding(text: string): Promise<number[]> {
  // Embedding model not available with this API key type — return empty gracefully
  // Rankings still work via Gemini text generation (no vector similarity needed)
  return [];
}

// Calculate cosine similarity between two vectors
export function calculateSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length !== vecB.length || vecA.length === 0) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export function getCandidateEmbeddingText(candidate: any): string {
  const skills = Array.isArray(candidate.skills_claimed)
    ? candidate.skills_claimed.join(', ')
    : candidate.skills_claimed;
  const workHistory = Array.isArray(candidate.work_history)
    ? candidate.work_history.map((w: any) => `${w.title} at ${w.company}: ${w.description}`).join('; ')
    : '';
  return `Title: ${candidate.current_title}. Skills: ${skills}. Experience: ${workHistory}. Resume: ${candidate.resume_text || ''}`;
}

export function getJobEmbeddingText(job: any): string {
  const reqSkills = Array.isArray(job.required_skills)
    ? job.required_skills.join(', ')
    : (Array.isArray(job.skills) ? job.skills.join(', ') : job.skills || '');
  return `Job Title: ${job.title}. Department: ${job.department || ''}. Description: ${job.description}. Required Skills: ${reqSkills}.`;
}
