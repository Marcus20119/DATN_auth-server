import db from '../models';

async function softDeleteUser(role, userId) {
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
      }
      if (userInfo.role_id >= role) {
        return resolve({
          status: 403,
          payload: {
            message: "You can't delete a user having this role",
          },
        });
      }
      await db.User.update(
        { is_deleted: true },
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
          { is_deleted: false },
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
async function handleUpdateUser(clientData, userId) {
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
      }
      await db.User.update(clientData, {
        where: {
          id: userId,
        },
      });

      return resolve({
        status: 200,
        payload: {
          message: 'Update user data successfully',
        },
      });
    } catch (err) {
      reject(err);
    }
  });
}

export { softDeleteUser, restoreUser, handleUpdateUser };
