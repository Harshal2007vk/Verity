import { Router } from 'express';
import multer from 'multer';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');
import { getSupabase } from '../database/db';
import { extractResumeData } from '../services/aiService';
import { generateEmbedding, getCandidateEmbeddingText } from '../services/embeddingService';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// ─── GET /api/candidates ──────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { data, error } = await getSupabase()
      .from('candidates')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    const candidates = (data || []).map((c: any) => ({
      ...c,
      skills_claimed: c.skills || [],
      evidence_links: c.evidence_links || [],
      behavioral_signals: c.behavioral_signals || {},
      candidate_intelligence: c.candidate_intelligence || {},
      education: c.education || [],
      trust_breakdown: c.trust_breakdown || {},
    }));
    res.json(candidates);
  } catch (error: any) {
    console.error('GET /candidates error:', error);
    res.status(500).json({ error: 'Database error', details: error?.message });
  }
});

// ─── GET /api/candidates/:id ──────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await getSupabase()
      .from('candidates')
      .select('*')
      .eq('id', req.params.id)
      .single();
    if (error) return res.status(404).json({ error: 'Candidate not found' });
    res.json({ ...data, skills_claimed: data.skills || [] });
  } catch (error: any) {
    res.status(500).json({ error: 'Database error' });
  }
});

// ─── POST /api/candidates ─────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const c = req.body;
    const id = `cand_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // Embedding (best-effort — skip if Gemini unavailable)
    try {
      const embText = getCandidateEmbeddingText(c);
      await generateEmbedding(embText); // result not used for REST-based DB
    } catch (e) {
      console.warn('Embedding skipped for candidate');
    }

    // Base columns — always exist
    const baseRow: Record<string, any> = {
      id,
      full_name: c.full_name,
      current_title: c.current_title || null,
      email: c.email || null,
      phone: c.phone || null,
      location: c.location || null,
      resume_text: c.resume_text || null,
      skills: c.skills_claimed || [],
      work_history: c.work_history || [],
    };

    // Extended columns (added by migration SQL — fall back gracefully if missing)
    const extendedRow: Record<string, any> = {
      ...baseRow,
      current_company: c.current_company || null,
      total_experience_years: c.total_experience_years || null,
      education: c.education || [],
      evidence_links: c.evidence_links || [],
      behavioral_signals: c.behavioral_signals || {},
      candidate_intelligence: c.candidate_intelligence || {},
      trust_breakdown: c.trust_breakdown || {},
    };

    // Try full insert, fall back to base-only if extended columns missing
    let data: any = null;
    let insertError: any = null;

    ({ data, error: insertError } = await getSupabase()
      .from('candidates').insert(extendedRow).select().single());

    if (insertError && (
      insertError.message?.includes('column') ||
      insertError.message?.includes('schema cache') ||
      insertError.message?.includes('not found') ||
      insertError.code === 'PGRST204' ||
      insertError.code === '42703'
    )) {
      console.warn('Extended columns not found, using base columns:', insertError.message);
      ({ data, error: insertError } = await getSupabase()
        .from('candidates').insert(baseRow).select().single());
    }

    if (insertError) throw new Error(insertError.message);

    const result = data || { id, ...c };
    res.status(201).json({ ...result, skills_claimed: result.skills || c.skills_claimed || [] });
  } catch (error: any) {
    console.error('POST /candidates error:', error);
    res.status(500).json({ error: 'Failed to create candidate', details: error?.message });
  }
});

// ─── POST /api/candidates/upload ─────────────────────────────────────────────
router.post('/upload', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    // Parse PDF text
    let text = '';
    try {
      const parser = new pdfParse.PDFParse({ data: req.file.buffer });
      const parsed = await parser.getText();
      text = parsed.text || '';
      await parser.destroy();
    } catch (e) {
      console.error("PDF Parsing Error:", e);
      return res.status(400).json({ error: 'Could not parse PDF. Please ensure it is a valid PDF file.' });
    }

    if (!text.trim()) {
      return res.status(400).json({ error: 'PDF appears to be empty or image-only (no extractable text).' });
    }

    // Upload to Supabase Storage (best-effort)
    let resumeUrl: string | null = null;
    try {
      const filename = `${Date.now()}_${req.file.originalname.replace(/\s/g, '_')}`;
      const { data: storageData, error: storageError } = await getSupabase()
        .storage
        .from('resumes')
        .upload(filename, req.file.buffer, { contentType: req.file.mimetype });
      if (!storageError && storageData) {
        const { data: urlData } = getSupabase().storage.from('resumes').getPublicUrl(storageData.path);
        resumeUrl = urlData?.publicUrl || null;
      }
    } catch (e) {
      console.warn('Storage upload skipped:', e);
    }

    // Extract structured data with Gemini
    const extractedData = await extractResumeData(text);
    if (!extractedData) {
      return res.status(500).json({ error: 'Failed to extract data from resume with AI' });
    }

    extractedData.resume_text = text;
    if (resumeUrl) extractedData.resume_url = resumeUrl;

    res.json(extractedData);
  } catch (error: any) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to process resume', details: error?.message });
  }
});

// ─── DELETE /api/candidates/:id ───────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const { error } = await getSupabase()
      .from('candidates')
      .delete()
      .eq('id', req.params.id);
    if (error) throw new Error(error.message);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete candidate' });
  }
});

// ─── PATCH /api/candidates/:id ────────────────────────────────────────────────
router.patch('/:id', async (req, res) => {
  try {
    const c = req.body;
    const updateData: Record<string, any> = {
      full_name: c.full_name,
      current_title: c.current_title || null,
      email: c.email || null,
      location: c.location || null,
      resume_text: c.resume_text || null,
      skills: c.skills_claimed || c.skills || [],
      work_history: c.work_history || [],
    };
    const { data, error } = await getSupabase()
      .from('candidates')
      .update(updateData)
      .eq('id', req.params.id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    res.json({ ...data, skills_claimed: data.skills || [] });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update candidate' });
  }
});

export default router;
