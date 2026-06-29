import { seedDemoData } from './src/lib/seedData.js';
import { base44 } from './src/api/base44Client.js';
import dotenv from 'dotenv';
dotenv.config();

// Ensure base44 client uses Supabase directly or hits local if needed.
// Wait, seedDemoData just uses base44.entities.* to create jobs and candidates.
// It will try to fetch to API_BASE.
console.log("Seeding live database...");

async function runSeed() {
  try {
    await seedDemoData();
    console.log("Seeding complete!");
  } catch (err) {
    console.error("Seeding failed:", err);
  }
}

runSeed();
