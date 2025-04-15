import { Router } from 'express';
import auth from '../../middleware/auth';
import { validateRequest } from '../../middleware/validateRequest';
import { USER_ROLE } from '../User/user.constant';
import { TopicController } from './topic.controller';
import {
  CreateTopicValidationSchema,
  UpdateTopicValidationSchema,
} from './topic.validation';

const router = Router();

// Create a new topic (only teacher)
router.post(
  '/create-topic',
  auth(USER_ROLE.TEACHER),
  validateRequest(CreateTopicValidationSchema),
  TopicController.createTopic,
);

router.get(
  '/',
  auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.TEACHER, USER_ROLE.STUDENT),
  TopicController.getAllTopics,
);

// Get all topics for a specific lesson (public)
router.get('/specific-lesson/:lessonId', TopicController.getTopicsByLesson);

// Get a single topic (public)
router.get('/:id', TopicController.getSingleTopic);

// Update a topic (only teacher who owns the associated course)
router.patch(
  '/:id',
  auth(USER_ROLE.TEACHER),
  validateRequest(UpdateTopicValidationSchema),
  TopicController.updateTopic,
);

// Delete a topic (only teacher who owns the associated course)
router.delete('/:id', auth(USER_ROLE.TEACHER), TopicController.deleteTopic);

export const TopicRoutes = router;
