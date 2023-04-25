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
  const offset = query?.page ? (query.page - 1) * 10 : 0;
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
 * @param {'User' | 'Wordle' | 'Tictactoe'} modelName
 * @param {number} id
 * @returns
 */
async function getDataByUserId(modelName, thisUserId, targetUserId) {
  return new Promise(async (resolve, reject) => {
    try {
      if (!modelName) {
        reject('missing modelName');
      }
      // User gửi request chỉ được quyền access data của user có quyền thấp hơn mình hoặc chính mình
      if (Number.parseInt(thisUserId) !== Number.parseInt(targetUserId)) {
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
              message: "You can't access a user having this role",
            },
          });
        }
      }
      let data;
      if (modelName === 'User') {
        data = await db[modelName].findOne({
          where: { id: targetUserId },
          attributes: { exclude: ['password'] },
          raw: true,
        });
      } else {
        data = await db[modelName].findOne({
          where: { user_id: targetUserId },
          raw: true,
        });
      }

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

export { getAllDataFromUser, getDataByUserId };
