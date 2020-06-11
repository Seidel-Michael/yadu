import argon2 from 'argon2';
import koaPassport from 'koa-passport';
import {Strategy as LocalStrategy, IStrategyOptions} from 'passport-local';
import {UserController} from './controller/user-controller';
import {UserModel} from './db/models/user';

const users = new UserController();

const localStrategyOptions: IStrategyOptions = {};

export function auth() {
  koaPassport.serializeUser<UserModel, string>((user, done) => {});

  koaPassport.deserializeUser<UserModel, string>((id, done) => {});

  koaPassport.use(
    new LocalStrategy(
      localStrategyOptions,
      (
        username: string,
        password: string,
        done: (error?: any, user?: any) => void
      ) => {}
    )
  );
}
