import User, {UserModel, UserSchema} from '../db/models/user';

export class UserController {
  constructor() {}

  async getUsers(): Promise<UserSchema[]> {
    const user = await User.find();
    return user;
  }

  async getUserByName(username: string): Promise<UserSchema> {
    return Promise.reject(new Error('Not implemented'));
  }

  async getUserById(id: string): Promise<UserSchema> {
    return Promise.reject(new Error('Not implemented'));
  }
}
