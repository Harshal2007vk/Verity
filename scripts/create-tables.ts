/**
 * Creates Supabase tables using direct pg connection.
 * Run: npx tsx scripts/create-tables.ts
 */
import dotenv from 'dotenv';
dotenv.config();
import { Client } from 'pg';

const DB_URL = process.env.DATABASE_URL;
if (!DB_URL) {
  console.error('DATABASE_URL not set');
  process.exit(1);
}

const SQL = `
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
  created_at TIMESTAMPTZ DEFAULT NOW()
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
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ranking_results (
  id TEXT PRIMARY KEY,
  job_id TEXT,
  candidate_id TEXT,
  overall_score INTEGER,
  rank_position INTEGER,
  risk_level TEXT,
  top_transferable_skill TEXT,
  sub_scores JSONB DEFAULT '{}',
  explanation TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
`;

const client = new Client({ connectionString: DB_URL, ssl: { rejectUnauthorized: false } });

async function main() {
  console.log('Connecting to database...');
  await client.connect();
  console.log('Connected! Creating tables...');
  await client.query(SQL);
  console.log('✓ All tables created successfully');
  await client.end();
}

main().catch(async (e) => {
  console.error('Error:', e.message);
  await client.end().catch(() => {});
  process.exit(1);
});
