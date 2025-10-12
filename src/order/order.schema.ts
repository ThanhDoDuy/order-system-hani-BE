import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true, unique: true })
  orderNumber: string;

  @Prop({ 
    required: true, 
    enum: ['new', 'preparing', 'shipped', 'cancelled', 'rejected', 'draft'],
    default: 'new'
  })
  status: string;

  @Prop({ required: true })
  items: number;

  @Prop({ required: true })
  customerName: string;

  @Prop({ 
    required: true,
    enum: ['standard', 'priority', 'express'],
    default: 'standard'
  })
  shippingService: string;

  @Prop({ required: true })
  trackingCode: string;

  @Prop({ required: true })
  total: number;

  @Prop({ type: [{
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    productPrice: { type: Number, required: true },
    quantity: { type: Number, required: true },
    subtotal: { type: Number, required: true }
  }], default: [] })
  orderItems: Array<{
    productId: string;
    productName: string;
    productPrice: number;
    quantity: number;
    subtotal: number;
  }>;

  @Prop()
  customerEmail?: string;

  @Prop()
  customerPhone?: string;

  @Prop()
  shippingAddress?: string;

  @Prop()
  notes?: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
