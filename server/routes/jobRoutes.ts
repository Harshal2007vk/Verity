import { Router } from 'express';
import { getSupabase } from '../database/db';
import { generateEmbedding, getJobEmbeddingText } from '../services/embeddingService';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { data, error } = await getSupabase().from('jobs').select('*').order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    res.json(data || []);
  } catch (error: any) {
    console.error('GET /jobs error:', error);
    res.status(500).json({ error: 'Database error', details: error?.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await getSupabase().from('jobs').select('*').eq('id', req.params.id).single();
    if (error) return res.status(404).json({ error: 'Job not found' });
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const j = req.body;
    const id = `job_${Date.now()}`;

    // Generate embedding (best-effort; non-blocking failure)
    let embedding: number[] = [];
    try {
      const embeddingText = getJobEmbeddingText(j);
      embedding = await generateEmbedding(embeddingText);
    } catch (e) {
      console.warn('Embedding skipped:', e);
    }

    // Base columns — always present
    const baseRow: Record<string, any> = {
      id,
      title: j.title,
      description: j.description || j.raw_description || null,
      department: j.department || null,
      location: j.location || null,
      type: j.type || null,
      experience: j.experience || null,
      salary: j.salary || null,
      skills: j.skills || [],
    };

    // Extended columns — added by migration
    const extendedRow: Record<string, any> = {
      ...baseRow,
      raw_description: j.raw_description || j.description || null,
      team_context: j.team_context || null,
      job_intelligence: j.job_intelligence || {},
      status: j.status || 'active',
    };

    let data: any = null;
    let insertError: any = null;

    ({ data, error: insertError } = await getSupabase().from('jobs').insert(extendedRow).select().single());

    if (insertError && (
      insertError.message?.includes('column') ||
      insertError.message?.includes('schema cache') ||
      insertError.message?.includes('not found') ||
      insertError.code === 'PGRST204' ||
      insertError.code === '42703'
    )) {
      console.warn('Extended job columns missing, using base:', insertError.message);
      ({ data, error: insertError } = await getSupabase().from('jobs').insert(baseRow).select().single());
    }

    if (insertError) throw new Error(insertError.message);
    res.status(201).json(data || { id, ...j });
  } catch (error: any) {
    console.error('POST /jobs error:', error);
    if (error?.cause) console.error('Error cause:', error.cause);
    res.status(500).json({ error: 'Failed to create job', details: error?.message });
  }
});

export default router;
