import { TImageFiles } from '../../interface/image.interface';
import CatchAsync from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { UserService } from './user.services';
import httpStatus from 'http-status';
const getAllUsersFromDB = CatchAsync(async (req, res) => {
  const result = await UserService.getAllUsersFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users fetched successfully',
    meta: result.meta,
    data: result.result,
  });
});

const getSingleUserFromDB = CatchAsync(async (req, res) => {
  const result = await UserService.getSingleUserFromDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User fetched successfully',
    data: result,
  });
});

const getMeFromDB = CatchAsync(async (req, res) => {
  const result = await UserService.getMeFromDB(req.user.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User fetched successfully',
    data: result,
  });
});

const updateUserProfile = CatchAsync(async (req, res) => {
  const files = req.files as TImageFiles;

  // Extract single files from the fields
  const profilePhoto = files?.image ? files.image[0] : undefined;
  const result = await UserService.updateUserProfileData(
    req.user,
    req.body,
    profilePhoto,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Profile updated successfully',
    data: result,
  });
});

export const UserController = {
  getAllUsersFromDB,
  getSingleUserFromDB,
  getMeFromDB,
  updateUserProfile,
};
