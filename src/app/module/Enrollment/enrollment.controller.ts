// module/Enrollment/enrollment.controller.ts
import httpStatus from 'http-status';
import CatchAsync from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { EnrollmentService } from './enrollment.service';

const enrollInCourse = CatchAsync(async (req, res) => {
  const result = await EnrollmentService.enrollInCourse(req.body, req.user);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Successfully enrolled in the course',
    data: result,
  });
});

const getAllEnrollments = CatchAsync(async (req, res) => {
  const result = await EnrollmentService.getAllEnrollments(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Enrollments retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const getMyEnrollments = CatchAsync(async (req, res) => {
  const result = await EnrollmentService.getMyEnrollments(req.user, req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Your enrollments retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const getMyCourseEnrollment = CatchAsync(async (req, res) => {
  const { courseId } = req.params;
  const result = await EnrollmentService.getMyCourseEnrollment(
    courseId,
    req.user,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course enrollment details retrieved successfully',
    data: result,
  });
});

const markTopicCompleted = CatchAsync(async (req, res) => {
  const { courseId } = req.params;
  const { topicId } = req.body;

  const result = await EnrollmentService.markTopicCompleted(
    courseId,
    topicId,
    req.user,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Topic marked as completed',
    data: result,
  });
});

const updateEnrollmentStatus = CatchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await EnrollmentService.updateEnrollmentStatus(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Enrollment status updated successfully',
    data: result,
  });
});

const getCourseEnrollmentAnalytics = CatchAsync(async (req, res) => {
  const { courseId } = req.params;
  const result = await EnrollmentService.getCourseEnrollmentAnalytics(
    courseId,
    req.user,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course enrollment analytics retrieved successfully',
    data: result,
  });
});

export const EnrollmentController = {
  enrollInCourse,
  getAllEnrollments,
  getMyEnrollments,
  getMyCourseEnrollment,
  markTopicCompleted,

  updateEnrollmentStatus,
  getCourseEnrollmentAnalytics,
};
