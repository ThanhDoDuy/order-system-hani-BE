import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

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
}
