import db from '../models';

async function hardDeleteUser(role, userId) {
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
      const projectData = await db.Project.findOne({
        where: {
          project_key: userInfo.project_key,
        },
        raw: true,
      });
      const newUserIds = projectData.user_ids.filter(id => id !== userInfo.id);
      await db.Project.update(
        {
          user_count: projectData.user_count - 1,
          user_ids: newUserIds,
        },
        {
          where: {
            project_key: userInfo.project_key,
          },
        }
      );
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
    } catch (err) {
      reject(err);
    }
  });
}
export { hardDeleteUser };
