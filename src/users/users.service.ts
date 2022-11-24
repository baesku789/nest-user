import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import * as uuid from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entity/user.entity';
import { Connection, Repository } from 'typeorm';
import { ulid } from 'ulid';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    private emailService: EmailService,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private connection: Connection,
    private authService: AuthService,
  ) {}

  async createUser(name: string, email: string, password: string) {
    const userExist = await this.checkUserExists(email);
    if (userExist) {
      throw new BadRequestException('이미 가입된 이메일입니다.');
    }

    const signupVerifyToken = uuid.v1();

    // await this.saveUser(name, email, password, signupVerifyToken);
    await this.saveUserUsingQueryRunner(
      name,
      email,
      password,
      signupVerifyToken,
    );
    await this.sendMemberJoinEmail(email, signupVerifyToken);
  }

  private checkUserExists(email: string) {
    return false; // TODO : DB 연동 후 구현
  }

  private async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
    await this.emailService.sendMemberJoinVerification(
      email,
      signupVerifyToken,
    );
  }

  private async saveUserUsingQueryRunner(
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = new UserEntity();
      user.id = ulid();
      user.name = name;
      user.email = email;
      user.password = password;
      user.signupVerifyToken = signupVerifyToken;

      await queryRunner.manager.save(user);

      // throw new InternalServerErrorException();

      await queryRunner.commitTransaction();
    } catch (e) {
      // 에러 발생시 롤백
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(
        'transaction 처리 중 에러가 발생하였습니다.',
      );
    } finally {
      // 직접 생성한 QueryRunner는 해제시켜주어야 함
      await queryRunner.release();
    }
  }

  async verifyEmail(signupVerifyToken: string) {
    const user = await this.usersRepository.findOne({ signupVerifyToken });

    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다.');
    }

    return this.authService.login({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }

  async login(email: string, password: string) {
    // TODO
    // 1. email, password를 가진 유저가 존해하는지 DB에서 확인하고 없다면 에러
    // 2. JWT를 발급

    // throw new Error('Method not implemented');
    return 'Database is not setting';
  }

  async getUserInfo(userId: string) {
    // TODO
    // 1. userId를 가진 유저가 존해하는지 DB에서 확인하고 없다면 에러
    // 2. 조회된 유저정보 반환

    // throw new Error('Method not implemented');
    return 'Database is not setting';
  }
}
