import Groq from 'groq-sdk';
import dotenv from 'dotenv';
dotenv.config();

async function testGroq() {
  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    
    // Test 1: List models
    console.log("Fetching available models...");
    const models = await groq.models.list();
    console.log("Available models:", models.data.map((m: any) => m.id).join(', '));
    
    // Test 2: Dummy invocation using the exact model specified in the code
    console.log("\nAttempting to invoke model 'openai/gpt-oss-20b' (from rankingService.ts)...");
    const response = await groq.chat.completions.create({
      model: 'openai/gpt-oss-20b',
      messages: [{ role: 'user', content: "Hello, reply in JSON with {'status': 'ok'}" }],
      response_format: { type: 'json_object' }
    });
    console.log("Success! Response:", response.choices[0]?.message?.content);
  } catch (error: any) {
    console.error("\n=== ACTUAL ERROR RESPONSE ===");
    console.error("Status Code:", error.status);
    console.error("Error Name:", error.name);
    console.error("Error Message:", error.message);
    if (error.error) {
      console.error("Error Details:", JSON.stringify(error.error, null, 2));
    }
  }
}

testGroq();
