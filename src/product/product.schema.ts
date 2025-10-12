import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

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
  sku?: string;

  @Prop()
  weight?: number;

  @Prop()
  dimensions?: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
