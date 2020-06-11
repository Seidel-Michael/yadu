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

  async getUserById(userId: string): Promise<UserModel> {
    let user;
    try {
      user = await User.findOne({userId});
    } catch (error) {
      throw new Error(`DBError: ${error.message}`);
    }
    if (!user) {
      throw new Error('UserNotFound');
    }

    return user;
  }

  async deleteUser(userId: string): Promise<void> {
    let result;
    try {
      result = await User.deleteOne({userId});
    } catch (error) {
      throw new Error(`DBError: ${error.message}`);
    }
    if (result.deletedCount !== 1) {
      throw new Error('UserNotFound');
    }
  }

  async updateUser(user: UserModel): Promise<void> {
    let result;
    try {
      result = await User.updateOne({userId: user.userId}, user);
    } catch (error) {
      if (error.code === 11000) {
        throw new Error(`DuplicatedData: ${error.message}`);
      }

      throw new Error(`DBError: ${error.message}`);
    }
    if (result.nModified !== 1) {
      throw new Error('UserNotFound');
    }
  }

  async addUser(user: UserModel): Promise<void> {
    try {
      await (await User.create(user)).save();
    } catch (error) {
      if (error.code === 11000) {
        throw new Error(`DuplicatedData: ${error.message}`);
      } else if (error.name === 'ValidationError') {
        throw new Error(`InvalidData: ${error.message}`);
      }

      throw new Error(`DBError: ${error.message}`);
    }
  }
}
