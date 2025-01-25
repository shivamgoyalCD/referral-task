import {
  Args,
  ID,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';

import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { Earning, EarningReport } from './earning.entity';
import { PaymentService } from '../payment/payment.service';
import { Earning as EarningDocument } from './earning.schema';
import { EarningService } from './earning.service';

@Resolver(() => EarningReport)
export class EarningReportResolver {
  constructor(private readonly earningService: EarningService) {}

  @Query(() => EarningReport)
  async getEarningReport(@Args('id') id: string) {
    return this.earningService.getEarningReport(id);
  }
}
