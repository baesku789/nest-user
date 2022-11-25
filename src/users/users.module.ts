import { Logger, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './interface/users.controller';
import { EmailModule } from '../email/email.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './infra/db/entity/user.entity';
import { AuthService } from '../auth/auth.service';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateUserHandler } from './application/command/create-user.handler';
import { UserEventHandler } from './application/event/user-event.handler';
import { GetUserInfoQueryHandler } from './application/query/get-user-info.handler';
import { UserFactory } from './domain/user.factory';
import { UserRepository } from './infra/db/repository/user.repository';
import { EmailService } from './infra/db/adapter/email.service';

@Module({
  imports: [EmailModule, TypeOrmModule.forFeature([UserEntity]), CqrsModule],
  controllers: [UsersController],
  providers: [
    CreateUserHandler,
    {
      provide: 'EmailService',
      useClass: EmailService,
    },
    AuthService,
    Logger,
    UsersService,
    UserEventHandler,
    GetUserInfoQueryHandler,
    UserFactory,
    {
      provide: 'UserRepository',
      useClass: UserRepository,
    },
  ],
})
export class UsersModule {}
