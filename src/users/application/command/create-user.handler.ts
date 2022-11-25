import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user.command';
import * as uuid from 'uuid';
import { ulid } from 'ulid';
import { UserFactory } from '../../domain/user.factory';
import { IUserRepository } from '../../domain/repository/iuser.repository';

@Injectable()
@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private userFactory: UserFactory,
    @Inject('UserRepository') private userRepository: IUserRepository,
  ) {}

  async execute(command: CreateUserCommand) {
    const { name, email, password } = command;

    const user = await this.userRepository.findByEmail(email);

    if (user !== null) {
      throw new UnprocessableEntityException('이미 가입된 이메일입니다.');
    }

    const id = ulid();
    const signupVerifyToken = uuid.v1();

    await this.userRepository.save(
      id,
      email,
      password,
      name,
      signupVerifyToken,
    );

    this.userFactory.create(id, name, email, signupVerifyToken, password);

    // await this.saveUser(name, email, password, signupVerifyToken);
    // await this.usersService.saveUserUsingQueryRunner(
    //   name,
    //   email,
    //   password,
    //   signupVerifyToken,
    // );
  }
}
