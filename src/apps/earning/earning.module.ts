import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '../user/user.module';
import { Earning, EarningSchema } from './earning.schema';
import { EarningService } from './earning.service';
// import { EarningResolver } from './earning.resolver';
import { PaymentModule } from '../payment/payment.module';
import { User, UserSchema } from '../user/user.schema';
import { Payment, PaymentSchema } from '../payment/payment.schema';
import { EarningReportResolver } from './earning.resolver';
import { NotificationsModule } from '../notfication/notification.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Earning.name, schema: EarningSchema },
      { name: User.name, schema: UserSchema },
      { name: Payment.name, schema: PaymentSchema },
    ]),
    forwardRef(() => UserModule),
    forwardRef(() => PaymentModule),
    forwardRef(() => NotificationsModule),
  ],
  providers: [EarningService, EarningReportResolver],
  exports: [EarningService],
})
export class EarningModule {}
