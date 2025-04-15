import { JwtPayload } from 'jsonwebtoken';
import QueryBuilder from '../../Builder/QueryBuilder';
import { userSearchableFields } from './user.constant';
import { User } from './user.model';
import { TUser } from './user.interface';
import { TImageFile } from '../../interface/image.interface';

const getAllUsersFromDB = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(User.find(), query)
    .search(userSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await userQuery.modelQuery;
  const meta = await userQuery.countTotal();
  return {
    result,
    meta,
  };
};

const getSingleUserFromDB = async (id: string) => {
  const result = await User.findById(id);
  return result;
};

const getMeFromDB = async (id: string) => {
  const result = await User.findById(id);

  return result;
};

const updateUserProfileData = async (
  user: JwtPayload, // Logged-in user
  data: Partial<TUser>,
  profileImg?: TImageFile,
) => {
  const profileImagePath = (profileImg && profileImg.path) || '';

  const result = await User.findOneAndUpdate(
    { _id: user.id },
    { ...data, profileImg: profileImagePath },
    { new: true },
  );
  return result;
};

export const UserService = {
  getAllUsersFromDB,
  getSingleUserFromDB,
  getMeFromDB,
  updateUserProfileData,
};
