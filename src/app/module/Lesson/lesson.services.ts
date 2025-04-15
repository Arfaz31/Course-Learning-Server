import httpStatus from 'http-status';
import { Course } from '../Course/course.model';
import { TLesson, TUpdateLesson } from './lesson.interface';
import { Lesson } from './lesson.model';

import QueryBuilder from '../../Builder/QueryBuilder';
import { JwtPayload } from 'jsonwebtoken';
import AppError from '../../Error/AppError';
import { lessonSearchableFields } from './lesson.constant';

const createLesson = async (payload: TLesson, user: JwtPayload) => {
  const isCourseExist = await Course.findById(payload.course);
  if (!isCourseExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Course not found');
  }

  if (isCourseExist.teacher.toString() !== user.id) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You are not authorized to add lessons to this course',
    );
  }

  // Get the highest order number for lessons in this course
  const lastLesson = await Lesson.findOne({ course: payload.course })
    .sort({ order: -1 })
    .limit(1);

  // If order is not provided, set it to the next available order
  payload.order = (lastLesson?.order ?? 0) + 1;

  const result = await Lesson.create(payload);
  return result;
};

const getAllLessons = async (query: Record<string, unknown>) => {
  const lessonQuery = new QueryBuilder(
    Lesson.find().populate('course', '_id title'),
    query,
  )
    .search(lessonSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await lessonQuery.modelQuery;
  const meta = await lessonQuery.countTotal();

  return {
    meta,
    result,
  };
};

const getLessonsByCourse = async (courseId: string) => {
  const lessons = await Lesson.find({ course: courseId }).sort({ order: 1 });

  return lessons;
};

const getSingleLesson = async (id: string) => {
  const lesson = await Lesson.findById(id).populate('course', '_id title');

  if (!lesson) {
    throw new AppError(httpStatus.NOT_FOUND, 'Lesson not found');
  }

  return lesson;
};

const updateLesson = async (
  id: string,
  payload: Partial<TUpdateLesson>,
  user: JwtPayload,
) => {
  // Check if the lesson exists
  const lesson = await Lesson.findById(id);
  if (!lesson) {
    throw new AppError(httpStatus.NOT_FOUND, 'Lesson not found');
  }

  // Find the course to check if the user is authorized
  const course = await Course.findById(lesson.course);
  if (!course) {
    throw new AppError(httpStatus.NOT_FOUND, 'Course not found');
  }

  // Check if the user is the teacher of this course
  if (course.teacher.toString() !== user.id) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You are not authorized to update lessons for this course',
    );
  }

  const result = await Lesson.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

const deleteLesson = async (id: string, user: JwtPayload) => {
  const lesson = await Lesson.findById(id);
  if (!lesson) {
    throw new AppError(httpStatus.NOT_FOUND, 'Lesson not found');
  }

  const course = await Course.findById(lesson.course);
  if (!course) {
    throw new AppError(httpStatus.NOT_FOUND, 'Course not found');
  }

  if (course.teacher.toString() !== user.id) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You are not authorized to delete lessons for this course',
    );
  }

  // Delete the lesson
  const result = await Lesson.findByIdAndDelete(id);

  // Reorder the remaining lessons
  await Lesson.updateMany(
    { course: lesson.course, order: { $gt: lesson.order } },
    { $inc: { order: -1 } },
  );

  return result;
};

export const LessonService = {
  createLesson,
  getAllLessons,
  getLessonsByCourse,
  getSingleLesson,
  updateLesson,
  deleteLesson,
};
