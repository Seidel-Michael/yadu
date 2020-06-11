import argon2 from 'argon2';
import koaPassport from 'koa-passport';
import {IStrategyOptions, Strategy as LocalStrategy} from 'passport-local';
import {UserController} from './controller/user-controller';
import {UserModel} from './db/models/user';

const users = new UserController();

const localStrategyOptions: IStrategyOptions = {};

export function auth() {
  koaPassport.serializeUser<UserModel, string>((user, done) => {
    done(null, user.userId);
  });

  koaPassport.deserializeUser<UserModel, string>(async (id, done) => {
    try {
      const user = await users.getUserById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  koaPassport.use(
    new LocalStrategy(
      localStrategyOptions,
      async (
        username: string,
        password: string,
        done: (error?: any, user?: any) => void
      ) => {
        try {
          const user = await users.getUserByName(username);

          const match = await argon2.verify(user.password, password);

          if (match) {
            done(null, {
              username: user.username,
              userId: user.userId,
              groups: user.groups,
            });
          } else {
            done(new Error('Unauthorized'), false);
          }
        } catch (error) {
          done(error);
        }
      }
    )
  );
}
