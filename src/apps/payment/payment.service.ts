import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Payment } from './payment.schema';
import { Model, Types } from 'mongoose';
import { UserService } from '../user/user.service';
import { error } from 'console';
import { CreatePaymentInput } from './payment.input';
import { EarningService } from '../earning/earning.service';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
    private readonly userService: UserService,
    private readonly earningService: EarningService,
  ) {}

  getPaymentById(id: string | Types.ObjectId): Promise<Payment | null> {
    const payment = this.paymentModel.findById(id);

    return payment;
  }

  async createPayment(data): Promise<Payment> {
    const user = await this.userService.getUserById(data.userId);
    if (!user || !user.isActive) {
      throw new error('invalid user making payment');
    }

    data.userId = new Types.ObjectId(data.userId as string);

    let payment = new this.paymentModel(data);
    payment = await payment.save();
    await this.earningService.calculateProfitEarning(String(payment._id));

    return payment;
  }
}
