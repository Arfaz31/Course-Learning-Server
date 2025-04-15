import { Router } from 'express';
import { AuthRoutes } from '../module/Auth/auth.route';
import { UserRoutes } from '../module/User/user.route';
import { CourseRoutes } from '../module/Course/course.route';
import { LessonRoutes } from '../module/Lesson/lesson.route';
import { TopicRoutes } from '../module/Topic/topic.route';
import { EnrollmentRoutes } from '../module/Enrollment/enrollment.route';

const middleWareRouter = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/course',
    route: CourseRoutes,
  },
  {
    path: '/lesson',
    route: LessonRoutes,
  },
  {
    path: '/topic',
    route: TopicRoutes,
  },
  {
    path: '/enrollment',
    route: EnrollmentRoutes,
  },
];

moduleRoutes.forEach((route) => middleWareRouter.use(route.path, route.route));

export const MiddlewareRoutes = middleWareRouter;
