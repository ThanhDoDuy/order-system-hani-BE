import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('User-Agent') || '';
    const timestamp = new Date().toISOString();
    
    console.log(`🌐 [${timestamp}] ${method} ${originalUrl} - ${ip} - ${userAgent}`);
    
    // Log request body for POST/PUT/PATCH requests (but hide sensitive data)
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      const body = { ...req.body };
      // Hide sensitive fields
      if (body.password) body.password = '***hidden***';
      if (body.idToken) body.idToken = '***hidden***';
      if (body.refreshToken) body.refreshToken = '***hidden***';
      if (body.accessToken) body.accessToken = '***hidden***';
      
      console.log(`📦 [REQUEST BODY]`, body);
    }
    
    // Log response status when request finishes
    res.on('finish', () => {
      const { statusCode } = res;
      const statusEmoji = statusCode >= 200 && statusCode < 300 ? '✅' : 
                         statusCode >= 400 ? '❌' : '⚠️';
      console.log(`${statusEmoji} [${timestamp}] ${method} ${originalUrl} - ${statusCode}`);
    });
    
    next();
  }
}
