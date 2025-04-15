import { Router } from 'express';

import { LikeController } from './like.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../User/user.constant';

const router = Router();

router.patch('/:courseId', auth(USER_ROLE.STUDENT), LikeController.likeCourse);
router.patch(
  '/unlike/:courseId',
  auth(USER_ROLE.STUDENT),
  LikeController.unLikeCourse,
);

export const LikeRoutes = router;
