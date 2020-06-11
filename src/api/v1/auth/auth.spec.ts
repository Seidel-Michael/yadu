import sinon from 'sinon';
import supertest from 'supertest';
import {expect} from 'chai';
import {App} from '../../../app';
import argon2 from 'argon2';
import {UserController} from '../../../controller/user-controller';
import {UserModel} from '../../../db/models/user';

const PATH = '/yadu/api/v1/auth';

describe(`${PATH}`, () => {
  let app: App;
  let request: supertest.SuperTest<supertest.Test>;

  let user: UserModel;

  let sandbox: sinon.SinonSandbox;

  let argonVerifyStub: sinon.SinonStub;
  let getUserByNameStub: sinon.SinonStub;

  before(() => {
    app = new App();
    request = supertest.agent(app.server);
  });

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    user = {
      username: 'admin',
      password: 'password',
      userId: 'abc',
      groups: [],
    };

    argonVerifyStub = sandbox.stub(argon2, 'verify');
    sandbox.stub(UserController.prototype, 'getUserById').resolves(user);
    getUserByNameStub = sandbox
      .stub(UserController.prototype, 'getUserByName')
      .resolves(user);
  });

  after(done => {
    app.server.close(done);
  });

  afterEach(done => {
    request
      .post(`${PATH}/logout`)
      .send({})
      .end(error => {
        if (error) {
          return done(error);
        }

        sandbox.restore();

        done();
      });
  });

  describe(`GET ${PATH}/login`, () => {
    it('should return false when user is not logged in', done => {
      argonVerifyStub.resolves(false);

      request.get(`${PATH}/login`).end((error, response) => {
        if (error) {
          return done(error);
        }

        expect(response.body.isLoggedIn).to.be.false;
        done();
      });
    });

    it('should return true when user is logged in', done => {
      argonVerifyStub.resolves(true);

      request
        .post(`${PATH}/login`)
        .send({username: 'admin', password: 'admin'})
        .end((error, response) => {
          if (error) {
            return done(error);
          }

          request
            .get(`${PATH}/login`)
            .set('Cookie', response.header['set-cookie'][0])
            .end((innerError, innerResponse) => {
              if (innerError) {
                return done(innerError);
              }

              expect(innerResponse.body.isLoggedIn).to.be.true;
              done();
            });
        });
    });
  });

  describe(`POST ${PATH}/login`, () => {
    it('should return 204 and auth', done => {
      argonVerifyStub.resolves(true);

      request
        .post(`${PATH}/login`)
        .send({username: 'admin', password: 'admin'})
        .end((error, response) => {
          if (error) {
            return done(error);
          }

          const session = response.header['set-cookie'].find((c: string) =>
            c.startsWith('yadu:session=')
          );

          expect(response.status).to.equal(204);
          expect(typeof session).to.equal('string');
          done();
        });
    });

    it('should return 401 when password wrong', done => {
      argonVerifyStub.resolves(false);

      request
        .post(`${PATH}/login`)
        .send({username: 'admin', password: 'admin'})
        .end((error, response) => {
          if (error) {
            return done(error);
          }

          expect(response.status).to.equal(401);
          expect(response.header['set-cookie']).to.be.undefined;
          done();
        });
    });

    it('should return 503 when db error occurrs', done => {
      argonVerifyStub.resolves(true);
      const error = new Error('DbError: asdf');
      getUserByNameStub.rejects(error);

      request
        .post(`${PATH}/login`)
        .send({username: 'admin', password: 'admin'})
        .end((error, response) => {
          if (error) {
            return done(error);
          }

          expect(response.status).to.equal(503);
          expect(response.header['set-cookie']).to.be.undefined;
          done();
        });
    });

    it('should return 401 when user not found', done => {
      argonVerifyStub.resolves(true);
      const error = new Error('UserNotFound');
      getUserByNameStub.rejects(error);

      request
        .post(`${PATH}/login`)
        .send({username: 'admin', password: 'admin'})
        .end((error, response) => {
          if (error) {
            return done(error);
          }

          expect(response.status).to.equal(401);
          expect(response.header['set-cookie']).to.be.undefined;
          done();
        });
    });
  });

  describe(`POST ${PATH}/logout`, () => {
    it('should return 204 and logout', done => {
      argonVerifyStub.resolves(true);

      request
        .post(`${PATH}/logout`)
        .send({})
        .end((error, response) => {
          if (error) {
            return done(error);
          }

          expect(response.status).to.equal(204);

          request.get(`${PATH}/login`).end((innerError, innerResponse) => {
            if (innerError) {
              return done(innerError);
            }

            expect(innerResponse.body.isLoggedIn).to.be.false;
            done();
          });
        });
    });
  });
});
