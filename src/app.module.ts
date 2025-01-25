import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './apps/user/user.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { PaymentModule } from './apps/payment/payment.module';
import { EarningModule } from './apps/earning/earning.module';
import { NotificationsModule } from './apps/notfication/notification.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
    }),
    MongooseModule.forRoot(
      'mongodb+srv://shivam:referralTask@cluster0.yq1ak.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    ),
    // AuthModule,
    UserModule,
    PaymentModule,
    EarningModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
