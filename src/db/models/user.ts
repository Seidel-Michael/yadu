import mongoose, {Schema, Document} from 'mongoose';

export interface IUser
{
  username: String,
  password: String | null,
  groups: String[]
}

export interface IUserModel extends Document, IUser
{

}

const UserSchema: Schema = new Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  groups: {type: [String], required: true},
});

export default mongoose.model<IUserModel>('User', UserSchema);
