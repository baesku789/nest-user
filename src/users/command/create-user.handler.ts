import { BadRequestException, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user.command';
import * as uuid from 'uuid';
import { UsersService } from '../users.service';

@Injectable()
@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(private usersService: UsersService) {}

  async execute(command: CreateUserCommand) {
    const { name, email, password } = command;

    const userExist = await this.usersService.checkUserExists(email);
    if (userExist) {
      throw new BadRequestException('이미 가입된 이메일입니다.');
    }

    const signupVerifyToken = uuid.v1();

    // await this.saveUser(name, email, password, signupVerifyToken);
    await this.usersService.saveUserUsingQueryRunner(
      name,
      email,
      password,
      signupVerifyToken,
    );
    await this.usersService.sendMemberJoinEmail(email, signupVerifyToken);
  }
}
