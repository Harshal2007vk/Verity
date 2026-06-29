import dotenv from 'dotenv';
dotenv.config();
import { Client } from 'pg';

async function migrate() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("Connected to DB, running migrations...");

    // Jobs table missing columns
    try { await client.query('ALTER TABLE jobs ADD COLUMN raw_description TEXT;'); } catch(e) {}
    try { await client.query('ALTER TABLE jobs ADD COLUMN team_context TEXT;'); } catch(e) {}
    try { await client.query('ALTER TABLE jobs ADD COLUMN status TEXT;'); } catch(e) {}
    try { await client.query('ALTER TABLE jobs ADD COLUMN job_intelligence JSONB;'); } catch(e) {}

    // Candidates table missing columns
    try { await client.query('ALTER TABLE candidates ADD COLUMN current_company TEXT;'); } catch(e) {}
    try { await client.query('ALTER TABLE candidates ADD COLUMN total_experience_years INTEGER;'); } catch(e) {}
    try { await client.query('ALTER TABLE candidates ADD COLUMN education JSONB;'); } catch(e) {}
    try { await client.query('ALTER TABLE candidates ADD COLUMN evidence_links JSONB;'); } catch(e) {}
    try { await client.query('ALTER TABLE candidates ADD COLUMN behavioral_signals JSONB;'); } catch(e) {}
    try { await client.query('ALTER TABLE candidates ADD COLUMN candidate_intelligence JSONB;'); } catch(e) {}
    
    console.log("Migrations applied successfully.");
  } catch (err) {
    console.error("Migration error:", err);
  } finally {
    await client.end();
  }
}

migrate();
