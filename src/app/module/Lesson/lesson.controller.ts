// module/Lesson/lesson.controller.ts
import httpStatus from 'http-status';
import CatchAsync from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { LessonService } from './lesson.services';

const createLesson = CatchAsync(async (req, res) => {
  const result = await LessonService.createLesson(req.body, req.user);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Lesson created successfully',
    data: result,
  });
});

const getAllLessons = CatchAsync(async (req, res) => {
  const result = await LessonService.getAllLessons(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Lessons retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const getLessonsByCourse = CatchAsync(async (req, res) => {
  const { courseId } = req.params;
  const result = await LessonService.getLessonsByCourse(courseId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Lessons retrieved successfully',
    data: result,
  });
});

const getSingleLesson = CatchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await LessonService.getSingleLesson(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Lesson retrieved successfully',
    data: result,
  });
});

const updateLesson = CatchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await LessonService.updateLesson(id, req.body, req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Lesson updated successfully',
    data: result,
  });
});

const deleteLesson = CatchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await LessonService.deleteLesson(id, req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Lesson deleted successfully',
    data: result,
  });
});

export const LessonController = {
  createLesson,
  getAllLessons,
  getLessonsByCourse,
  getSingleLesson,
  updateLesson,
  deleteLesson,
};
