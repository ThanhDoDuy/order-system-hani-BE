import { Controller, Get, Post, Put, Body, Param, Query, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User, UserRole, UserStatus } from './user.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/roles.guard';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  async getAllUsers(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10'
  ): Promise<{ success: boolean; data: { users: User[]; total: number; page: number; limit: number } }> {
    try {
      const pageNum = parseInt(page, 10);
      const limitNum = parseInt(limit, 10);
      
      const result = await this.userService.getAllUsers(pageNum, limitNum);
      
      return {
        success: true,
        data: {
          users: result.users,
          total: result.total,
          page: pageNum,
          limit: limitNum,
        },
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch users',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<{ success: boolean; data: User }> {
    try {
      const user = await this.userService.findById(id);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      
      return {
        success: true,
        data: user,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  @Roles(UserRole.ADMIN)
  async createUser(@Body() userData: Partial<User>): Promise<{ success: boolean; data: User }> {
    try {
      // Validate required fields
      if (!userData.email || !userData.name) {
        throw new HttpException('Email and name are required', HttpStatus.BAD_REQUEST);
      }

      // Check if user already exists
      const existingUser = await this.userService.findByEmail(userData.email);
      if (existingUser) {
        throw new HttpException('User with this email already exists', HttpStatus.CONFLICT);
      }

      const user = await this.userService.createUserByAdmin(userData);
      
      return {
        success: true,
        data: user,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create user',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  async updateUser(
    @Param('id') id: string,
    @Body() userData: Partial<User>
  ): Promise<{ success: boolean; data: User }> {
    try {
      const user = await this.userService.updateUser(id, userData);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      
      return {
        success: true,
        data: user,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to update user',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put(':id/status')
  @Roles(UserRole.ADMIN)
  async updateUserStatus(
    @Param('id') id: string,
    @Body() body: { status: UserStatus }
  ): Promise<{ success: boolean; data: User }> {
    try {
      const user = await this.userService.updateUserStatus(id, body.status);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      
      return {
        success: true,
        data: user,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to update user status',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put(':id/role')
  @Roles(UserRole.ADMIN)
  async updateUserRole(
    @Param('id') id: string,
    @Body() body: { role: UserRole }
  ): Promise<{ success: boolean; data: User }> {
    try {
      const user = await this.userService.updateUserRole(id, body.role);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      
      return {
        success: true,
        data: user,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to update user role',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
