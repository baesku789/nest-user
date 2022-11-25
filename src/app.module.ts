import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { EmailModule } from './email/email.module';
import { ConfigModule } from '@nestjs/config';
import emailConfig from './config/emailConfig';
import { validationSchema } from './config/validationSchema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import authConfig from './config/authConfig';
import { LoggingModule } from './logging/logging.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskService } from './task/task.service';
import { BatchModule } from './batch/batch.module';

@Module({
  imports: [
    UsersModule,
    EmailModule,
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: [`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],
      load: [emailConfig, authConfig],
      isGlobal: true,
      validationSchema,
    }),
    TypeOrmModule.forRoot(),
    LoggingModule,
    ScheduleModule.forRoot(),
    BatchModule,
  ],
  controllers: [AppController],
  providers: [AppService, TaskService],
})
export class AppModule {}
