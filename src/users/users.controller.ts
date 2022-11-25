import {
  Body,
  Controller,
  Get,
  Headers,
  Inject,
  Logger,
  LoggerService,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { AuthGuard } from '../auth/auth.guard';
import { CreateUserCommand } from './command/create-user.command';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetUserInfoQuery } from './query/get-user-info.query';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @Inject(Logger) private readonly logger: LoggerService,
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<void> {
    this.printCreateUserLog(dto);
    const { name, email, password } = dto;

    const command = new CreateUserCommand(name, email, password);

    return this.commandBus.execute(command);
  }

  private printCreateUserLog(dto) {
    this.logger.debug(dto);
  }

  @Post('/email-verify')
  async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
    const { signupVerifyToken } = dto;

    return await this.usersService.verifyEmail(signupVerifyToken);
  }

  @Post('/login')
  async login(@Body() dto: UserLoginDto): Promise<string> {
    const { email, password } = dto;

    return await this.usersService.login(email, password);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getUserInfo(
    @Headers() headers: any,
    @Param('id') userId: string,
  ): Promise<any> {
    const getUserQueryInfo = new GetUserInfoQuery(userId);

    return this.queryBus.execute(getUserQueryInfo);
  }
}
