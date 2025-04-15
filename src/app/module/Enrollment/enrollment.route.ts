// module/Enrollment/enrollment.route.ts
import { Router } from 'express';
import auth from '../../middleware/auth';
import { validateRequest } from '../../middleware/validateRequest';
import { USER_ROLE } from '../User/user.constant';
import { EnrollmentController } from './enrollment.controller';
import {
  CreateEnrollmentValidationSchema,
  UpdateEnrollmentValidationSchema,
  MarkTopicCompletedValidationSchema,
} from './enrollment.validation';

const router = Router();

router.post(
  '/create-enrollment',
  auth(USER_ROLE.STUDENT),
  validateRequest(CreateEnrollmentValidationSchema),
  EnrollmentController.enrollInCourse,
);

// Get my enrollments
router.get(
  '/my-enrollments',
  auth(USER_ROLE.STUDENT),
  EnrollmentController.getMyEnrollments,
);

// Admin routes
// Get all enrollments (for admin)
router.get(
  '/',
  auth(USER_ROLE.SUPER_ADMIN),
  EnrollmentController.getAllEnrollments,
);

// Get my enrollment for a specific course with progress info
router.get(
  '/my-courses/:courseId',
  auth(USER_ROLE.STUDENT),
  EnrollmentController.getMyCourseEnrollment,
);

// Mark a topic as completed
router.patch(
  '/my-courses/:courseId/complete-topic',
  auth(USER_ROLE.STUDENT),
  validateRequest(MarkTopicCompletedValidationSchema),
  EnrollmentController.markTopicCompleted,
);

// Teacher routes
// Get enrollment analytics for a course
router.get(
  '/course-analytics/:courseId',
  auth(USER_ROLE.TEACHER),
  EnrollmentController.getCourseEnrollmentAnalytics,
);

// Update enrollment status (for admin)
router.patch(
  '/:id',
  auth(USER_ROLE.SUPER_ADMIN),
  validateRequest(UpdateEnrollmentValidationSchema),
  EnrollmentController.updateEnrollmentStatus,
);

export const EnrollmentRoutes = router;
