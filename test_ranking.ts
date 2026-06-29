import dotenv from 'dotenv';
dotenv.config();

import { getSupabase, initDb } from './server/database/db';
import { generateRanking } from './server/services/rankingService';

async function testRanking() {
  await initDb();
  const supabase = getSupabase();
  
  // Get Job 1
  const { data: jobs } = await supabase.from('jobs').select('*').limit(1);
  if (!jobs || jobs.length === 0) {
    console.error("No jobs found");
    return;
  }
  const job = jobs[0];
  
  // Get Candidate 1
  const { data: candidates } = await supabase.from('candidates').select('*').limit(1);
  if (!candidates || candidates.length === 0) {
    console.error("No candidates found");
    return;
  }
  const candidate = candidates[0];
  
  console.log(`Ranking candidate: ${candidate.full_name} for job: ${job.title}`);
  
  try {
    const result = await generateRanking(job, candidate, 50);
    console.log("Success! Result:", JSON.stringify(result, null, 2));
  } catch (err: any) {
    console.error("RANKING ERROR:", err);
    if (err.error) console.error("Details:", JSON.stringify(err.error, null, 2));
  }
}

testRanking();
