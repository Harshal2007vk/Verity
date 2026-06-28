import { Router } from 'express';
import { getSupabase } from '../database/db';
import { chatWithContext } from '../services/aiService';
import Groq from 'groq-sdk';
import dotenv from 'dotenv';
dotenv.config();

const router = Router();

let _groq: Groq | null = null;
function getGroq(): Groq {
  if (!_groq) _groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });
  return _groq;
}

// ─── /api/ai/invoke-llm ──────────────────────────────────────────────────────
router.post('/invoke-llm', async (req, res) => {
  try {
    const { prompt, response_json_schema } = req.body;
    if (!prompt) return res.status(400).json({ error: 'prompt is required' });

    const response = await getGroq().chat.completions.create({
      model: 'openai/gpt-oss-20b',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' }
    });

    const text = response.choices[0]?.message?.content || '{}';
    let parsed: any = {};
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      console.error('Failed to parse LLM JSON response:', e);
      return res.status(500).json({ error: 'LLM returned invalid JSON', raw: text });
    }

    res.json(parsed);
  } catch (error: any) {
    console.error('invoke-llm error:', error);
    res.status(500).json({ error: 'LLM invocation failed', details: error?.message });
  }
});

// ─── /api/ai/copilot ─────────────────────────────────────────────────────────
router.post('/copilot', async (req, res) => {
  try {
    const { prompt, jobId } = req.body;
    const supabase = getSupabase();
    const { data: jobs } = await supabase.from('jobs').select('id, title, skills').limit(10);
    const { data: candidates } = await supabase.from('candidates').select('id, full_name, current_title, skills').limit(20);
    let rankings: any[] = [];
    if (jobId) {
      const { data } = await supabase.from('ranking_results').select('*').eq('job_id', jobId);
      rankings = data || [];
    }
    const context = { jobs: jobs || [], candidates: candidates || [], rankings };
    const reply = await chatWithContext(prompt, context);
    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Copilot failed' });
  }
});

// ─── /api/ai/discover-hidden-talent ──────────────────────────────────────────
router.post('/discover-hidden-talent', async (req, res) => {
  try {
    const { jobId } = req.body;
    const supabase = getSupabase();
    const { data: jobArr, error: jobErr } = await supabase.from('jobs').select('*').eq('id', jobId);
    if (jobErr || !jobArr || jobArr.length === 0) return res.status(404).json({ error: 'Job not found' });
    const job = jobArr[0];
    
    const { data: candidatesData, error: candErr } = await supabase
      .from('candidates')
      .select('id, full_name, current_title, skills')
      .limit(50);
    if (candErr) throw new Error(candErr.message);
    const candidates: any[] = candidatesData || [];

    const results = [];
    const reqSkills: string[] = Array.isArray(job.skills) ? job.skills : [];

    for (const c of candidates) {
      const cSkills: string[] = Array.isArray(c.skills) ? c.skills : [];
      let matchCount = 0;

      for (const rs of reqSkills) {
        if (cSkills.some((cs: string) => cs.toLowerCase().includes(rs.toLowerCase()))) {
          matchCount++;
        }
      }

      const keywordMatchPercent = reqSkills.length > 0 ? matchCount / reqSkills.length : 1;
      const semanticScore = 70; // placeholder without embeddings

      if (keywordMatchPercent < 0.5 && cSkills.length > 2) {
        results.push({
          candidate: { id: c.id, full_name: c.full_name, current_title: c.current_title, skills: cSkills },
          semanticScore,
          keywordMatchPercent: Math.round(keywordMatchPercent * 100),
          reason: `Candidate lacks exact keywords (${Math.round(keywordMatchPercent * 100)}% match) but may have transferable skills worth exploring.`
        });
      }
    }

    results.sort((a, b) => b.semanticScore - a.semanticScore);
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to discover talent' });
  }
});

export default router;
