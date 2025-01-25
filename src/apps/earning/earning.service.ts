import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserService } from '../user/user.service';
import { Earning } from './earning.schema';
import { PaymentService } from '../payment/payment.service';
import { CreateEarningInput } from './earning.input';
import { User } from '../user/user.schema';
import { error } from 'console';
import { Payment } from '../payment/payment.schema';
import {
  EarningReport,
  ReferralEarnings,
  SingLevelEarnings,
} from './earning.entity';
import { NotificationsGateway } from '../notfication/notification.gateway';

@Injectable()
export class EarningService {
  constructor(
    @InjectModel(Earning.name) private earningModel: Model<Earning>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Payment.name) private readonly paymentModel: Model<Payment>,
    private readonly userService: UserService,
    @Inject(forwardRef(() => PaymentService))
    private readonly paymentService: PaymentService,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  async calculateProfitEarning(
    id: Types.ObjectId | string,
  ): Promise<Earning | void> {
    const payment = await this.paymentService.getPaymentById(id);
    if (payment?.amount && payment.amount >= 1000) {
      const child = (await this.userService.getUserById(
        payment.userId,
      )) as User;
      if (child.referredBy) {
        const level1EarningData: CreateEarningInput = {
          amount: 0.05 * payment.amount,
          userId: child.referredBy,
          itemId: payment._id as Types.ObjectId,
        };

        let earning = new this.earningModel(level1EarningData);
        await earning.save();

        await this.userService.updateUser(child.referredBy, {
          wallet: level1EarningData.amount,
        });

        this.notificationsGateway.sendNotification(
          String(child.referredBy),
          `You earned $${level1EarningData.amount.toFixed(
            2,
          )} from a referral payment!`,
        );

        const parent = await this.userService.getUserById(child.referredBy);
        if (parent?.referredBy) {
          const level2EarningData: CreateEarningInput = {
            amount: 0.01 * payment.amount,
            userId: parent.referredBy,
            itemId: payment._id as Types.ObjectId,
          };
          earning = new this.earningModel(level2EarningData);
          await earning.save();
          await this.userService.updateUser(parent.referredBy, {
            wallet: level2EarningData.amount,
          });

          console.log(parent.referredBy);
          this.notificationsGateway.sendNotification(
            String(parent.referredBy),
            `You earned $${level2EarningData.amount.toFixed(
              2,
            )} from an indirect referral payment!`,
          );
        }
      }
    }
  }

  async getEarningReport(id: string) {
    const user = await this.userService.getUserById(id);
    if (!user) {
      throw new error('user not exist');
    }

    const level1Referrals = await this.userModel.find({
      referredBy: new Types.ObjectId(id),
    });

    const level2Referrals = await this.userModel.find({
      referredBy: { $in: level1Referrals?.map((ref) => ref._id) },
    });

    const calculateReferralEarnings = async (referrals, level) => {
      let referralEarnings: ReferralEarnings[] = [];

      for (const referral of referrals) {
        const payments = await this.paymentModel.find({ userId: referral._id });

        const paymentEarnings = payments.map((payment) => ({
          amount: payment.amount,
          earnings: level === 1 ? payment.amount * 0.05 : payment.amount * 0.01,
        }));

        const totalEarnings = paymentEarnings.reduce(
          (sum, payment) => sum + payment.earnings,
          0,
        );

        referralEarnings.push({
          username: referral.username,
          email: referral.email,
          totalEarnings,
          payments: paymentEarnings,
        });
      }

      return referralEarnings;
    };

    const level1ReferralEarnings = await calculateReferralEarnings(
      level1Referrals,
      1,
    );
    const level1TotalEarnings = level1ReferralEarnings.reduce(
      (sum, ref) => sum + ref.totalEarnings,
      0,
    );

    const level1Earnings: SingLevelEarnings = {
      totalEarnings: level1TotalEarnings,
      referrals: level1ReferralEarnings,
    };

    const level2ReferralEarnings = await calculateReferralEarnings(
      level2Referrals,
      2,
    );
    const level2TotalEarnings = level2ReferralEarnings.reduce(
      (sum, ref) => sum + ref.totalEarnings,
      0,
    );

    const level2Earnings: SingLevelEarnings = {
      totalEarnings: level2TotalEarnings,
      referrals: level2ReferralEarnings,
    };

    const totalEarnings = level1TotalEarnings + level2TotalEarnings;

    const report: EarningReport = {
      username: user.username,
      email: user.email,
      totalEarnings,
      level1Earnings,
      level2Earnings,
    };

    return report;
  }
}
