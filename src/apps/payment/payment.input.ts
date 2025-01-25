import { InputType, Field, ID, Int } from '@nestjs/graphql';
import { IsNumber, IsPositive, IsString } from 'class-validator';

@InputType()
export class CreatePaymentInput {
  @Field()
  @IsString()
  userId: string;

  @Field(() => Int)
  @IsNumber()
  @IsPositive()
  amount: number;
}
