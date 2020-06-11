import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import User, {UserModel} from '../db/models/user';
import {UserController} from './user-controller';
import * as dbHandler from '../../test-helper/db-handler';
import sinon from 'sinon';
import {MongoError} from 'mongodb'; // eslint-disable-line node/no-extraneous-import

chai.use(chaiAsPromised);

describe('UserController', () => {
  /**
   * Connect to a new in-memory database before running any tests.
   */
  before(async () => await dbHandler.connect());

  let stub: any = null; // eslint-disable-line @typescript-eslint/no-explicit-any

  afterEach(() => {
    if (stub !== null) {
      stub.restore();
    }
  });

  /**
   * Clear all test data after every test.
   */
  afterEach(async () => await dbHandler.clearDatabase());

  /**
   * Remove and close the db and server.
   */
  after(async () => await dbHandler.closeDatabase());

  describe('getUsers', () => {
    it('should return all users', async () => {
      await (
        await User.create({
          username: 'Heinz',
          password: 'hash1',
          groups: ['groupA'],
        })
      ).save();
      await (
        await User.create({
          username: 'Karl',
          password: 'hash2',
          groups: ['groupA', 'groupC'],
        })
      ).save();
      const controller = new UserController();

      const result: UserModel[] = await controller.getUsers();

      expect(result.length).to.equal(2);
      expect(result[0]).to.deep.include({
        username: 'Heinz',
        groups: ['groupA'],
      });
      expect(result[1]).to.deep.include({
        username: 'Karl',
        groups: ['groupA', 'groupC'],
      });
    });

    it('should return empty array if no user was found', async () => {
      const controller = new UserController();

      const result: UserModel[] = await controller.getUsers();

      expect(result.length).to.equal(0);
    });

    it('should reject with DBError if something went wrong', () => {
      stub = sinon.stub(User, 'find');
      stub.throws(new MongoError('SomeError'));

      const controller = new UserController();

      return expect(controller.getUsers()).to.be.rejectedWith('DBError');
    });
  });

  describe('getUserByName', () => {
    it('should return correct user', async () => {
      await (
        await User.create({
          username: 'Heinz',
          password: 'hash1',
          groups: ['groupA'],
        })
      ).save();
      await (
        await User.create({
          username: 'Karl',
          password: 'hash2',
          groups: ['groupA', 'groupC'],
        })
      ).save();
      const controller = new UserController();

      const result: UserModel = await controller.getUserByName('Karl');

      expect(result).to.deep.include({
        username: 'Karl',
        password: 'hash2',
        groups: ['groupA', 'groupC'],
      });
    });

    it('should throw UserNotFound Error', () => {
      const controller = new UserController();
      return expect(controller.getUserByName('Karl')).to.be.rejectedWith(
        'UserNotFound'
      );
    });

    it('should reject with DBError if something went wrong', () => {
      stub = sinon.stub(User, 'findOne');
      stub.throws(new MongoError('SomeError'));

      const controller = new UserController();

      return expect(controller.getUserByName('Karl')).to.be.rejectedWith(
        'DBError'
      );
    });
  });

  describe('getUserById', () => {
    it('should return correct user', async () => {
      await (
        await User.create({
          userId: 'a',
          username: 'Heinz',
          password: 'hash1',
          groups: ['groupA'],
        })
      ).save();
      await (
        await User.create({
          userId: 'b',
          username: 'Karl',
          password: 'hash2',
          groups: ['groupA', 'groupC'],
        })
      ).save();
      const controller = new UserController();

      const result: UserModel = await controller.getUserById('b');

      expect(result).to.deep.include({
        username: 'Karl',
        password: 'hash2',
        groups: ['groupA', 'groupC'],
      });
    });

    it('should throw UserNotFound Error', () => {
      const controller = new UserController();
      return expect(controller.getUserById('a')).to.be.rejectedWith(
        'UserNotFound'
      );
    });

    it('should reject with DBError if something went wrong', () => {
      stub = sinon.stub(User, 'findOne');
      stub.throws(new MongoError('SomeError'));

      const controller = new UserController();

      return expect(controller.getUserById('a')).to.be.rejectedWith('DBError');
    });
  });

  describe('deleteUser', () => {
    it('should remove user', async () => {
      await (
        await User.create({
          userId: 'a',
          username: 'Heinz',
          password: 'hash1',
          groups: ['groupA'],
        })
      ).save();
      await (
        await User.create({
          userId: 'b',
          username: 'Karl',
          password: 'hash2',
          groups: ['groupA', 'groupC'],
        })
      ).save();
      const controller = new UserController();

      await controller.deleteUser('a');

      const result: UserModel[] = await controller.getUsers();

      expect(result.length).to.equal(1);
      expect(result[0]).to.deep.include({
        username: 'Karl',
        groups: ['groupA', 'groupC'],
      });
    });

    it('should throw UserNotFound Error', () => {
      const controller = new UserController();
      return expect(controller.deleteUser('a')).to.be.rejectedWith(
        'UserNotFound'
      );
    });

    it('should reject with DBError if something went wrong', () => {
      stub = sinon.stub(User, 'deleteOne');
      stub.throws(new MongoError('SomeError'));

      const controller = new UserController();

      return expect(controller.deleteUser('a')).to.be.rejectedWith('DBError');
    });
  });

  describe('updateUser', () => {
    it('should update user', async () => {
      await (
        await User.create({
          userId: 'a',
          username: 'Heinz',
          password: 'hash1',
          groups: ['groupA'],
        })
      ).save();
      const controller = new UserController();

      await controller.updateUser({
        userId: 'a',
        username: 'Karl',
        password: 'newPassword',
        groups: ['groupA', 'groupB'],
      });

      const result: UserModel[] = await controller.getUsers();

      expect(result.length).to.equal(1);
      expect(result[0]).to.deep.include({
        username: 'Karl',
        password: 'newPassword',
        groups: ['groupA', 'groupB'],
      });
    });

    it('should throw UserNotFound Error', () => {
      const controller = new UserController();
      return expect(
        controller.updateUser({
          userId: 'a',
          username: 'Karl',
          password: 'newPassword',
          groups: ['groupA', 'groupB'],
        })
      ).to.be.rejectedWith('UserNotFound');
    });

    it('should reject with DBError if something went wrong', () => {
      stub = sinon.stub(User, 'updateOne');
      stub.throws(new MongoError('SomeError'));

      const controller = new UserController();

      return expect(
        controller.updateUser({
          userId: 'a',
          username: 'Karl',
          password: 'newPassword',
          groups: ['groupA', 'groupB'],
        })
      ).to.be.rejectedWith('DBError');
    });
  });
});
