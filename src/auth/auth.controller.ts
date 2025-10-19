import { Controller, Post, Body, HttpException, HttpStatus, Get, Query, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

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

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@Request() req: any) {
    try {
      // Get user from JWT payload (set by JwtAuthGuard)
      const jwtUser = req.user;
      if (!jwtUser) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      // Get full user data from database
      const user = await this.userService.findById(jwtUser.id);
      if (!user) {
        throw new HttpException('User not found in database', HttpStatus.NOT_FOUND);
      }

      return {
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            picture: user.picture,
            role: user.role,
            status: user.status,
          }
        }
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to get user info',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
