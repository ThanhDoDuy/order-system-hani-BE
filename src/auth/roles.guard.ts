import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { UserRole } from '../user/user.schema';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => {
  const { SetMetadata } = require('@nestjs/common');
  return SetMetadata(ROLES_KEY, roles);
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return false;
    }

    try {
      const token = authHeader.substring(7);
      const payload = this.jwtService.verify(token);
      
      // Get user from database to ensure role is current
      const user = await this.userService.findById(payload.sub);
      if (!user || user.status !== 'active') {
        return false;
      }

      return requiredRoles.some((role) => user.role === role);
    } catch (error) {
      return false;
    }
  }
}
