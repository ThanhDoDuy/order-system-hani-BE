import { Controller, Post, Body, HttpException, HttpStatus, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('google')
  async googleLogin(@Body() body: { idToken: string }) {
    try {
      if (!body.idToken) {
        throw new HttpException('ID token is required', HttpStatus.BAD_REQUEST);
      }

      // Validate Google token
      const googleUserData = await this.authService.validateGoogleToken(body.idToken);
      
      // Login or create user
      const result = await this.authService.loginWithGoogle(googleUserData);
      
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Authentication failed',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @Post('refresh')
  async refreshToken(@Body() body: { refreshToken: string }) {
    try {
      if (!body.refreshToken) {
        throw new HttpException('Refresh token is required', HttpStatus.BAD_REQUEST);
      }

      const result = await this.authService.refreshToken(body.refreshToken);
      
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Token refresh failed',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @Get('google/start')
  getGoogleAuthUrl() {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/google/callback';
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=openid email profile&` +
      `response_type=code&` +
      `access_type=offline&` +
      `prompt=consent`;
    
    return {
      success: true,
      data: { authUrl }
    };
  }
}
