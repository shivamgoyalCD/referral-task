import {
  Args,
  ID,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';

import { Payment } from './payment.entity';
import { PaymentService } from './payment.service';
import { CreatePaymentInput } from './payment.input';
import { Payment as PaymentDocument } from './payment.schema';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';

@Resolver(() => Payment)
export class PaymentResolver {
  constructor(
    private readonly userService: UserService,
    private readonly paymentService: PaymentService,
  ) {}

  @Mutation(() => Payment)
  async createPayment(@Args('data') data: CreatePaymentInput) {
    return this.paymentService.createPayment(data);
  }

  @ResolveField('id', () => ID)
  getID(@Parent() payment: PaymentDocument) {
    return String(payment._id);
  }

  @ResolveField('user', () => User)
  getUser(@Parent() payment: PaymentDocument) {
    return this.userService.getUserById(payment.userId);
  }
}
