import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from '../user/user.entity';
import { Payment } from '../payment/payment.entity';

@ObjectType()
export class Earning {
  @Field(() => Int)
  amount: number;

  //resolve fields
  user: User;
  id: string;
}

@ObjectType()
export class PaymentEarnings {
  @Field(() => Int)
  amount: number;

  @Field(() => Int)
  earnings: number;
}

@ObjectType()
export class ReferralEarnings {
  @Field()
  username: string;

  @Field()
  email: string;

  @Field(() => Int)
  totalEarnings: number;

  @Field(() => [PaymentEarnings])
  payments: PaymentEarnings[];
}

@ObjectType()
export class SingLevelEarnings {
  @Field(() => Int)
  totalEarnings: number;

  @Field(() => [ReferralEarnings])
  referrals: ReferralEarnings[];
}

@ObjectType()
export class EarningReport {
  @Field()
  username: string;

  @Field()
  email: string;

  @Field(() => Int)
  totalEarnings: number;

  @Field(() => SingLevelEarnings, { nullable: true })
  level1Earnings: SingLevelEarnings;

  @Field(() => SingLevelEarnings, { nullable: true })
  level2Earnings: SingLevelEarnings;
}
