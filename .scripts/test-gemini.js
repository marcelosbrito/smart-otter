const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
    const result = await model.generateContent('Say only "OK" if you can read this.');
    console.log('✅ Gemini API working:', result.response.text());
  } catch (e) {
    console.error('❌ Gemini API error:', e.message);
  }
}

testGemini();
