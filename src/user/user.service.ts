import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserRole, UserStatus } from './user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByGoogleId(googleId: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ googleId }).exec();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async create(userData: Partial<User>): Promise<UserDocument> {
    const user = new this.userModel(userData);
    return user.save();
  }

  async updateLastLogin(userId: string): Promise<UserDocument | null> {
    return this.userModel.findByIdAndUpdate(
      userId,
      { lastLoginAt: new Date() },
      { new: true }
    ).exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  // New methods for user management
  async getAllUsers(page = 1, limit = 10): Promise<{ users: UserDocument[]; total: number }> {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      this.userModel.find().skip(skip).limit(limit).exec(),
      this.userModel.countDocuments().exec(),
    ]);
    return { users, total };
  }

  async updateUser(id: string, userData: Partial<User>): Promise<UserDocument | null> {
    return this.userModel.findByIdAndUpdate(id, userData, { new: true }).exec();
  }

  async updateUserStatus(id: string, status: UserStatus): Promise<UserDocument | null> {
    return this.userModel.findByIdAndUpdate(id, { status }, { new: true }).exec();
  }

  async updateUserRole(id: string, role: UserRole): Promise<UserDocument | null> {
    return this.userModel.findByIdAndUpdate(id, { role }, { new: true }).exec();
  }

  async createUserByAdmin(userData: Partial<User>): Promise<UserDocument> {
    const user = new this.userModel({
      ...userData,
      status: UserStatus.ACTIVE,
      role: userData.role || UserRole.USER,
    });
    return user.save();
  }

  async isUserActive(email: string): Promise<boolean> {
    const user = await this.userModel.findOne({ email, status: UserStatus.ACTIVE }).exec();
    return !!user;
  }
}
