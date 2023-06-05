var bcrypt = require('bcryptjs');
import { getCurrentTime, isEmailValid } from '../helpers';
import db from '../models';

var salt = bcrypt.genSaltSync(10);

async function handleAddNewUser(thisUserRoleId, newUserData) {
  return new Promise(async (resolve, reject) => {
    try {
      // Kiểm tra xem có nhập email password, user_name và project_key không
      if (
        !newUserData.email ||
        !newUserData.password ||
        !newUserData.user_name ||
        !newUserData.project_key ||
        ![0, 1, 2, 3].includes(newUserData.role_id)
      ) {
        return resolve({
          status: 422,
          payload: {
            message: 'Nhập thiếu dữ liệu',
          },
        });
      }
      if (thisUserRoleId === 2 && newUserData.role_id > 2) {
        return resolve({
          status: 401,
          payload: {
            message: 'Bạn không có quyền tạo người dùng có quyền này',
          },
        });
      }
      // Check validate Email
      if (!isEmailValid(newUserData.email)) {
        return resolve({
          status: 422,
          payload: {
            message: 'Email không hợp lệ',
          },
        });
      }
      // Check validate password (Phải đúng 8 ký tự)
      if (newUserData.password.length !== 8) {
        return resolve({
          status: 422,
          payload: {
            message: 'mật khẩu phải có đúng 8 ký tự',
          },
        });
      }

      const isAlreadyExist = await db.User.findOne({
        where: { email: newUserData.email },
        attributes: { exclude: ['password'] },
        raw: true,
      });
      // Kiểm tra xem đã tồn tại User này chưa
      if (isAlreadyExist) {
        return resolve({
          status: 409,
          payload: {
            message: 'Tài khoản đã tồn tại',
          },
        });
      }

      const projectData = await db.Project.findOne({
        where: { project_key: newUserData.project_key },
        raw: true,
      });

      if (!projectData) {
        return resolve({
          status: 404,
          payload: {
            message: 'Không tồn tại dự án',
          },
        });
      }

      // Không có lỗi thì tạo user mới và lưu vào database
      const newUser = await db.User.build({
        ...newUserData,
        password: bcrypt.hashSync(newUserData.password, salt),
        is_deleted: false,
        is_activated: false,
        project_id: projectData.id,
        project_key: projectData.project_key,
      });
      await newUser.save();

      return resolve({
        status: 200,
        payload: {
          message: 'Đăng ký thành công',
        },
      });
    } catch (err) {
      reject(err);
    }
  });
}

async function handleAddNewStaff(newStaffData) {
  return new Promise(async (resolve, reject) => {
    try {
      if (!newStaffData.full_name || !newStaffData.email) {
        return resolve({
          status: 422,
          payload: {
            message: 'Nhập thiếu dữ liệu',
          },
        });
      }

      const isAlreadyExist = await db.Staff.findOne({
        where: { email: newStaffData.email },
        raw: true,
      });
      // Kiểm tra xem đã tồn tại User này chưa
      if (isAlreadyExist) {
        return resolve({
          status: 409,
          payload: {
            message: 'Nhân viên đã tồn tại',
          },
        });
      }
      const newStaff = await db.Staff.build({
        ...newStaffData,
        is_deleted: false,
      });
      await newStaff.save();

      return resolve({
        status: 200,
        payload: {
          message: 'Tạo nhân viên mới thành công',
        },
      });
    } catch (err) {
      reject(err);
    }
  });
}

async function handleAddNewError(newErrorData) {
  return new Promise(async (resolve, reject) => {
    try {
      if (!newErrorData.project_id || !newErrorData.error_message) {
        return resolve({
          status: 422,
          payload: {
            message: 'Nhập thiếu dữ liệu',
          },
        });
      }

      const newError = await db.Error.build(newErrorData);
      await newError.save();

      return resolve({
        status: 200,
        payload: {
          message: 'Thêm lỗi mới thành công',
        },
      });
    } catch (err) {
      reject(err);
    }
  });
}

async function handleAddNewProject(newProjectData) {
  return new Promise(async (resolve, reject) => {
    try {
      if (!newProjectData.name || !newProjectData.project_key) {
        return resolve({
          status: 422,
          payload: {
            message: 'Nhập thiếu dữ liệu',
          },
        });
      }

      const newProject = await db.Project.build(newProjectData);
      await newProject.save();

      return resolve({
        status: 200,
        payload: {
          message: 'Thêm dự án mới thành công',
        },
      });
    } catch (err) {
      reject(err);
    }
  });
}

export {
  handleAddNewUser,
  handleAddNewStaff,
  handleAddNewError,
  handleAddNewProject,
};
