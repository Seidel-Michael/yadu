import {ParameterizedContext} from 'koa';
import koaPassport from 'koa-passport';

export class AuthRouteHandler {
  static async isLoggedIn(ctx: ParameterizedContext) {
    ctx.status = 200;
    ctx.body = {isLoggedIn: !!ctx.state.user};
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async login(ctx: ParameterizedContext, next: () => Promise<any>) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return koaPassport.authenticate('local', async (error: any, user: any) => {
      if (user) {
        await ctx.login(user);
        ctx.status = 204;
      } else {
        if (error.message.startsWith('DbError')) {
          ctx.status = 503;
        } else {
          ctx.status = 401;
        }

        ctx.body = error;
      }
    })(ctx, next);
  }

  static async logout(ctx: ParameterizedContext) {
    ctx.logout();
    ctx.status = 204;
  }
}
