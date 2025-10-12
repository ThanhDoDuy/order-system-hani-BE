import { config } from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { validateEnvironment } from './config/env.validation';

// Load environment variables from .env file FIRST
config();

console.log('🔧 Environment variables loaded:');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '✅ Found' : '❌ Missing');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Found' : '❌ Missing');

async function bootstrap() {
  // Validate environment variables before starting the app
  try {
    validateEnvironment();
  } catch (error) {
    console.error('❌ Environment validation failed:');
    console.error(error.message);
    process.exit(1);
  }

  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Global prefix for all routes
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3001;
  await app.listen(port);
  
  console.log(`🚀 Backend server running on http://localhost:${port}`);
  console.log(`📊 API endpoints available at http://localhost:${port}/api`);
  console.log(`🌐 CORS enabled for: ${process.env.FRONTEND_URL}`);
}
bootstrap();