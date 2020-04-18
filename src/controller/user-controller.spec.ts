import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import User, {UserModel} from '../db/models/user';
import {UserController} from './user-controller';
import * as dbHandler from '../../test-helper/db-handler';

chai.use(chaiAsPromised);

describe('UserController', () => {
  /**
   * Connect to a new in-memory database before running any tests.
   */
  before(async () => await dbHandler.connect());

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

    // Mongoose throws MongoError
    it('should reject with DBError if something went wrong');
  });
});
