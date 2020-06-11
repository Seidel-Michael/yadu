import mongoose, {Schema, Document} from 'mongoose';
import shortid from 'shortid';

export interface UserModel {
  userid?: string;
  username: string;
  password: string | null;
  groups: string[];
}

export interface UserSchema extends Document, UserModel {}

const UserSchema: Schema = new Schema({
  userid: {type: String, unique: true, default: shortid.generate},
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  groups: {type: [String], required: true},
});

export default mongoose.model<UserSchema>('User', UserSchema);
