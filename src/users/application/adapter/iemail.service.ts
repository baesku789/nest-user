export interface IEmailService {
  sendMemberJoinVerification: (
    emailAddress: string,
    signupVerifyToken: string,
  ) => Promise<void>;
}
