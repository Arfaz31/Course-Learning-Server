import express from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../User/user.constant';
import { validateRequest } from '../../middleware/validateRequest';
import { CourseController } from './course.controller';
import {
  createCourseValidationSchema,
  updateCourseValidationSchema,
} from './course.validationSchema';
import { uploadSingleImage } from '../../config/multer.config';
import { validateFileRequest } from '../../middleware/validateUploadedFile';
import { UploadedFilesArrayZodSchema } from '../../utils/uploadedFileValidationSchema';
import { parseBodyForFormData } from '../../middleware/ParseBodyForFormData';

const router = express.Router();

router.post(
  '/create-course',
  auth(USER_ROLE.TEACHER),
  uploadSingleImage,
  validateFileRequest(UploadedFilesArrayZodSchema),
  parseBodyForFormData,
  validateRequest(createCourseValidationSchema),
  CourseController.createCourse,
);

router.get(
  '/',
  auth(...Object.values(USER_ROLE)),
  CourseController.getAllCourses,
);

router.get(
  '/teacher/my-courses',
  auth(USER_ROLE.TEACHER),
  CourseController.getTeacherCourses,
);

router.get('/:id', CourseController.getSingleCourse);

router.patch(
  '/update-course/:id',
  auth(USER_ROLE.TEACHER),
  uploadSingleImage,
  validateFileRequest(UploadedFilesArrayZodSchema),
  parseBodyForFormData,
  validateRequest(updateCourseValidationSchema),

  CourseController.updateCourse,
);

router.delete('/:id', auth(USER_ROLE.TEACHER), CourseController.deleteCourse);

export const CourseRoutes = router;
