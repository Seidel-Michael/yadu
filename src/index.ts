import mongoose from 'mongoose';
import {UserController} from './controller/user-controller';
import User from './db/models/user';
import {App} from './app';

mongoose
  .connect('mongodb://devuser:devuser@localhost:27017/yadu')
  .then(async () => {
    console.log('Connected');

    const app = new App();

    /*const userControler = new UserController();
    await User.create({
      username: 'Test1',
      password: 'hash',
      groups: [],
    });
    const users = await userControler.getUsers();
    console.log(users);*/
  })
  .catch(error => console.error(error));


