import { Router, Request, Response } from 'express';
import { getSupabase } from '../database/db';
import { generateRanking } from '../services/rankingService';

const router = Router();

router.post('/rank-candidates', async (req: Request, res: Response) => {
  try {
    const { jobId, candidates } = req.body;
    if (!jobId) return res.status(400).json({ error: 'jobId is required' });

    // Fetch job
    const { data: jobData, error: jobError } = await getSupabase()
      .from('jobs').select('*').eq('id', jobId).single();
    if (jobError || !jobData) return res.status(404).json({ error: 'Job not found' });
    const job = jobData;

    if (!candidates || candidates.length === 0) return res.json([]);

    const results: any[] = [];
    for (const c of candidates) {
      const semanticScorePercent = 50; // Default without pgvector
      const rankingData = await generateRanking(job, c, semanticScorePercent);
      results.push({ candidate_id: c.id, ...rankingData });
    }

    // Sort by overall score
    results.sort((a, b) => b.overall_score - a.overall_score);

    // Upsert to DB
    for (let i = 0; i < results.length; i++) {
      const r = results[i];
      const resultId = `${jobId}_${r.candidate_id}`;
      r.rank_position = i + 1;
      r.id = resultId;

      // Upsert (delete+insert)
      await getSupabase().from('ranking_results').delete()
        .eq('candidate_id', r.candidate_id).eq('job_id', jobId);

      await getSupabase().from('ranking_results').insert({
        id: resultId,
        candidate_id: r.candidate_id,
        job_id: jobId,
        overall_score: r.overall_score,
        rank_position: r.rank_position,
        risk_level: r.risk_level,
        top_transferable_skill: r.top_transferable_skill || null,
        sub_scores: r.sub_scores || {},
        explanation: r.explanation || '',
        strengths: r.strengths || [],
        gaps: r.gaps || [],
        hiring_recommendation: r.hiring_recommendation || 'Needs Verification',
        confidence_percent: r.confidence_percent || 50,
        trust_score: r.trust_score || 0,
      });
    }

    res.json(results);
  } catch (error: any) {
    console.error('Ranking error:', error);
    res.status(500).json({ error: 'Failed to rank candidates', details: error?.message });
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const { data, error } = await getSupabase()
      .from('ranking_results')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    res.json(data || []);
  } catch (error: any) {
    console.error('GET all rankings error:', error);
    res.status(500).json({ error: 'Database error', details: error?.message });
  }
});

router.get('/:jobId', async (req: Request, res: Response) => {
  try {
    const { data, error } = await getSupabase()
      .from('ranking_results')
      .select('*')
      .eq('job_id', req.params.jobId)
      .order('rank_position', { ascending: true });
    if (error) throw new Error(error.message);
    res.json(data || []);
  } catch (error: any) {
    console.error('GET rankings error:', error);
    res.status(500).json({ error: 'Database error', details: error?.message });
  }
});

export default router;
