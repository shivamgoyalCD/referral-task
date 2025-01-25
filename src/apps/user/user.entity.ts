import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field()
  username: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  password?: string;

  @Field(() => Int, { defaultValue: 0 })
  wallet: number;

  @Field(() => Boolean)
  isActive: boolean;

  //resolve fields
  referredBy?: User;
  referrals?: User[];
  id: string;
}
