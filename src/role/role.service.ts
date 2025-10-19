import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, RoleDocument, Permission, PermissionDocument, PermissionType } from './role.schema';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
    @InjectModel(Permission.name) private permissionModel: Model<PermissionDocument>,
  ) {}

  // Permission methods
  async createPermission(permissionData: Partial<Permission>): Promise<Permission> {
    const permission = new this.permissionModel(permissionData);
    return permission.save();
  }

  async getAllPermissions(): Promise<Permission[]> {
    return this.permissionModel.find({ isActive: true }).exec();
  }

  async getPermissionById(id: string): Promise<Permission | null> {
    return this.permissionModel.findById(id).exec();
  }

  async updatePermission(id: string, permissionData: Partial<Permission>): Promise<Permission | null> {
    return this.permissionModel.findByIdAndUpdate(id, permissionData, { new: true }).exec();
  }

  async deletePermission(id: string): Promise<boolean> {
    const result = await this.permissionModel.findByIdAndUpdate(id, { isActive: false }).exec();
    return !!result;
  }

  // Role methods
  async createRole(roleData: Partial<Role>): Promise<Role> {
    const role = new this.roleModel(roleData);
    return role.save();
  }

  async getAllRoles(): Promise<Role[]> {
    return this.roleModel.find({ isActive: true }).exec();
  }

  async getRoleById(id: string): Promise<Role | null> {
    return this.roleModel.findById(id).exec();
  }

  async updateRole(id: string, roleData: Partial<Role>): Promise<Role | null> {
    return this.roleModel.findByIdAndUpdate(id, roleData, { new: true }).exec();
  }

  async deleteRole(id: string): Promise<boolean> {
    const result = await this.roleModel.findByIdAndUpdate(id, { isActive: false }).exec();
    return !!result;
  }

  // Helper methods
  async hasPermission(roleName: string, permissionType: PermissionType): Promise<boolean> {
    const role = await this.roleModel.findOne({ name: roleName, isActive: true }).exec();
    return role ? role.permissions.includes(permissionType) : false;
  }

  async getRolePermissions(roleName: string): Promise<PermissionType[]> {
    const role = await this.roleModel.findOne({ name: roleName, isActive: true }).exec();
    return role ? role.permissions : [];
  }

  // Initialize default roles and permissions
  async initializeDefaultData(): Promise<void> {
    // Create default permissions
    const defaultPermissions = [
      { name: 'Create User', description: 'Can create new users', type: PermissionType.CREATE_USER },
      { name: 'Read User', description: 'Can view user information', type: PermissionType.READ_USER },
      { name: 'Update User', description: 'Can update user information', type: PermissionType.UPDATE_USER },
      { name: 'Delete User', description: 'Can delete users', type: PermissionType.DELETE_USER },
      { name: 'Manage Roles', description: 'Can manage roles', type: PermissionType.MANAGE_ROLES },
      { name: 'Manage Permissions', description: 'Can manage permissions', type: PermissionType.MANAGE_PERMISSIONS },
      { name: 'View Dashboard', description: 'Can view dashboard', type: PermissionType.VIEW_DASHBOARD },
      { name: 'Manage Orders', description: 'Can manage orders', type: PermissionType.MANAGE_ORDERS },
      { name: 'Manage Products', description: 'Can manage products', type: PermissionType.MANAGE_PRODUCTS },
      { name: 'Manage Categories', description: 'Can manage categories', type: PermissionType.MANAGE_CATEGORIES },
    ];

    for (const permData of defaultPermissions) {
      const existing = await this.permissionModel.findOne({ type: permData.type }).exec();
      if (!existing) {
        await this.createPermission(permData);
      }
    }

    // Create default roles
    const defaultRoles = [
      {
        name: 'user',
        description: 'Regular user with basic permissions',
        permissions: [
          PermissionType.VIEW_DASHBOARD,
          PermissionType.READ_USER,
        ]
      },
      {
        name: 'admin',
        description: 'Administrator with full permissions',
        permissions: Object.values(PermissionType)
      }
    ];

    for (const roleData of defaultRoles) {
      const existing = await this.roleModel.findOne({ name: roleData.name }).exec();
      if (!existing) {
        await this.createRole(roleData);
      }
    }
  }
}
