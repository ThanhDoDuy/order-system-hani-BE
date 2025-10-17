import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true })
export class Category {
  @Prop({ required: true })
  name: string;

  @Prop({ default: '', required: false })
  description: string;

  @Prop({ default: 0 })
  productCount: number;

  @Prop({ required: true })
  userId: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

// ✅ Add unique compound index: (userId + name)
CategorySchema.index({ userId: 1, name: 1 }, { unique: true });
