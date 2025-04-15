export const USER_ROLE = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  TEACHER: 'TEACHER',
  STUDENT: 'STUDENT',
} as const;

export const userSearchableFields = ['name', 'email', 'role'];
