import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Earning extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Payment', required: true })
  itemId: Types.ObjectId;

  @Prop({ type: Number, required: true })
  amount: number;
}

export const EarningSchema = SchemaFactory.createForClass(Earning);
