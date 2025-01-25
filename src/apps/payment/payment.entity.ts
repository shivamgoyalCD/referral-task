import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from '../user/user.entity';

@ObjectType()
export class Payment {
  @Field(() => Int)
  amount: number;

  //resolve fields
  user: User;
  id: string;
}
