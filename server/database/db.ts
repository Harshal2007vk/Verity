import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

let _client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (!_client) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');

    // ── Validate key format ──────────────────────────────────────────────
    // A real Supabase service_role key is a JWT and starts with "eyJ".
    // Publishable / anon keys often start with "sb_publishable_" or similar
    // and will cause silent connection timeouts when used server-side.
    if (!key.startsWith('eyJ')) {
      throw new Error(
        `SUPABASE_SERVICE_ROLE_KEY does not look like a valid service_role JWT.\n` +
        `  Current value starts with: "${key.substring(0, 20)}..."\n` +
        `  Expected: a JWT starting with "eyJ..."\n` +
        `  Fix: Go to Supabase Dashboard → Settings → API → copy the "service_role" secret key.\n` +
        `  ⚠️  Do NOT use the "anon" or "publishable" key for the backend.`
      );
    }

    _client = createClient(url, key, {
      auth: { persistSession: false }
    });
  }
  return _client;
}

// Initialize tables via Supabase RPC (raw SQL)
export async function initDb() {
  const supabase = getClient();

  // Test connection
  const { error: testError } = await supabase.from('jobs').select('id').limit(1);
  
  if (testError && testError.code === '42P01') {
    // Table doesn't exist — we need to create it via the Supabase Dashboard SQL editor
    // (The service role key can't run DDL via REST API directly)
    console.log('Tables not found. Creating via SQL...');
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS jobs (
          id TEXT PRIMARY KEY,
          title TEXT, department TEXT, location TEXT, type TEXT,
          experience TEXT, salary TEXT, description TEXT, raw_description TEXT, team_context TEXT, skills JSONB,
          job_intelligence JSONB,
          status TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS candidates (
          id TEXT PRIMARY KEY, full_name TEXT, current_title TEXT,
          email TEXT, phone TEXT, location TEXT, resume_text TEXT,
          skills JSONB, work_history JSONB, trust_score INTEGER,
          trust_breakdown JSONB, candidate_intelligence JSONB, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS ranking_results (
          id TEXT PRIMARY KEY, job_id TEXT, candidate_id TEXT,
          overall_score INTEGER, rank_position INTEGER, risk_level TEXT,
          top_transferable_skill TEXT, sub_scores JSONB, explanation TEXT,
          strengths JSONB, gaps JSONB, hiring_recommendation TEXT, confidence_percent INTEGER, trust_score INTEGER,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `
    });
  }
  console.log('Database connected');
}

// ─── Generic query helpers (wrap Supabase calls to match existing interface) ──

export async function runQuery(sql: string, params: any[] = []): Promise<void> {
  // For compatibility: used for INSERT, UPDATE, DELETE
  // Parse which table and operation from SQL
  const supabase = getClient();
  // We'll handle specific cases in the routes instead
  // This is a fallback for raw SQL operations
  console.warn('runQuery called with raw SQL - use Supabase client directly:', sql.substring(0, 60));
}

export async function getQuery<T>(sql: string, params: any[] = []): Promise<T[]> {
  const supabase = getClient();
  
  // Parse table from SELECT ... FROM tablename ...
  const fromMatch = sql.match(/FROM\s+(\w+)/i);
  if (!fromMatch) return [];
  const table = fromMatch[1];

  const whereMatch = sql.match(/WHERE\s+(\w+)\s*=\s*\$1/i);
  
  if (whereMatch && params[0]) {
    const col = whereMatch[1];
    const { data, error } = await supabase.from(table).select('*').eq(col, params[0]);
    if (error) throw new Error(error.message);
    return (data || []) as T[];
  }

  const { data, error } = await supabase.from(table).select('*');
  if (error) throw new Error(error.message);
  return (data || []) as T[];
}

export async function getSingleQuery<T>(sql: string, params: any[] = []): Promise<T | null> {
  const rows = await getQuery<T>(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

// ─── Direct Supabase client operations (used by routes) ──────────────────────

export function getSupabase(): SupabaseClient {
  return getClient();
}
