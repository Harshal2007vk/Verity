import dotenv from 'dotenv';
dotenv.config();
import { getSupabase, initDb } from './server/database/db';

async function runLiveRanking() {
  await initDb();
  const supabase = getSupabase();
  
  // 1. Get the ML Engineer job
  const { data: jobs } = await supabase.from('jobs').select('*').eq('id', 'job_demo_ml_eng').limit(1);
  if (!jobs || jobs.length === 0) {
    console.error("ML Engineer job not found in DB.");
    return;
  }
  const job = jobs[0];
  
  // 2. Get all ML candidates (they have "cand_demo_ml_" in their ID)
  const { data: candidates } = await supabase.from('candidates').select('*').like('id', 'cand_demo_ml_%');
  if (!candidates || candidates.length === 0) {
    console.error("ML candidates not found in DB.");
    return;
  }
  
  console.log(`Found Job: ${job.title}`);
  console.log(`Found ${candidates.length} candidates: ${candidates.map(c => c.full_name).join(', ')}`);
  console.log("Sending request to LIVE backend...");
  
  try {
    const res = await fetch('http://localhost:5000/api/rankings/rank-candidates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId: job.id, candidates })
    });
    
    if (!res.ok) {
      const errText = await res.text();
      console.error(`Live backend error (${res.status}): ${errText}`);
    } else {
      const rankings = await res.json();
      console.log("\n=== FULL RANKING RESULTS ===");
      rankings.forEach((r: any, idx: number) => {
        const c = candidates.find(cand => cand.id === r.candidate_id);
        console.log(`\nRank #${idx + 1}: ${c?.full_name}`);
        console.log(`Overall Score: ${r.overall_score}`);
        console.log(`Explanation: ${r.explanation}`);
        console.log(`Strengths: ${r.strengths.join(', ')}`);
        console.log(`Gaps: ${r.gaps.join(', ')}`);
        console.log(`Sub-scores:`, r.sub_scores);
      });
    }
  } catch (err) {
    console.error("Failed to connect to live backend:", err);
  }
}

runLiveRanking();
