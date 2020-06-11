import mongoose from 'mongoose';
/*import {UserController} from './controller/user-controller';
import User from './db/models/user';*/
import {App} from './app';

mongoose
  .connect('mongodb://devuser:devuser@localhost:27017/yadu')
  .then(async () => {
    console.log('Connected');

    new App();

    /*const userControler = new UserController();
    await User.create({
      username: 'admin',
      password:
        '$argon2i$v=19$m=16,t=2,p=1$bFV2cGdVSmpFc1AySzJmcQ$ghjuiA+Uyqlrb8MzJDBAew',
      groups: [],
    });
    const users = await userControler.getUsers();
    console.log(users);*/
  })
  .catch(error => console.error(error));
