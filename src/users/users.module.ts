import { Logger, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { EmailService } from '../email/email.service';
import { EmailModule } from '../email/email.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../entity/user.entity';
import { AuthService } from '../auth/auth.service';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateUserHandler } from './command/create-user.handler';
import { UserEventHandler } from './event/user-event.handler';
import { GetUserInfoQueryHandler } from './query/get-user-info.handler';

@Module({
  imports: [EmailModule, TypeOrmModule.forFeature([UserEntity]), CqrsModule],
  controllers: [UsersController],
  providers: [
    CreateUserHandler,
    EmailService,
    AuthService,
    Logger,
    UsersService,
    UserEventHandler,
    GetUserInfoQueryHandler,
  ],
})
export class UsersModule {}
