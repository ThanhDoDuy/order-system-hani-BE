import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RoleDocument = Role & Document;
export type PermissionDocument = Permission & Document;

export enum PermissionType {
  CREATE_USER = 'create_user',
  READ_USER = 'read_user',
  UPDATE_USER = 'update_user',
  DELETE_USER = 'delete_user',
  MANAGE_ROLES = 'manage_roles',
  MANAGE_PERMISSIONS = 'manage_permissions',
  VIEW_DASHBOARD = 'view_dashboard',
  MANAGE_ORDERS = 'manage_orders',
  MANAGE_PRODUCTS = 'manage_products',
  MANAGE_CATEGORIES = 'manage_categories'
}

@Schema({ timestamps: true })
export class Permission {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ 
    type: String, 
    enum: PermissionType, 
    required: true 
  })
  type: PermissionType;

  @Prop({ default: true })
  isActive: boolean;
}

@Schema({ timestamps: true })
export class Role {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ 
    type: [String], 
    enum: PermissionType, 
    default: [] 
  })
  permissions: PermissionType[];

  @Prop({ default: true })
  isActive: boolean;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
export const RoleSchema = SchemaFactory.createForClass(Role);

// Transform _id to id for both schemas
PermissionSchema.set('toJSON', {
  transform: function(doc, ret: any) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

RoleSchema.set('toJSON', {
  transform: function(doc, ret: any) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});
