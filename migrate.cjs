const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseKey) {
  console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env');
  process.exit(1);
}
const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false }});
async function migrate() {
  console.log('Running ALTER TABLE migrations...');
  const queries = [
    "ALTER TABLE jobs ADD COLUMN IF NOT EXISTS raw_description TEXT;",
    "ALTER TABLE jobs ADD COLUMN IF NOT EXISTS team_context TEXT;",
    "ALTER TABLE jobs ADD COLUMN IF NOT EXISTS job_intelligence JSONB;",
    "ALTER TABLE jobs ADD COLUMN IF NOT EXISTS status TEXT;",
    "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS candidate_intelligence JSONB;",
    "ALTER TABLE ranking_results ADD COLUMN IF NOT EXISTS strengths JSONB;",
    "ALTER TABLE ranking_results ADD COLUMN IF NOT EXISTS gaps JSONB;",
    "ALTER TABLE ranking_results ADD COLUMN IF NOT EXISTS hiring_recommendation TEXT;",
    "ALTER TABLE ranking_results ADD COLUMN IF NOT EXISTS confidence_percent INTEGER;",
    "ALTER TABLE ranking_results ADD COLUMN IF NOT EXISTS trust_score INTEGER;"
  ];
  for (const sql of queries) {
    const { error } = await supabase.rpc('exec_sql', { sql });
    if (error) console.log('Migration error for ' + sql + ':', error);
    else console.log('Success:', sql);
  }
}
migrate();
