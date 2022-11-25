export class User {
  constructor(
    private id: string,
    private name: string,
    private email: string,
    private password: string,
    private signupVerifyToken: string,
  ) {}
}

export class UserInfo {
  id: string;
  name: string;
  email: string;
}
