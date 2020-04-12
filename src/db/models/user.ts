import mongoose, {Schema, Document} from 'mongoose';

export interface UserModel {
  username: string;
  password: string | null;
  groups: string[];
}

export interface UserSchema extends Document, UserModel {}

const UserSchema: Schema = new Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  groups: {type: [String], required: true},
});

export default mongoose.model<UserSchema>('User', UserSchema);
