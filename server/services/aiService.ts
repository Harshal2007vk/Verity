import Groq from 'groq-sdk';
import dotenv from 'dotenv';
dotenv.config();

let _groq: Groq | null = null;

function getGroq(): Groq {
  if (!_groq) {
    if (!process.env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is not set in environment variables');
    }
    _groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return _groq;
}

export async function extractResumeData(text: string) {
  const prompt = `You are an expert technical recruiter. Extract structured information from this resume.
  Return ONLY a valid JSON object matching this structure:
  {
    "full_name": "string",
    "current_title": "string",
    "current_company": "string",
    "location": "string",
    "total_experience_years": number,
    "skills_claimed": ["string"],
    "work_history": [{"company": "string", "title": "string", "start_date": "string", "end_date": "string", "description": "string"}],
    "education": [{"degree": "string", "institution": "string", "year": "string"}]
  }
  
  Resume Text:
  ${text}`;

  try {
    const response = await getGroq().chat.completions.create({
      model: 'openai/gpt-oss-20b',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' }
    });
    return JSON.parse(response.choices[0]?.message?.content || '{}');
  } catch (error) {
    console.error('Resume extraction error:', error);
    return null;
  }
}

export async function chatWithContext(prompt: string, context: any) {
  const systemPrompt = `You are Verity, an elite enterprise AI recruiter copilot.
  Use the following JSON context about the application's current candidates and jobs to answer the recruiter's questions.
  Keep your answers concise, analytical, and data-driven.
  Context: ${JSON.stringify(context).substring(0, 20000)}`;

  try {
    const response = await getGroq().chat.completions.create({
      model: 'openai/gpt-oss-20b',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ]
    });
    return response.choices[0]?.message?.content || "No response";
  } catch (error) {
    console.error('Copilot chat error:', error);
    return "I'm sorry, I'm having trouble analyzing the data right now.";
  }
}
