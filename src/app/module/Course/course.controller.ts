/* eslint-disable @typescript-eslint/no-explicit-any */
import { CourseService } from './course.services';

import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { TImageFiles } from '../../interface/image.interface';

const createCourse = catchAsync(async (req, res) => {
  const files = req.files as TImageFiles;

  const thumbnail = files?.image ? files.image[0] : undefined;
  const result = await CourseService.createCourse(req.body, thumbnail as any);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Course created successfully',
    data: result,
  });
});

const getAllCourses = catchAsync(async (req, res) => {
  const result = await CourseService.getAllCourses(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Courses fetched successfully',
    data: result,
  });
});

const getSingleCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CourseService.getSingleCourse(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course fetched successfully',
    data: result,
  });
});

const updateCourse = catchAsync(async (req, res) => {
  const { id } = req.params;

  const files = req.files as TImageFiles;

  const thumbnail = files?.image ? files.image[0] : undefined;
  const result = await CourseService.updateCourse(id, req.body, thumbnail);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course updated successfully',
    data: result,
  });
});

const deleteCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CourseService.deleteCourse(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course deleted successfully',
    data: result,
  });
});

const getTeacherCourses = catchAsync(async (req, res) => {
  const teacherId = req.user.id;
  const result = await CourseService.getTeacherCourses(teacherId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Teacher courses fetched successfully',
    data: result,
  });
});

export const CourseController = {
  createCourse,
  getAllCourses,
  getSingleCourse,
  updateCourse,
  deleteCourse,
  getTeacherCourses,
};
