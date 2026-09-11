import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
console.log('Testing with API key:', apiKey.slice(0, 10) + '...');

const genAI = new GoogleGenerativeAI(apiKey);

async function runTest() {
  const modelsToTest = ['gemini-3.6-flash', 'gemini-2.5-flash', 'gemini-1.5-flash-latest', 'gemini-pro'];
  for (const m of modelsToTest) {
    try {
      console.log(`Trying model: ${m}...`);
      const model = genAI.getGenerativeModel({ model: m });
      const result = await model.generateContent('Return JSON: {"status": "SUCCESS", "message": "Gemini operational"}');
      console.log(`Success with ${m}! Output:`, result.response.text());
      return;
    } catch (e) {
      console.warn(`Failed with ${m}:`, e.message);
    }
  }
}

runTest();
