import dotenv from 'dotenv';
dotenv.config();
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false }
});

async function createTables() {
  console.log('Creating tables via Supabase REST API...');

  // Test connection
  const { error: testErr } = await supabase.from('jobs').select('id').limit(1);
  
  if (!testErr) {
    console.log('✓ Tables already exist');
    return;
  }

  if (testErr.code === '42P01') {
    console.log('Tables not found. Cannot create via REST API - need SQL Editor access.');
    console.log('');
    console.log('Please run supabase_setup.sql in your Supabase Dashboard:');
    console.log('https://supabase.com/dashboard/project/kbxspgutsgeybrsjrbfi/sql/new');
    process.exit(1);
  }

  console.error('Connection error:', testErr);
}

createTables().catch(console.error);
