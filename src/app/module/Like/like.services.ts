// services
import httpStatus from 'http-status';
import AppError from '../../Error/AppError';
import { Types } from 'mongoose';
import { Course } from '../Course/course.model';

// Like a Course
export const likeCourse = async (courseId: string, userId: string) => {
  const course = await Course.findById(courseId);
  if (!course) throw new AppError(httpStatus.NOT_FOUND, 'Course not found');
  const userObjectId = new Types.ObjectId(userId);

  // Add like, remove dislike if present
  const updatedCourse = await Course.findByIdAndUpdate(
    courseId,
    { $addToSet: { like: userObjectId } },
    { new: true },
  );

  if (!updatedCourse) {
    throw new AppError(httpStatus.NOT_FOUND, 'Course not found');
  }
  return updatedCourse.like.length;
};

// Unlike a Course
export const unLikeCourse = async (courseId: string, userId: string) => {
  const userObjectId = new Types.ObjectId(userId);
  const updatedCourse = await Course.findByIdAndUpdate(
    courseId,
    { $pull: { like: userObjectId } },
    { new: true },
  );

  if (!updatedCourse) {
    throw new AppError(httpStatus.NOT_FOUND, 'Course not found');
  }
  return updatedCourse.like.length;
};

export const LikeServices = {
  likeCourse,
  unLikeCourse,
};
