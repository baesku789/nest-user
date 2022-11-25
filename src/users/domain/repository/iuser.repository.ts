import { User } from '../user';

export interface IUserRepository {
  findByEmail: (email: string) => Promise<User>;
  save: (
    id: string,
    name: string,
    email: string,
    signupVerifyToken: string,
    password: string,
  ) => Promise<void>;
}
