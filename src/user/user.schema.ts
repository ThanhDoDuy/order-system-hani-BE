import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  googleId: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  picture?: string;

  @Prop({ 
    type: String, 
    enum: UserRole, 
    default: UserRole.USER 
  })
  role: UserRole;

  @Prop({ 
    type: String, 
    enum: UserStatus, 
    default: UserStatus.ACTIVE 
  })
  status: UserStatus;

  @Prop()
  lastLoginAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Transform _id to id
UserSchema.set('toJSON', {
  transform: function(doc, ret: any) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});
