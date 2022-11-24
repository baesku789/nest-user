import { BadRequestException, Injectable } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import * as uuid from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { ulid } from 'ulid';

@Injectable()
export class UsersService {
  constructor(
    private emailService: EmailService,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async createUser(name: string, email: string, password: string) {
    console.log(name, email, password);

    const userExist = await this.checkUserExists(email);
    if (userExist) {
      throw new BadRequestException('이미 가입된 이메일입니다.');
    }

    const signupVerifyToken = uuid.v1();

    await this.saveUser(name, email, password, signupVerifyToken);
    await this.sendMemberJoinEmail(email, signupVerifyToken);
  }

  private checkUserExists(email: string) {
    return false; // TODO : DB 연동 후 구현
  }

  private async saveUser(
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ) {
    const user = new UserEntity();
    user.id = ulid();
    user.name = name;
    user.email = email;
    user.password = password;
    user.signupVerifyToken = signupVerifyToken;
    await this.usersRepository.save(user);
  }

  private async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
    await this.emailService.sendMemberJoinVerification(
      email,
      signupVerifyToken,
    );
  }

  async verifyEmail(signupVerifyToken: string) {
    // TODO
    // 1. DB에서 signupVerifyToken으로 회원가입 처리중인 유저가 있는지 조회하고 없다면 에러처리
    // 2. 바로 로그인 상태가 되도록 JWT를 발급

    // throw new Error('Method not implemented');
    return 'Database is not setting';
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
