export function validateEnvironment() {
  console.log('🔍 Checking environment variables...');
  
  const requiredEnvVars = {
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    PORT: process.env.PORT,
    FRONTEND_URL: process.env.FRONTEND_URL,
  };

  // Debug: Show what we found
  console.log('📋 Environment variables found:');
  for (const [key, value] of Object.entries(requiredEnvVars)) {
    if (value) {
      // Hide sensitive values
      const displayValue = key.includes('SECRET') || key.includes('CLIENT_SECRET') 
        ? '***hidden***' 
        : value;
      console.log(`  ✅ ${key}: ${displayValue}`);
    } else {
      console.log(`  ❌ ${key}: undefined`);
    }
  }

  const missingVars: string[] = [];

  for (const [key, value] of Object.entries(requiredEnvVars)) {
    if (!value) {
      missingVars.push(key);
    }
  }

  if (missingVars.length > 0) {
    console.log(`\n❌ Missing ${missingVars.length} environment variables:`);
    missingVars.forEach(varName => console.log(`  - ${varName}`));
    
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}\n` +
      `Please check your .env file and ensure all required variables are set.\n` +
      `Make sure your .env file is in the backend root directory.\n` +
      `Required variables:\n` +
      `- MONGODB_URI\n` +
      `- JWT_SECRET\n` +
      `- JWT_REFRESH_SECRET\n` +
      `- GOOGLE_CLIENT_ID\n` +
      `- GOOGLE_CLIENT_SECRET\n` +
      `- PORT\n` +
      `- FRONTEND_URL`
    );
  }

  // Validate specific formats
  if (requiredEnvVars.MONGODB_URI && 
      !requiredEnvVars.MONGODB_URI.startsWith('mongodb://') && 
      !requiredEnvVars.MONGODB_URI.startsWith('mongodb+srv://')) {
    throw new Error('MONGODB_URI must start with "mongodb://" (local) or "mongodb+srv://" (Atlas)');
  }

  if (requiredEnvVars.PORT && isNaN(Number(requiredEnvVars.PORT))) {
    throw new Error('PORT must be a valid number');
  }

  if (requiredEnvVars.FRONTEND_URL && !requiredEnvVars.FRONTEND_URL.startsWith('http')) {
    throw new Error('FRONTEND_URL must be a valid URL starting with "http"');
  }

  console.log('✅ All environment variables are valid');
  return true;
}
