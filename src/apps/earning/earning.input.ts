import { InputType, Field, ID, Int } from '@nestjs/graphql';
import { IsNumber, IsPositive, IsString } from 'class-validator';
import { Types } from 'mongoose';

@InputType()
export class CreateEarningInput {
  @Field(() => ID, { description: 'User ID of payment done by' })
  @IsString()
  userId: Types.ObjectId;

  @Field(() => Int)
  @IsNumber()
  @IsPositive()
  amount: number;

  @Field(() => ID)
  itemId: Types.ObjectId;
}
