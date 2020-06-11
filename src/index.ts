import mongoose from 'mongoose';
import {App} from './app';
import {initialSetup} from './initial-setup';

mongoose
  .connect('mongodb://devuser:devuser@localhost:27017/yadu')
  .then(async () => {
    console.log('Connected to the Database');
    await initialSetup();
    new App();
  })
  .catch(error => console.error(error));
