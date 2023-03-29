import db from '../models';

async function softDeleteUser(userId) {
  return new Promise(async (resolve, reject) => {
    try {
      // Kiểm tra xem có nhập email và password không
      if (!userId) {
        return resolve({
          status: 422,
          payload: {
            message: 'Missing userId',
          },
        });
      }
      const userInfo = await db.User.findOne({
        where: { id: userId },
        raw: true,
      });
      // Kiểm tra có user không (Có nhập đúng email không)
      if (!userInfo) {
        return resolve({
          status: 404,
          payload: {
            message: 'User is not exist',
          },
        });
      } else {
        await db.User.update(
          { isDeleted: true },
          {
            where: {
              id: userId,
            },
          }
        );
        return resolve({
          status: 200,
          payload: {
            message: 'Delete User successfully',
          },
        });
      }
    } catch (err) {
      reject(err);
    }
  });
}
async function hardDeleteUser(userId) {
  return new Promise(async (resolve, reject) => {
    try {
      // Kiểm tra xem có nhập email và password không
      if (!userId) {
        return resolve({
          status: 422,
          payload: {
            message: 'Missing userId',
          },
        });
      }
      const userInfo = await db.User.findOne({
        where: { id: userId },
        raw: true,
      });
      // Kiểm tra có user không (Có nhập đúng email không)
      if (!userInfo) {
        return resolve({
          status: 404,
          payload: {
            message: 'User is not exist',
          },
        });
      } else {
        await db.User.destroy({
          where: {
            id: userId,
          },
        });
        return resolve({
          status: 200,
          payload: {
            message: 'Delete permanently User successfully',
          },
        });
      }
    } catch (err) {
      reject(err);
    }
  });
}
async function restoreUser(userId) {
  return new Promise(async (resolve, reject) => {
    try {
      // Kiểm tra xem có nhập email và password không
      if (!userId) {
        return resolve({
          status: 422,
          payload: {
            message: 'Missing userId',
          },
        });
      }
      const userInfo = await db.User.findOne({
        where: { id: userId },
        raw: true,
      });
      // Kiểm tra có user không (Có nhập đúng email không)
      if (!userInfo) {
        return resolve({
          status: 404,
          payload: {
            message: 'User is not exist',
          },
        });
      } else {
        await db.User.update(
          { isDeleted: false },
          {
            where: {
              id: userId,
            },
          }
        );
        return resolve({
          status: 200,
          payload: {
            message: 'Restore User successfully',
          },
        });
      }
    } catch (err) {
      reject(err);
    }
  });
}
export { softDeleteUser, hardDeleteUser, restoreUser };
