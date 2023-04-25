import db from '../models';

async function handleUpdateUser(role, userId, modifiedData, successfulMessage) {
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
          status: 401,
          payload: {
            message: "You can't access a user having this role",
          },
        });
      }
      await db.User.update(modifiedData, {
        where: {
          id: userId,
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

export { handleUpdateUser };
