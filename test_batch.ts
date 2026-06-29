import dotenv from 'dotenv';
import Groq from 'groq-sdk';
dotenv.config();

import { getSupabase } from './server/database/db';

async function testBatch() {
  const supabase = getSupabase();
  
  const { data: jobs } = await supabase.from('jobs').select('*').limit(1);
  const { data: candidates } = await supabase.from('candidates').select('*').limit(10);
  
  if (!jobs || !candidates) return;
  
  const summaries = candidates.map((c: any) => ({
    full_name: c.full_name,
    resume_snippet: (c.resume_text || "").substring(0, 1000),
    // Simulate what rankBatch does
  }));
  
  const prompt = `You are Verity's AI Ranking Engine.
JOB: ${jobs[0].title}
CANDIDATES: ${JSON.stringify(summaries)}`;

  console.log(`Prompt length: ${prompt.length} characters`);
  
  try {
    const res = await fetch(`http://localhost:${process.env.PORT || 5000}/api/ai/invoke-llm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        response_json_schema: { type: "object", properties: { status: { type: "string" } } }
      })
    });
    
    if (!res.ok) {
      const err = await res.text();
      console.error(`HTTP ${res.status}: ${err}`);
    } else {
      console.log("Success:", await res.json());
    }
  } catch (err) {
    console.error("Fetch error:", err);
  }
}
testBatch();
