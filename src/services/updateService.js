import db from '../models';

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

export { handleUpdateUser };
