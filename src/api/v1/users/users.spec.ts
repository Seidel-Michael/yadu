import sinon from 'sinon';
import supertest from 'supertest';
import {expect} from 'chai';
import {App} from '../../../app';
import {UserController} from '../../../controller/user-controller';
import {UsersRouteHandler} from './users-route-handler';
import {UserModel} from '../../../db/models/user';
import argon2 from 'argon2';
import {before} from 'mocha';

const PATH = '/yadu/api/v1/users';

describe(`${PATH}`, () => {
  let app: App;
  let request: supertest.SuperTest<supertest.Test>;

  let userController: sinon.SinonStubbedInstance<UserController>;

  before(() => {
    app = new App();
    request = supertest.agent(app.server);
  });

  beforeEach(() => {
    userController = sinon.createStubInstance(UserController);
    UsersRouteHandler.userController = userController;
  });

  after(done => {
    app.server.close(done);
  });

  describe(`GET ${PATH}/`, () => {
    it('should return all users without password', done => {
      userController.getUsers.resolves([
        {
          userId: 'a',
          username: 'Karl',
          password: 'mySecret',
          groups: ['groupA', 'groupB'],
        },
        {
          userId: 'b',
          username: 'Heinz',
          password: 'myTOPSecret',
          groups: ['groupC'],
        },
      ]);

      request
        .get(`${PATH}/`)
        .expect(200)
        .end((error, response: supertest.Response) => {
          expect(response.body[0]).to.deep.equal({
            userId: 'a',
            username: 'Karl',
            groups: ['groupA', 'groupB'],
          });
          expect('password' in response.body[0]).to.be.false;
          expect(response.body[1]).to.deep.equal({
            userId: 'b',
            username: 'Heinz',
            groups: ['groupC'],
          });
          expect('password' in response.body[1]).to.be.false;

          done();
        });
    });

    it('should return 503 if UserController throws DBError', done => {
      userController.getUsers.rejects(
        new Error('DBError: Something went wrong!')
      );

      request.get(`${PATH}/`).expect(503, done);
    });

    it('should return 500 if UserController throws some Error', done => {
      userController.getUsers.rejects(new Error('Some Error!'));

      request.get(`${PATH}/`).expect(500, done);
    });
  });

  describe(`GET ${PATH}/:id`, () => {
    it('should return all users without password', done => {
      userController.getUserById.withArgs('abc').resolves({
        userId: 'a',
        username: 'Karl',
        password: 'mySecret',
        groups: ['groupA', 'groupB'],
      });

      request
        .get(`${PATH}/abc`)
        .expect(200)
        .end((error, response: supertest.Response) => {
          expect(response.body).to.deep.equal({
            userId: 'a',
            username: 'Karl',
            groups: ['groupA', 'groupB'],
          });
          expect('password' in response.body).to.be.false;

          done();
        });
    });

    it('should return 503 if UserController throws DBError', done => {
      userController.getUserById.rejects(
        new Error('DBError: Something went wrong!')
      );

      request.get(`${PATH}/abc`).expect(503, done);
    });

    it('should return 404 if UserController throws UserNotFound', done => {
      userController.getUserById.rejects(
        new Error('UserNotFound: Something went wrong!')
      );

      request.get(`${PATH}/abc`).expect(404, done);
    });

    it('should return 500 if UserController throws some Error', done => {
      userController.getUserById.rejects(new Error('Some Error!'));

      request.get(`${PATH}/abc`).expect(500, done);
    });
  });

  describe(`POST ${PATH}/`, () => {
    it('should add user', done => {
      userController.addUser.resolves();

      const user: UserModel = {
        username: 'Karl',
        password: 'abc',
        groups: ['groupA'],
      };

      request
        .post(`${PATH}/`)
        .send(user)
        .expect(204)
        .end(() => {
          expect(userController.addUser.callCount).to.equal(1);
          expect(userController.addUser.firstCall.args[0]).to.deep.equal(user);

          done();
        });
    });

    it('should return 503 if UserController throws DBError', done => {
      userController.addUser.rejects(
        new Error('DBError: Something went wrong!')
      );

      const user: UserModel = {
        username: 'Karl',
        password: 'abc',
        groups: ['groupA'],
      };

      request.post(`${PATH}/`).send(user).expect(503, done);
    });

    it('should return 400 if UserController throws InvalidData', done => {
      userController.addUser.rejects(
        new Error('InvalidData: Something went wrong!')
      );

      const user: UserModel = {
        username: 'Karl',
        password: 'abc',
        groups: ['groupA'],
      };

      request.post(`${PATH}/`).send(user).expect(400, done);
    });

    it('should return 409 if UserController throws DuplicatedData', done => {
      userController.addUser.rejects(
        new Error('DuplicatedData: Something went wrong!')
      );

      const user: UserModel = {
        username: 'Karl',
        password: 'abc',
        groups: ['groupA'],
      };

      request.post(`${PATH}/`).send(user).expect(409, done);
    });

    it('should return 500 if UserController throws some Error', done => {
      userController.addUser.rejects(new Error('Some Error!'));

      const user: UserModel = {
        username: 'Karl',
        password: 'abc',
        groups: ['groupA'],
      };

      request.post(`${PATH}/`).send(user).expect(500, done);
    });
  });

  describe(`DELETE ${PATH}/:id`, () => {
    it('should delete user', done => {
      userController.deleteUser.resolves();

      request
        .delete(`${PATH}/abc`)
        .expect(204)
        .end(() => {
          expect(userController.deleteUser.callCount).to.equal(1);
          expect(userController.deleteUser.firstCall.args[0]).to.equal('abc');

          done();
        });
    });

    it('should return 503 if UserController throws DBError', done => {
      userController.deleteUser.rejects(
        new Error('DBError: Something went wrong!')
      );

      request.delete(`${PATH}/abc`).expect(503, done);
    });

    it('should return 404 if UserController throws UserNotFound', done => {
      userController.deleteUser.rejects(
        new Error('UserNotFound: Something went wrong!')
      );

      request.delete(`${PATH}/abc`).expect(404, done);
    });

    it('should return 500 if UserController throws some Error', done => {
      userController.deleteUser.rejects(new Error('Some Error!'));

      request.delete(`${PATH}/abc`).expect(500, done);
    });
  });

  describe(`PUT ${PATH}/`, () => {
    it('should update user', done => {
      userController.updateUser.resolves();

      const user: UserModel = {
        username: 'Karl',
        password: 'abc',
        groups: ['groupA'],
      };

      request
        .put(`${PATH}/a`)
        .send(user)
        .expect(204)
        .end(() => {
          expect(userController.updateUser.callCount).to.equal(1);
          expect(userController.updateUser.firstCall.args[0]).to.deep.equal({
            ...user,
            userId: 'a',
          });

          done();
        });
    });

    it('should return 503 if UserController throws DBError', done => {
      userController.updateUser.rejects(
        new Error('DBError: Something went wrong!')
      );

      const user: UserModel = {
        username: 'Karl',
        password: 'abc',
        groups: ['groupA'],
      };

      request.put(`${PATH}/a`).send(user).expect(503, done);
    });

    it('should return 400 if UserController throws InvalidData', done => {
      userController.updateUser.rejects(
        new Error('InvalidData: Something went wrong!')
      );

      const user: UserModel = {
        username: 'Karl',
        password: 'abc',
        groups: ['groupA'],
      };

      request.put(`${PATH}/a`).send(user).expect(400, done);
    });

    it('should return 409 if UserController throws DuplicatedData', done => {
      userController.updateUser.rejects(
        new Error('DuplicatedData: Something went wrong!')
      );

      const user: UserModel = {
        username: 'Karl',
        password: 'abc',
        groups: ['groupA'],
      };

      request.put(`${PATH}/a`).send(user).expect(409, done);
    });

    it('should return 404 if UserController throws UserNotFound', done => {
      userController.updateUser.rejects(
        new Error('UserNotFound: Something went wrong!')
      );

      const user: UserModel = {
        username: 'Karl',
        password: 'abc',
        groups: ['groupA'],
      };

      request.put(`${PATH}/a`).send(user).expect(404, done);
    });

    it('should return 500 if UserController throws some Error', done => {
      userController.updateUser.rejects(new Error('Some Error!'));

      const user: UserModel = {
        username: 'Karl',
        password: 'abc',
        groups: ['groupA'],
      };

      request.put(`${PATH}/a`).send(user).expect(500, done);
    });
  });

  describe(`GET ${PATH}/me`, () => {
    let sandbox: sinon.SinonSandbox;
    let argonVerifyStub: sinon.SinonStub;

    beforeEach(done => {
      sandbox = sinon.createSandbox();

      argonVerifyStub = sandbox.stub(argon2, 'verify');
      argonVerifyStub.resolves(true);

      sandbox.stub(UserController.prototype, 'getUserByName').resolves({
        userId: 'a',
        username: 'Karl',
        password: 'mySecret',
        groups: ['groupA', 'groupB'],
      });

      sandbox.stub(UserController.prototype, 'getUserById').resolves({
        userId: 'a',
        username: 'Karl',
        password: 'mySecret',
        groups: ['groupA', 'groupB'],
      });

      request
        .post('/yadu/api/v1/auth/login')
        .send({username: 'Karl', password: 'admin'})
        .end(error => {
          console.log('a');
          if (error) {
            return done(error);
          }

          done();
        });
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('should return current user without password', done => {
      userController.getUserById.withArgs('a').resolves({
        userId: 'a',
        username: 'Karl',
        password: 'mySecret',
        groups: ['groupA', 'groupB'],
      });

      request
        .get(`${PATH}/me`)
        .expect(200)
        .end((error, response: supertest.Response) => {
          expect(response.body).to.deep.equal({
            userId: 'a',
            username: 'Karl',
            groups: ['groupA', 'groupB'],
          });

          done();
        });
    });

    it('should return 503 if UserController throws DBError', done => {
      userController.getUserById
        .withArgs('a')
        .rejects(new Error('DBError: Something went wrong!'));

      request.get(`${PATH}/me`).expect(503, done);
    });

    it('should return 404 if UserController throws UserNotFoundError', done => {
      userController.getUserById
        .withArgs('a')
        .rejects(new Error('UserNotFound: Something went wrong!'));

      request.get(`${PATH}/me`).expect(404, done);
    });

    it('should return 500 if UserController throws some Error', done => {
      userController.getUserById
        .withArgs('a')
        .rejects(new Error('Some Error!'));

      request.get(`${PATH}/me`).expect(500, done);
    });
  });
});
