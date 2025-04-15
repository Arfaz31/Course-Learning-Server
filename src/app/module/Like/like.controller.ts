import catchAsync from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';

import { LikeServices } from './like.services';

const likeCourse = catchAsync(async (req, res) => {
  const { id } = req.user;
  const { courseId } = req.params;

  const likeCount = await LikeServices.likeCourse(courseId, id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Successfully liked',
    data: { likeCount },
  });
});

const unLikeCourse = catchAsync(async (req, res) => {
  const { id } = req.user;
  const { courseId } = req.params;

  const likeCount = await LikeServices.unLikeCourse(courseId, id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Like removed',
    data: { likeCount },
  });
});

export const LikeController = {
  likeCourse,
  unLikeCourse,
};
