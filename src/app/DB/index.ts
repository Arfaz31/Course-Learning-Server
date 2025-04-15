import { config } from '../config';
import { USER_ROLE } from '../module/User/user.constant';
import { User } from '../module/User/user.model';

const superAdminData = {
  name: config.SUPERADMIN.NAME,
  email: config.SUPERADMIN.EMAIL,
  password: config.SUPERADMIN.PASSWORD,
  role: config.SUPERADMIN.ROLE,
  isDeleted: config.SUPERADMIN.IS_DELETED,
};

export const seedingSuperAdmin = async () => {
  try {
    const isSuperAtcAdminExits = await User.findOne({
      role: USER_ROLE.SUPER_ADMIN,
    });

    if (!isSuperAtcAdminExits) {
      await User.create(superAdminData);
      console.log('Super admin is sedding in database successfully');
    } else {
      console.log('Super admin already exists. Skipping creation.');
    }
  } catch (error) {
    console.error('Error seeding super admin:', error);
  }
};
