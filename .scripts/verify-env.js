const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({path:'.env.local'});

async function testAll() {
  console.log('=== Smart Otter Environment Verification ===\n');
  
  // Check environment variables exist
  const hasClerkPub = !!(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.length > 10);
  const hasClerkSec = !!(process.env.CLERK_SECRET_KEY && process.env.CLERK_SECRET_KEY.length > 20);
  const hasGemini = !!(process.env.GOOGLE_GENERATIVE_AI_API_KEY && process.env.GOOGLE_GENERATIVE_AI_API_KEY.startsWith('AQ.'));

  console.log('Environment Variables:');
  console.log(`  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: ${hasClerkPub ? '✅ SET' : '❌ MISSING'}`);
  console.log(`  CLERK_SECRET_KEY: ${hasClerkSec ? '✅ SET' : '❌ MISSING'}`);
  console.log(`  GOOGLE_GENERATIVE_AI_API_KEY: ${hasGemini ? '✅ SET' : '❌ MISSING'}`);

  // Test Gemini API with latest model
  console.log('\n=== Testing Gemini AI Provider ===');
  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
    const result = await model.generateContent('Say only "OK" if you can read this.');
    console.log(`✅ Gemini API working (model: gemini-flash-latest)`);
  } catch (e) {
    const errMsg = e.message.split('\n')[0];
    console.error(`❌ Gemini API failed: ${errMsg}`);
    if (errMsg.includes('API key not valid')) {
      console.log('   → The GOOGLE_GENERATIVE_AI_API_KEY is invalid. Get a new one from https://aistudio.google.com/app/apikey');
    } else if (errMsg.includes('no longer available') || errMsg.includes('404')) {
      console.log('   → Model name may need updating');
    }
  }

  // Test Clerk keys format and basic validation
  console.log('\n=== Testing Clerk Authentication ===');
  const pubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const secKey = process.env.CLERK_SECRET_KEY;

  if (pubKey?.startsWith('pk_test_') || pubKey?.startsWith('pk_live_')) {
    console.log(`✅ Clerk publishable key format valid (${pubKey.startsWith('pk_test_') ? 'development' : 'production'})`);
  } else {
    console.error(`❌ Invalid Clerk publishable key format (expected pk_test_* or pk_live_*)`);
  }

  if (secKey?.startsWith('sk_test_') || secKey?.startsWith('sk_live_')) {
    console.log(`✅ Clerk secret key format valid (${secKey.startsWith('sk_test_') ? 'development' : 'production'})`);
    
    // Try to verify the secret key by making a request to Clerk's API
    try {
      const res = await fetch('https://api.clerk.com/v1/applications', {
        headers: { 'Authorization': `Bearer ${secKey}`, 'Cl-Integration-Version': 'nextjs@4' }
      });
      
      if (res.ok) {
        console.log(`✅ Clerk secret key is valid and authorized`);
      } else {
        const data = await res.text();
        console.error(`❌ Clerk secret key rejected (${res.status})`);
        if (res.status === 401 || res.status === 403) {
          console.log('   → The CLERK_SECRET_KEY is invalid or not authorized');
          console.log('   → Create a Clerk app at https://dashboard.clerk.com and get the secret key from API Keys');
        } else if (res.status === 404) {
          console.log('   → The project/app may not exist in your Clerk dashboard');
        }
      }
    } catch (e) {
      console.error(`⚠️ Could not verify Clerk key: ${e.message.split('\n')[0]}`);
    }
  } else {
    console.error('❌ Invalid Clerk secret key format (expected sk_test_* or sk_live_*)');
  }

  // Check if .env.local is in .gitignore
  console.log('\n=== Security Check ===');
  const gitignore = require('fs').readFileSync('.gitignore', 'utf8');
  if (gitignore.includes('.env') || gitignore.includes('.env.local')) {
    console.log('✅ .env.local is properly ignored in .gitignore');
  } else {
    console.error('⚠️ .env.local may not be in .gitignore - add it to prevent leaking secrets');
  }

  // Summary
  console.log('\n=== Summary ===');
  const issues = [];
  if (!hasGemini) issues.push('- GOOGLE_GENERATIVE_AI_API_KEY is missing or invalid format');
  if (!hasClerkPub || !pubKey?.match(/^pk_(test|live)_/)) issues.push('- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY needs pk_test_* or pk_live_ prefix');
  if (!hasClerkSec || !secKey?.match(/^sk_(test|live)_/)) issues.push('- CLERK_SECRET_KEY needs sk_test_* or sk_live_ prefix');

  if (issues.length) {
    console.log('⚠️ Issues found — please fix:');
    issues.forEach(i => console.log(`  ${i}`));
  } else {
    console.log('✅ All environment variables are configured correctly');
  }
}

testAll();
