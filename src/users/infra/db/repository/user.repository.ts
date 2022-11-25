import { Injectable } from '@nestjs/common';
import { User } from '../../../domain/user';
import { Connection, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entity/user.entity';
import { UserFactory } from '../../../domain/user.factory';
import { IUserRepository } from '../../../domain/repository/iuser.repository';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    private connection: Connection,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private userFactory: UserFactory,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ email });

    if (!user) {
      return null;
    }

    const { id, name, signupVerifyToken, password } = user;

    return this.userFactory.reconstitute(
      id,
      email,
      name,
      signupVerifyToken,
      password,
    );
  }

  async save(
    id: string,
    name: string,
    email: string,
    signupVerifyToken: string,
    password: string,
  ): Promise<void> {
    await this.connection.transaction(async (manager) => {
      const user = new UserEntity();
      user.id = id;
      user.name = name;
      user.email = email;
      user.password = password;
      user.signupVerifyToken = signupVerifyToken;

      await manager.save(user);
    });
  }
}
