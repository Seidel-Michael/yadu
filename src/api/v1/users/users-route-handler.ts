import {ParameterizedContext} from 'koa';
import {UserController} from '../../../controller/user-controller';

export class UsersRouteHandler {
  static userController = new UserController();

  static async getUsers(ctx: ParameterizedContext) {
    try {
      const users = await UsersRouteHandler.userController.getUsers();
      ctx.status = 200;
      for (const user of users) {
        delete user.password;
      }
      ctx.body = users;
    } catch (error) {
      if (error.message.startsWith('DBError')) {
        ctx.status = 503;
        ctx.body = error.message;
      } else {
        ctx.status = 500;
        ctx.body = error.message;
      }
    }
  }

  static async getUser(ctx: ParameterizedContext) {
    try {
      const user = await UsersRouteHandler.userController.getUserById(
        ctx.params.id
      );
      ctx.status = 200;
      delete user.password;
      ctx.body = user;
    } catch (error) {
      if (error.message.startsWith('DBError')) {
        ctx.status = 503;
        ctx.body = error.message;
      } else if (error.message.startsWith('UserNotFound')) {
        ctx.status = 404;
        ctx.body = error.message;
      } else {
        ctx.status = 500;
        ctx.body = error.message;
      }
    }
  }

  static async addUser(ctx: ParameterizedContext) {
    try {
      await UsersRouteHandler.userController.addUser(ctx.request.body);
      ctx.status = 204;
    } catch (error) {
      if (error.message.startsWith('DBError')) {
        ctx.status = 503;
        ctx.body = error.message;
      } else if (error.message.startsWith('InvalidData')) {
        ctx.status = 400;
        ctx.body = error.message;
      } else if (error.message.startsWith('DuplicatedData')) {
        ctx.status = 409;
        ctx.body = error.message;
      } else {
        ctx.status = 500;
        ctx.body = error.message;
      }
    }
  }

  static async deleteUser(ctx: ParameterizedContext) {
    try {
      await UsersRouteHandler.userController.deleteUser(ctx.params.id);
      ctx.status = 204;
    } catch (error) {
      if (error.message.startsWith('DBError')) {
        ctx.status = 503;
        ctx.body = error.message;
      } else if (error.message.startsWith('UserNotFound')) {
        ctx.status = 404;
        ctx.body = error.message;
      } else {
        ctx.status = 500;
        ctx.body = error.message;
      }
    }
  }

  static async updateUser(ctx: ParameterizedContext) {
    try {
      await UsersRouteHandler.userController.updateUser({
        ...ctx.request.body,
        userId: ctx.params.id,
      });
      ctx.status = 204;
    } catch (error) {
      if (error.message.startsWith('DBError')) {
        ctx.status = 503;
        ctx.body = error.message;
      } else if (error.message.startsWith('InvalidData')) {
        ctx.status = 400;
        ctx.body = error.message;
      } else if (error.message.startsWith('UserNotFound')) {
        ctx.status = 404;
        ctx.body = error.message;
      } else if (error.message.startsWith('DuplicatedData')) {
        ctx.status = 409;
        ctx.body = error.message;
      } else {
        ctx.status = 500;
        ctx.body = error.message;
      }
    }
  }

  static async getCurrentUser(ctx: ParameterizedContext) {
    try {
      const user = await UsersRouteHandler.userController.getUserById(
        ctx.state.user.userId
      );
      ctx.status = 200;
      delete user.password;
      ctx.body = user;
    } catch (error) {
      if (error.message.startsWith('DBError')) {
        ctx.status = 503;
        ctx.body = error.message;
      } else if (error.message.startsWith('UserNotFound')) {
        ctx.status = 404;
        ctx.body = error.message;
      } else {
        ctx.status = 500;
        ctx.body = error.message;
      }
    }
  }
}
