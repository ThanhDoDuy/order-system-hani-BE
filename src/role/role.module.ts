import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { Role, RoleSchema, Permission, PermissionSchema } from './role.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Role.name, schema: RoleSchema },
      { name: Permission.name, schema: PermissionSchema },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-here',
      signOptions: { expiresIn: '1h' },
    }),
    UserModule,
  ],
  controllers: [RoleController],
  providers: [RoleService, JwtAuthGuard, RolesGuard],
  exports: [RoleService],
})
export class RoleModule {}
