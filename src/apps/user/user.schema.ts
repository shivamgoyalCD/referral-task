import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ type: String, required: true })
  username: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  referredBy?: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  referrals?: Types.ObjectId[];

  @Prop({ type: Number, default: 0 })
  wallet: number;

  @Prop({ type: Boolean, required: true, default: true })
  isActive: boolean;

  id: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
