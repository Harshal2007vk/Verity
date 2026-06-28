const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://kbxspgutsgeybrsjrbfi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtieHNwZ3V0c2dleWJyc2pyYmZpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjU0MTQwOSwiZXhwIjoyMDk4MTE3NDA5fQ.maxOrZkEP90Ht_EB8XbxfAAAel7Jvm6xDK_DVyxdy8I';
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
