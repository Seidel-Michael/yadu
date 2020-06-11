import User, {UserModel, UserSchema} from '../db/models/user';

export class UserController {
  constructor() {}

  async getUsers(): Promise<UserSchema[]> {
    try {
      const user = await User.find();
      return user;
    } catch (error) {
      throw new Error(`DBError: ${error.message}`);
    }
  }

  async getUserByName(username: string): Promise<UserSchema> {
    let user;
    try {
      user = await User.findOne({username});
    } catch (error) {
      throw new Error(`DBError: ${error.message}`);
    }
    if (!user) {
      throw new Error('UserNotFound');
    }

    return user;
  }

  async getUserById(id: string): Promise<UserSchema> {
    return Promise.reject(new Error('Not implemented'));
  }
}
