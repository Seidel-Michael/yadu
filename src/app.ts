import crypto from 'crypto';
import {Server} from 'http';
import Koa from 'koa';
import koaBodyParser from 'koa-bodyparser';
import koaLogger from 'koa-logger';
import koaPassport from 'koa-passport';
import koaSession from 'koa-session';
import authRoutes from './api/v1/auth/auth.routes';
import koaStatic from 'koa-static';
import {auth} from './auth';

export class App {
  app: Koa;
  server: Server;

  constructor(port = 1337) {
    const PORT = process.env.PORT || port;

    this.app = new Koa();
    this.app.use(koaBodyParser());
    this.app.use(koaLogger());
    this.app.use(
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('koa-rewrite')(/^((?!\/yadu\/api|\.).)*$/gm, '/index.html')
    );
    this.app.use(koaStatic('node_modules/yadu-frontend/dist/yadu-frontend'));

    this.app.keys = [crypto.randomBytes(32).toString('hex')];
    this.app.use(
      koaSession({key: 'yadu:session', httpOnly: true, signed: true}, this.app)
    );

    auth();
    this.app.use(koaPassport.initialize());
    this.app.use(koaPassport.session());

    this.app.use(authRoutes.routes());

    this.server = this.app
      .listen(PORT)
      .on('error', err => {
        console.error(err);
      })
      .on('listening', () => {
        console.log(`Server listening on port ${PORT}`);
      });
  }
}
