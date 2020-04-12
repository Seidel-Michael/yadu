import mongoose from 'mongoose';
import { IUser } from '../db/models/user'

export class UserController
{
    UserController(db: typeof mongoose)
    {
        
    }

    async getUsers(): Promise<IUser[]>
    {
        throw new Error('Not implemented!');
    }
}