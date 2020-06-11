import {ParameterizedContext} from 'koa';

export class AuthRouteHandler {
  static async isLoggedIn(ctx: ParameterizedContext) {
    ctx.body = new Error('not implemented');
    ctx.status = 501;
  }

  static async login(ctx: ParameterizedContext) {
    ctx.body = new Error('not implemented');
    ctx.status = 501;
  }

  static async logout(ctx: ParameterizedContext) {
    ctx.body = new Error('not implemented');
    ctx.status = 501;
  }
}
