import User, {UserModel} from '../db/models/user';

export class UserController {
  constructor() {}

  async getUsers(): Promise<UserModel[]> {
    const user = await User.find();
    return user;
  }
}
