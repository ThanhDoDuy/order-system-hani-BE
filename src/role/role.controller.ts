import { Controller, Get, Post, Put, Delete, Body, Param, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { Role, Permission, PermissionType } from './role.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/roles.guard';
import { UserRole } from '../user/user.schema';

@Controller('roles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RoleController {
  constructor(private roleService: RoleService) {}

  // Permission endpoints
  @Get('permissions')
  @Roles(UserRole.ADMIN)
  async getAllPermissions(): Promise<{ success: boolean; data: Permission[] }> {
    try {
      const permissions = await this.roleService.getAllPermissions();
      return {
        success: true,
        data: permissions,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch permissions',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('permissions')
  @Roles(UserRole.ADMIN)
  async createPermission(@Body() permissionData: Partial<Permission>): Promise<{ success: boolean; data: Permission }> {
    try {
      const permission = await this.roleService.createPermission(permissionData);
      return {
        success: true,
        data: permission,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create permission',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put('permissions/:id')
  @Roles(UserRole.ADMIN)
  async updatePermission(
    @Param('id') id: string,
    @Body() permissionData: Partial<Permission>
  ): Promise<{ success: boolean; data: Permission }> {
    try {
      const permission = await this.roleService.updatePermission(id, permissionData);
      if (!permission) {
        throw new HttpException('Permission not found', HttpStatus.NOT_FOUND);
      }
      return {
        success: true,
        data: permission,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to update permission',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete('permissions/:id')
  @Roles(UserRole.ADMIN)
  async deletePermission(@Param('id') id: string): Promise<{ success: boolean; message: string }> {
    try {
      const result = await this.roleService.deletePermission(id);
      if (!result) {
        throw new HttpException('Permission not found', HttpStatus.NOT_FOUND);
      }
      return {
        success: true,
        message: 'Permission deleted successfully',
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to delete permission',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Role endpoints
  @Get()
  @Roles(UserRole.ADMIN)
  async getAllRoles(): Promise<{ success: boolean; data: Role[] }> {
    try {
      const roles = await this.roleService.getAllRoles();
      return {
        success: true,
        data: roles,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch roles',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  @Roles(UserRole.ADMIN)
  async createRole(@Body() roleData: Partial<Role>): Promise<{ success: boolean; data: Role }> {
    try {
      const role = await this.roleService.createRole(roleData);
      return {
        success: true,
        data: role,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create role',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  async updateRole(
    @Param('id') id: string,
    @Body() roleData: Partial<Role>
  ): Promise<{ success: boolean; data: Role }> {
    try {
      const role = await this.roleService.updateRole(id, roleData);
      if (!role) {
        throw new HttpException('Role not found', HttpStatus.NOT_FOUND);
      }
      return {
        success: true,
        data: role,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to update role',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async deleteRole(@Param('id') id: string): Promise<{ success: boolean; message: string }> {
    try {
      const result = await this.roleService.deleteRole(id);
      if (!result) {
        throw new HttpException('Role not found', HttpStatus.NOT_FOUND);
      }
      return {
        success: true,
        message: 'Role deleted successfully',
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to delete role',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(':id/permissions')
  @Roles(UserRole.ADMIN)
  async getRolePermissions(@Param('id') id: string): Promise<{ success: boolean; data: PermissionType[] }> {
    try {
      const role = await this.roleService.getRoleById(id);
      if (!role) {
        throw new HttpException('Role not found', HttpStatus.NOT_FOUND);
      }
      return {
        success: true,
        data: role.permissions,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch role permissions',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
