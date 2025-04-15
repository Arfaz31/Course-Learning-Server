import { Router } from 'express';
import auth from '../../middleware/auth';
import { validateRequest } from '../../middleware/validateRequest';
import { USER_ROLE } from '../User/user.constant';
import { LessonController } from './lesson.controller';
import {
  CreateLessonValidationSchema,
  UpdateLessonValidationSchema,
} from './lesson.validation';

const router = Router();

router.post(
  '/create-lesson',
  auth(USER_ROLE.TEACHER),
  validateRequest(CreateLessonValidationSchema),
  LessonController.createLesson,
);

router.get(
  '/',
  auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.TEACHER),
  LessonController.getAllLessons,
);

// Get all lessons for a specific course (public)
router.get(
  '/specific-course/:courseId',
  auth(...Object.values(USER_ROLE)),
  LessonController.getLessonsByCourse,
);

// Get a single lesson (public)
router.get('/:id', LessonController.getSingleLesson);

// Update a lesson (only teacher who owns the associated course)
router.patch(
  '/:id',
  auth(USER_ROLE.TEACHER),
  validateRequest(UpdateLessonValidationSchema),
  LessonController.updateLesson,
);

// Delete a lesson (only teacher who owns the associated course)
router.delete('/:id', auth(USER_ROLE.TEACHER), LessonController.deleteLesson);

export const LessonRoutes = router;
