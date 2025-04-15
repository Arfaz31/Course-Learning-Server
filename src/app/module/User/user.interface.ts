import { Model, Types } from 'mongoose';
import { USER_ROLE } from './user.constant';

export type TUser = {
  id?: string;
  name: string;
  email: string;
  password: string;
  role: keyof typeof USER_ROLE;
  profileImg?: string;
  isDeleted: boolean;
  passwordChangedAt?: Date;
  follower: Types.ObjectId[];
  following: Types.ObjectId[];
  likeCourses: Types.ObjectId[];
};

export interface UserModel extends Model<TUser> {
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean;
}
