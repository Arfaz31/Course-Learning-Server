import httpStatus from 'http-status';
import CatchAsync from '../utils/catchAsync';
import AppError from '../Error/AppError';
export const parseBodyForFormData = CatchAsync(async (req, res, next) => {
  // If there's no 'data' field but files are present, skip parsing JSON
  if (!req.body.data && req.files) {
    return next();
  }

  // If there's no data at all and no files, throw error
  if (!req.body.data) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Please provide data in the body under data key',
    );
  }

  req.body = JSON.parse(req.body.data);
  next();
});
