-- Run this SQL in your Supabase Dashboard SQL Editor:
-- https://supabase.com/dashboard/project/kbxspgutsgeybrsjrbfi/sql/new
--
-- Copy & paste everything below and click "Run"

CREATE TABLE IF NOT EXISTS jobs (
  id TEXT PRIMARY KEY,
  title TEXT,
  department TEXT,
  location TEXT,
  type TEXT,
  experience TEXT,
  salary TEXT,
  description TEXT,
  skills JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS candidates (
  id TEXT PRIMARY KEY,
  full_name TEXT,
  current_title TEXT,
  email TEXT,
  phone TEXT,
  location TEXT,
  resume_text TEXT,
  skills JSONB DEFAULT '[]',
  work_history JSONB DEFAULT '[]',
  trust_score INTEGER,
  trust_breakdown JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ranking_results (
  id TEXT PRIMARY KEY,
  job_id TEXT REFERENCES jobs(id) ON DELETE CASCADE,
  candidate_id TEXT REFERENCES candidates(id) ON DELETE CASCADE,
  overall_score INTEGER,
  rank_position INTEGER,
  risk_level TEXT,
  top_transferable_skill TEXT,
  sub_scores JSONB DEFAULT '{}',
  explanation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) but allow all via service role
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE ranking_results ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (your backend uses service role key)
CREATE POLICY "service_role_jobs" ON jobs FOR ALL USING (true);
CREATE POLICY "service_role_candidates" ON candidates FOR ALL USING (true);
CREATE POLICY "service_role_ranking_results" ON ranking_results FOR ALL USING (true);
