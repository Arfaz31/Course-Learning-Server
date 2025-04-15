import { JwtPayload } from 'jsonwebtoken';
import QueryBuilder from '../../Builder/QueryBuilder';
import { userSearchableFields } from './user.constant';
import { User } from './user.model';
import { TUser } from './user.interface';
import { TImageFile } from '../../interface/image.interface';
import mongoose from 'mongoose';
import AppError from '../../Error/AppError';
import httpStatus from 'http-status';

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
  const result = await User.findById(id).populate([
    {
      path: 'following',
      select: '_id name email profileImg',
    },
    {
      path: 'follower',
      select: '_id name email profileImg',
    },
  ]);

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

const createFollow = async (userId: string, followingId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (userId === followingId) {
      throw new AppError(httpStatus.BAD_REQUEST, 'You cannot follow yourself.');
    }

    const followerObjectId = new mongoose.Types.ObjectId(userId); //current user
    const followingObjectId = new mongoose.Types.ObjectId(followingId); //followed user(current user jake follow korche tar id)

    const currentUser = await User.findById(followerObjectId).session(session);
    const followingUser =
      await User.findById(followingObjectId).session(session);

    if (!currentUser || !followingUser) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    if (!currentUser?.following?.includes(followingObjectId)) {
      currentUser?.following?.push(followingObjectId);
    } else {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'You have already followed this user',
      );
    }

    if (!followingUser?.follower?.includes(followerObjectId)) {
      followingUser?.follower?.push(followerObjectId);
    } else {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "You are already on this user's follower list",
      );
    }

    await currentUser.save({ session });
    await followingUser.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return {
      message: `You are now following ${followingUser.name}`,
    };
  } catch (error) {
    // If any error occurs, abort the transaction
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const unFollowUser = async (userId: string, unFollowedUserId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const unFollowedUserObjectId = new mongoose.Types.ObjectId(
      unFollowedUserId,
    );

    const user = await User.findById(userObjectId).session(session);
    const unFollowedUser = await User.findById(unFollowedUserObjectId).session(
      session,
    );

    if (!user || !unFollowedUser) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    const updateFollowingResult = await User.updateOne(
      { _id: userObjectId },
      { $pull: { following: unFollowedUserObjectId } },
      { session },
    );

    const updateFollowerResult = await User.updateOne(
      { _id: unFollowedUserObjectId },
      { $pull: { follower: userObjectId } },
      { session },
    );

    if (
      updateFollowingResult.modifiedCount === 0 ||
      updateFollowerResult.modifiedCount === 0
    ) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Unfollow action failed');
    }

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return {
      message: `You have successfully unfollowed ${unFollowedUser.name}`,
    };
  } catch (error) {
    // If any error occurs, abort the transaction
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const UserService = {
  getAllUsersFromDB,
  getSingleUserFromDB,
  getMeFromDB,
  updateUserProfileData,
  createFollow,
  unFollowUser,
};
