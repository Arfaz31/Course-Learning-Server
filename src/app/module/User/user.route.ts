import { Router } from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from './user.constant';
import { UserController } from './user.controller';
import { uploadSingleImage } from '../../config/multer.config';
import { parseBodyForFormData } from '../../middleware/ParseBodyForFormData';
import { validateRequest } from '../../middleware/validateRequest';
import { UpdateUserValidationSchema } from './user.validation';
import { validateFileRequest } from '../../middleware/validateUploadedFile';
import { UploadedFilesArrayZodSchema } from '../../utils/uploadedFileValidationSchema';

const router = Router();

router.get(
  '/all-users',
  auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.TEACHER),
  UserController.getAllUsersFromDB,
);

router.get(
  '/me',
  auth(...Object.values(USER_ROLE)),
  UserController.getMeFromDB,
);

router.get(
  '/single-user/:id',
  auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.TEACHER),
  UserController.getSingleUserFromDB,
);

router.patch(
  '/update-profile',
  auth(...Object.values(USER_ROLE)),
  uploadSingleImage,
  validateFileRequest(UploadedFilesArrayZodSchema),
  parseBodyForFormData,
  validateRequest(UpdateUserValidationSchema),
  UserController.updateUserProfile,
);

export const UserRoutes = router;
