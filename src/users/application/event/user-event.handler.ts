import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserCreatedEvent } from '../../domain/user-created.event';
import { EmailService } from '../../../email/email.service';
import { Inject } from '@nestjs/common';
import { IEmailService } from '../adapter/iemail.service';

@EventsHandler(UserCreatedEvent)
export class UserEventHandler implements IEventHandler<UserCreatedEvent> {
  constructor(@Inject('EmailService') private emailService: IEmailService) {}

  async handle(event: UserCreatedEvent) {
    switch (event.name) {
      case UserCreatedEvent.name: {
        console.log('UserCreatedEvents');
        const { email, signupVerifyToken } = event as UserCreatedEvent;
        await this.emailService.sendMemberJoinVerification(
          email,
          signupVerifyToken,
        );
        break;
      }
      default:
        break;
    }
  }
}
