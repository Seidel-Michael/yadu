
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import sinonMongoose from 'sinon-mongoose';
import User, { IUser } from '../db/models/user';
import { UserController } from './user-controller';

chai.use(chaiAsPromised);

describe('UserController', () => {
    
    describe('getUsers', () => {

        it('should return users with passwords set to null');

        it('should return users', async () => {
            const controller = new UserController();
            const UserMock = sinon.mock(User);

            UserMock.expects('find').resolves([{ username: 'Klaus', password: 'hash1', groups: ['groupA', 'groupB'] }, { username: 'Heinz', password: 'hash2', groups: ['groupA', 'groupC'] }] as IUser[]);

            const result: IUser[] =  await controller.getUsers();

            console.log(result);
        });

        it('should return empty array if no user was found');

        it('should reject with DBError if something went wrong');
    });

});