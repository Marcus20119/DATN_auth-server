// import { Op } from 'sequelize';
// import { getCurrentTime } from '../helpers';
import { Op } from 'sequelize';
import db from '../models';

/**
 * @param {'0' | '1' | '2' | '3'} role
 * @param {{orderField: string; orderType: 'DESC' | 'ASC', page: number}} query
 * @param {'Activated User' | 'Deactivated User' | 'Deleted User'} type
 * @param {string} project
 * @returns
 */
async function getAllDataFromUser(role, query, type, project) {
  const offset = query?.page ? (Number.parseInt(query.page) - 1) * 10 : 0;
  const limit = 10;
  let where = {};
  switch (role) {
    case '2': {
      where = {
        ...where,
        role_id: {
          [Op.lt]: 2,
        },
      };
      break;
    }
    case '3': {
      where = {
        ...where,
        role_id: {
          [Op.lt]: 3,
        },
      };
      break;
    }
    default:
      break;
  }
  switch (type) {
    case 'Activated User': {
      where = {
        ...where,
        is_activated: true,
        is_deleted: false,
      };
      break;
    }
    case 'Deactivated User': {
      where = {
        ...where,
        is_activated: false,
        is_deleted: false,
      };
      break;
    }
    case 'Deleted User': {
      where = {
        ...where,
        is_deleted: true,
      };
      break;
    }
    default:
      break;
  }
  if (project) {
    where = {
      ...where,
      project_key: project,
    };
  }
  return new Promise(async (resolve, reject) => {
    try {
      const data = await db.User.findAll({
        offset,
        limit,
        where,
        order: [
          [
            query?.orderField ? query.orderField : 'id',
            query?.orderType ? query.orderType : 'DESC',
          ],
        ],
        attributes: { exclude: ['password'] },
        raw: true,
      });
      const { count: countRow } = await db.User.findAndCountAll({
        where,
      });
      return resolve({
        status: 200,
        payload: {
          message: `Get page ${
            query?.page ? query.page : 1
          } data from User successfully`,
          totalPages:
            countRow % limit === 0
              ? Math.floor(countRow / limit)
              : Math.floor(countRow / limit + 1),
          data,
        },
      });
    } catch (err) {
      reject(err);
    }
  });
}

/**
 *
 * @param {string} modelName
 * @param {{orderField: string; orderType: 'DESC' | 'ASC', page: number}} query
 * @param {'Active Staff' | 'Deleted Staff' | 'Active Project' | 'Finished Project'} type
 * @returns
 */
async function getAllData(modelName, query, type) {
  const offset = query?.page ? (Number.parseInt(query.page) - 1) * 10 : 0;
  const limit = 10;
  let where = {};
  switch (type) {
    case 'Active Staff': {
      where = {
        ...where,
        is_deleted: false,
      };
      break;
    }
    case 'Deleted Staff': {
      where = {
        ...where,
        is_deleted: true,
      };
      break;
    }
    case 'Active Project': {
      where = {
        ...where,
        status: 0,
      };
      break;
    }
    case 'Finished Project': {
      where = {
        ...where,
        status: 1,
      };
      break;
    }
    default:
      return resolve({
        status: 422,
        payload: {
          message: 'Missing type',
        },
      });
  }
  return new Promise(async (resolve, reject) => {
    try {
      if (!modelName) {
        return resolve({
          status: 422,
          payload: {
            message: 'Missing modelName',
          },
        });
      }
      const data = await db[modelName].findAll({
        offset,
        limit,
        where,
        order: [
          [
            query?.orderField ? query.orderField : 'id',
            query?.orderType ? query.orderType : 'DESC',
          ],
        ],
        raw: true,
      });
      const { count: countRow } = await db[modelName].findAndCountAll({
        where,
      });
      return resolve({
        status: 200,
        payload: {
          message: `Get page ${
            query?.page ? query.page : 1
          } data from ${modelName} successfully`,
          totalPages:
            countRow % limit === 0
              ? Math.floor(countRow / limit)
              : Math.floor(countRow / limit + 1),
          data,
        },
      });
    } catch (err) {
      reject(err);
    }
  });
}

/**
 *
 * @param {'User' | 'Staff'} modelName
 * @param {number} id
 * @returns
 */
async function getDataById(modelName, userId, targetId) {
  return new Promise(async (resolve, reject) => {
    try {
      if (!modelName) {
        return resolve({
          status: 422,
          payload: {
            message: 'Missing modelName',
          },
        });
      }

      // User gửi request chỉ được quyền access data của user có quyền thấp hơn mình hoặc chính mình
      if (modelName === 'User') {
        if (Number.parseInt(userId) !== Number.parseInt(targetId)) {
          const thisUserInfo = await db.User.findOne({
            where: { id: userId },
            raw: true,
          });
          const targetUserInfo = await db.User.findOne({
            where: { id: targetId },
            raw: true,
          });
          if (targetUserInfo.role_id >= thisUserInfo.role_id) {
            return resolve({
              status: 401,
              payload: {
                message: "You can't access a user having this role",
              },
            });
          }
        }
      }
      const data = await db[modelName].findOne({
        where: { id: targetId },
        attributes: { exclude: ['password'] },
        raw: true,
      });

      if (!data) {
        return resolve({
          status: 404,
          payload: {
            message: 'Data not found',
          },
        });
      }
      return resolve({
        status: 200,
        payload: {
          message: `Get data successfully`,
          data: data,
        },
      });
    } catch (err) {
      reject(err);
    }
  });
}

export { getAllDataFromUser, getDataById, getAllData };
