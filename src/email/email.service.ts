import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class EmailService {
  private transporter: Mail;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'nestnodemailerexample@gmail.com', // TODO: config
        pass: 'wimcgtynqbsrkrnr', // TODO: config
      },
    });
  }

  async sendMemberJoinVerification(
    emailAddress: string,
    signupVerfiyToken: string,
  ) {
    const baseUrl = 'http://localhost:3000'; // TODO: config

    const url = `${baseUrl}/users/email-verify?signupVerfiyToken=${signupVerfiyToken}`;

    const mailOptions: EmailOptions = {
      to: emailAddress,
      subject: '가입 인증 메일',
      html: `
        가입확인 버튼을 누르시면 가입 인증이 완료됩니다.<br/>
        <form action=${url} method="POST">
            <button>가입확인</button>
        </form>    
        `,
    };

    return await this.transporter.sendMail(mailOptions);
  }
}
