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
    priceType: { type: String, required: true, enum: ['wholesale', 'retail'] },
    quantity: { type: Number, required: true },
    subtotal: { type: Number, required: true }
  }], default: [] })
  orderItems: Array<{
    productId: string;
    productName: string;
    productPrice: number;
    priceType: 'wholesale' | 'retail';
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

  @Prop({ required: true })
  userId: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

// Transform _id to id
OrderSchema.set('toJSON', {
  transform: function(doc, ret: any) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});
