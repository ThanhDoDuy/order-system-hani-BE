import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { OAuth2Client } from 'google-auth-library';
import { UserRole, UserStatus } from '../user/user.schema';

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {
    this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  async validateGoogleToken(idToken: string) {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new Error('Invalid token payload');
      }

      return {
        googleId: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      };
    } catch (error) {
      throw new Error('Invalid Google token');
    }
  }

  async loginWithGoogle(googleUserData: any) {
    const { email } = googleUserData;
    
    // Special case for super admin email
    const isSuperAdmin = email === 'duythanh1602@gmail.com';
    
    let user = await this.userService.findByGoogleId(googleUserData.googleId);

    if (!user) {
      // Check if user exists by email first
      const existingUser = await this.userService.findByEmail(email);
      
      if (existingUser) {
        // User exists but with different Google ID, update it
        user = await this.userService.updateUser(existingUser.id, {
          googleId: googleUserData.googleId,
          picture: googleUserData.picture,
        });
      } else {
        // New user
        if (isSuperAdmin) {
          // Auto-create super admin
          user = await this.userService.create({
            ...googleUserData,
            role: UserRole.ADMIN,
            status: UserStatus.ACTIVE,
          });
        } else {
          // Check if user is active in database
          const isActive = await this.userService.isUserActive(email);
          if (!isActive) {
            throw new UnauthorizedException('Bạn cần admin tạo user trước, làm ơn liên hệ admin');
          }
          
          // User should exist in database, create with Google data
          user = await this.userService.create(googleUserData);
        }
      }
    } else {
      // Existing user, check if they're still active
      if (user.status !== UserStatus.ACTIVE) {
        throw new UnauthorizedException('Tài khoản của bạn đã bị vô hiệu hóa, vui lòng liên hệ admin');
      }
      
      // Update super admin role if needed
      if (isSuperAdmin && user.role !== UserRole.ADMIN) {
        user = await this.userService.updateUserRole(user.id, UserRole.ADMIN);
      }
      
      if (user) {
        await this.userService.updateLastLogin(user.id);
      }
    }

    // Ensure user is not null at this point
    if (!user) {
      throw new Error('User creation failed');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      googleId: user.googleId,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '1h',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        role: user.role,
        status: user.status,
      },
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.userService.findById(payload.sub);
      if (!user) {
        throw new Error('User not found');
      }

      const newPayload = {
        sub: user.id,
        email: user.email,
        googleId: user.googleId,
        role: user.role,
      };

      const newAccessToken = this.jwtService.sign(newPayload, {
        expiresIn: '1h',
      });
      const newRefreshToken = this.jwtService.sign(newPayload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      });

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }
}
