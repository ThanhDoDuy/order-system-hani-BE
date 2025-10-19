import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  wholesalePrice?: number; // Giá bán sỉ

  @Prop({ required: false })
  retailPrice?: number; // Giá bán lẻ

  @Prop({ required: false })
  price?: number; // Giá cũ (for backward compatibility)

  @Prop({ required: true, default: 0 })
  stock: number;

  @Prop({ required: true })
  category: string;

  @Prop({ 
    required: true,
    enum: ['active', 'inactive'],
    default: 'active'
  })
  status: string;

  @Prop()
  image?: string;

  @Prop()
  description?: string;

  @Prop()
  weight?: number;

  @Prop()
  dimensions?: string;

  @Prop({ required: true })
  userId: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

// Transform _id to id
ProductSchema.set('toJSON', {
  transform: function(doc, ret: any) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});
