const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({path:'.env.local'});

async function testAll() {
  console.log('=== Environment Variables ===');
  console.log('CLERK_PUBLISHABLE:', process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.substring(0, 30) + '...');
  console.log('CLERK_SECRET:', process.env.CLERK_SECRET_KEY?.substring(0, 20) + '...');
  console.log('GOOGLE_AI_KEY:', process.env.GOOGLE_GENERATIVE_AI_API_KEY ? 'SET' : 'NOT SET');
  
  // Test Gemini
  console.log('\n=== Testing Gemini API ===');
  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent('Say only "OK" if you can read this.');
    console.log('✅ Gemini API working:', result.response.text());
  } catch (e) {
    console.error('❌ Gemini API error:', e.message.split('\n')[0]);
  }

  // Test Clerk - check publishable key format
  console.log('\n=== Testing Clerk Keys ===');
  const pubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const secKey = process.env.CLERK_SECRET_KEY;
  
  if (pubKey?.startsWith('pk_test_') || pubKey?.startsWith('pk_live_')) {
    console.log('✅ Clerk publishable key format valid');
  } else {
    console.error('❌ Invalid Clerk publishable key format');
  }

  if (secKey?.startsWith('sk_test_') || secKey?.startsWith('sk_live_')) {
    console.log('✅ Clerk secret key format valid');
  } else {
    console.error('❌ Invalid Clerk secret key format');
  }

  // Try to verify Clerk keys via API
  try {
    const res = await fetch(`https://clerk.googleapis.com/v1/projects/desired-pigeon-25/accounts?alt=json`, {
      headers: { 'Authorization': `Bearer ${secKey}` }
    });
    if (res.ok) {
      console.log('✅ Clerk secret key is valid');
    } else {
      const data = await res.text();
      console.error(`❌ Clerk secret key invalid (${res.status}):`, data.substring(0, 100));
    }
  } catch (e) {
    console.error('Clerk API check failed:', e.message.split('\n')[0]);
  }

  console.log('\n=== Summary ===');
  const issues = [];
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY?.startsWith('AQ.')) {
    issues.push('- Gemini API key appears invalid (needs valid AIzaSy... or AQ... format)');
  }
  if (!pubKey?.match(/^pk_(test|live)_/)) {
    issues.push('- Clerk publishable key needs pk_test_ or pk_live_ prefix');
  }
  if (!secKey?.match(/^sk_(test|live)_/)) {
    issues.push('- Clerk secret key needs sk_test_ or sk_live_ prefix');
  }

  if (issues.length) {
    console.log('⚠️ Issues found:');
    issues.forEach(i => console.log(i));
    console.log('\nPlease update .env.local with valid keys from:');
    console.log('- Clerk: https://dashboard.clerk.com/');
    console.log('- Gemini: https://aistudio.google.com/app/apikey');
  } else {
    console.log('✅ All key formats are valid');
  }
}

testAll();
