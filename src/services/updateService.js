var bcrypt = require('bcryptjs');
import { Op } from 'sequelize';
import db from '../models';

var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);

/**
 *
 * @param {number} thisUserId
 * @param {number} targetUserId
 * @param {object} modifiedData
 * @param {string} successfulMessage
 * @returns
 */

async function handleEditUser(
  thisUserId,
  targetUserId,
  modifiedData,
  successfulMessage
) {
  return new Promise(async (resolve, reject) => {
    try {
      // Kiểm tra xem có userId
      if (!targetUserId) {
        return resolve({
          status: 422,
          payload: {
            message: 'Thiếu id của người dùng',
          },
        });
      }
      const userInfo = await db.User.findOne({
        where: { id: targetUserId },
        attributes: { exclude: ['password'] },
        raw: true,
      });
      // Kiểm tra có user không
      if (!userInfo) {
        return resolve({
          status: 404,
          payload: {
            message: 'Người dùng không tồn tại',
          },
        });
      }

      // User gửi request chỉ được quyền access data của user có quyền thấp hơn mình hoặc chính mình
      if (thisUserId !== targetUserId) {
        const thisUserInfo = await db.User.findOne({
          where: { id: thisUserId },
          raw: true,
        });
        const targetUserInfo = await db.User.findOne({
          where: { id: targetUserId },
          raw: true,
        });
        if (targetUserInfo.role_id >= thisUserInfo.role_id) {
          return resolve({
            status: 401,
            payload: {
              message:
                'Bạn không thể can thiệp vào người dùng có quyền hạng này',
            },
          });
        }
      }

      if (modifiedData.email) {
        const { count } = await db.User.findAndCountAll({
          where: {
            email: modifiedData.email,
            id: {
              [Op.lt]: targetUserId,
            },
          },
        });

        if (count !== 0) {
          return resolve({
            status: 401,
            payload: {
              message: 'Email này đã được người dùng khác sử dụng',
            },
          });
        }
      }
      if (modifiedData.project_key) {
        const project = await db.User.findOne({
          where: {
            project_key: modifiedData.project_key,
          },
        });

        if (!project) {
          return resolve({
            status: 401,
            payload: {
              message: `Không tồn tại dự án có mã ${modifiedData.project_key}`,
            },
          });
        }
      }

      await db.User.update(modifiedData, {
        where: {
          id: targetUserId,
        },
      });

      return resolve({
        status: 200,
        payload: {
          message: successfulMessage,
        },
      });
    } catch (err) {
      reject(err);
    }
  });
}

async function handleEditStaff(staffId, newStaffData) {
  return new Promise(async (resolve, reject) => {
    try {
      if (!staffId) {
        return resolve({
          status: 422,
          payload: {
            message: 'Thiếu Id của nhân viên',
          },
        });
      }
      if (!newStaffData.full_name || !newStaffData.email) {
        return resolve({
          status: 422,
          payload: {
            message: 'Nhập thiếu dữ liệu',
          },
        });
      }

      await db.Staff.update(newStaffData, {
        where: {
          id: staffId,
        },
      });

      return resolve({
        status: 200,
        payload: {
          message: 'Chỉnh sửa nhân viên thành công',
        },
      });
    } catch (err) {
      reject(err);
    }
  });
}

/**
 *
 * @param {number} userId
 * @param {string} new_password
 * @returns
 */

async function handleAdvancedChangePassword(userId, new_password) {
  return new Promise(async (resolve, reject) => {
    try {
      // Kiểm tra xem có userId không
      if (!userId) {
        return resolve({
          status: 422,
          payload: {
            message: 'Thiếu id của người dùng',
          },
        });
      }
      const userInfo = await db.User.findOne({
        where: { id: userId },
        raw: true,
      });
      // Kiểm tra có user không
      if (!userInfo) {
        return resolve({
          status: 404,
          payload: {
            message: 'Người dùng không tồn tại',
          },
        });
      }

      // Kiểm tra có nhập new_password và new_password này có hợp lệ không
      if (!new_password) {
        return resolve({
          status: 422,
          payload: {
            message: 'Nhập thiếu dữ liệu',
          },
        });
      }
      if (new_password.length !== 8) {
        return resolve({
          status: 422,
          payload: {
            message: 'mật khẩu phải có đúng 8 ký tự',
          },
        });
      }

      await db.User.update(
        { password: bcrypt.hashSync(new_password, salt) },
        {
          where: {
            id: userId,
          },
        }
      );

      return resolve({
        status: 200,
        payload: {
          message: 'Đổi mật khẩu thành công !',
        },
      });
    } catch (err) {
      reject(err);
    }
  });
}

/**
 *
 * @param {number} userId
 * @param {string} old_password
 * @param {string} new_password
 * @returns
 */

async function handleSelfChangePassword(userId, old_password, new_password) {
  return new Promise(async (resolve, reject) => {
    try {
      // Kiểm tra xem có userId không
      if (!userId) {
        return resolve({
          status: 422,
          payload: {
            message: 'Thiếu id của người dùng',
          },
        });
      }
      const userInfo = await db.User.findOne({
        where: { id: userId },
        raw: true,
      });
      // Kiểm tra có user không
      if (!userInfo) {
        return resolve({
          status: 404,
          payload: {
            message: 'Người dùng không tồn tại',
          },
        });
      }

      // Kiểm tra có nhập new_password và new_password này có hợp lệ không
      if (!old_password || !new_password) {
        return resolve({
          status: 422,
          payload: {
            message: 'Nhập thiếu dữ liệu',
          },
        });
      }

      // Kiểm tra có nhập đúng mật khẩu cũ không
      const isPasswordCorrect = bcrypt.compareSync(
        old_password,
        userInfo.password
      );
      if (!isPasswordCorrect) {
        return resolve({
          status: 400,
          payload: {
            message: 'Nhập sai mật khẩu cũ',
          },
        });
      }

      if (old_password === new_password) {
        return resolve({
          status: 400,
          payload: {
            message: 'Mật khẩu mới phải khác mật khẩu cũ',
          },
        });
      }

      if (new_password.length !== 8) {
        return resolve({
          status: 422,
          payload: {
            message: 'Mật khẩu mới phải có đúng 8 ký tự',
          },
        });
      }

      await db.User.update(
        { password: bcrypt.hashSync(new_password, salt) },
        {
          where: {
            id: userId,
          },
        }
      );

      return resolve({
        status: 200,
        payload: {
          message: 'Đổi mật khẩu thành công !',
        },
      });
    } catch (err) {
      reject(err);
    }
  });
}

export {
  handleEditUser,
  handleEditStaff,
  handleAdvancedChangePassword,
  handleSelfChangePassword,
};
