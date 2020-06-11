import User, {UserModel} from '../db/models/user';

export class UserController {
  constructor() {}

  async getUsers(): Promise<UserModel[]> {
    try {
      const user = await User.find();
      return user;
    } catch (error) {
      throw new Error(`DBError: ${error.message}`);
    }
  }

  async getUserByName(username: string): Promise<UserModel> {
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

  async getUserById(userid: string): Promise<UserModel> {
    let user;
    try {
      user = await User.findOne({userid});
    } catch (error) {
      throw new Error(`DBError: ${error.message}`);
    }
    if (!user) {
      throw new Error('UserNotFound');
    }

    return user;
  }
}
