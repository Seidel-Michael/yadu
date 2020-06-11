import {UserController} from './controller/user-controller';
import User from './db/models/user';

export async function initialSetup() {
  const userControler = new UserController();

  /* Create default admin user with password secret */
  try {
    await userControler.getUserByName('admin');
  } catch (error) {
    if (error.message.startsWith('UserNotFound')) {
      await User.create({
        username: 'admin',
        password:
          '$argon2i$v=19$m=16,t=2,p=1$bFV2cGdVSmpFc1AySzJmcQ$ghjuiA+Uyqlrb8MzJDBAew',
        groups: [],
      });
      console.log('Default admin user created in Database');
    } else {
      console.log('Database Error!');
    }
  }
}
