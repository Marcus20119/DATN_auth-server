// import { Op } from 'sequelize';
// import { getCurrentTime } from '../helpers';
import { Op } from 'sequelize';
import { getCurrentTime } from '../helpers/getCurrentTime';
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

/**
 *
 * @param {number} id
 * @returns
 */

async function getProjectById(id) {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        return resolve({
          status: 422,
          payload: {
            message: 'Missing project id',
          },
        });
      }
      const data = await db.Project.findOne({
        where: { id },
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
      const staffs_data = await db.Staff.findAll({
        where: {
          id: {
            [Op.in]: data.staff_ids,
          },
        },
        attributes: ['full_name', 'id'],
        raw: true,
      });
      const users_data = await db.User.findAll({
        where: {
          id: {
            [Op.in]: data.user_ids,
          },
        },
        attributes: ['user_name', 'id', 'role_id'],
        raw: true,
      });
      return resolve({
        status: 200,
        payload: {
          message: `Get data successfully`,
          data: { ...data, staffs_data, users_data },
        },
      });
    } catch (err) {
      reject(err);
    }
  });
}

/**
 *
 * @param {number} project_id
 * @param {{orderField: string; orderType: 'DESC' | 'ASC', page: number}} query
 * @returns
 */

async function getAllDataFromError(project_id, query) {
  const limit = 20;
  const offset = query?.page ? (Number.parseInt(query.page) - 1) * limit : 0;
  const where = {
    project_id,
  };
  return new Promise(async (resolve, reject) => {
    try {
      if (!project_id) {
        return resolve({
          status: 422,
          payload: {
            message: 'Missing project_id',
          },
        });
      }

      const data = await db.Error.findAll({
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

      const { count: countRow } = await db.Error.findAndCountAll({
        where,
      });

      return resolve({
        status: 200,
        payload: {
          message: `Get page ${
            query?.page ? query.page : 1
          } data from Error successfully`,
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

async function getAllDataFromStaff() {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await db.Staff.findAll({
        order: [['id', 'ASC']],
        raw: true,
      });

      return resolve({
        status: 200,
        payload: {
          message: `Get data from Staff successfully`,
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
 * @param {number} projectId
 * @returns
 */

async function getExportErrorData(project_id) {
  return new Promise(async (resolve, reject) => {
    try {
      if (!project_id) {
        return resolve({
          status: 422,
          payload: {
            message: 'Missing project_id',
          },
        });
      }
      const errorData = await db.Error.findAll({
        where: { project_id },
        order: [['created_at', 'DESC']],
        attributes: ['id', 'error_message', 'created_at'],
        raw: true,
      });
      return resolve({
        status: 200,
        payload: {
          message: `Get export data successfully`,
          data: errorData,
        },
      });
    } catch (err) {
      reject(err);
    }
  });
}

async function getLineChart() {
  return new Promise(async (resolve, reject) => {
    try {
      let { day, month, year } = getCurrentTime();
      day = Number(day);
      month = Number(month);
      year = Number(year);

      const projectData = await db.Project.findAll({
        raw: true,
        order: [['user_count', 'DESC']],
        limit: 5,
        attributes: ['id', 'project_key'],
      });

      const projectIds = projectData.map(item => item.id);
      let resData = projectIds.map(projectId => ({
        id: projectId,
        data: [],
      }));

      let whereDays = [];
      for (let i = 0; i < 7; i++) {
        if (day > 1) {
          whereDays.push({
            day: String(day).padStart(2, '0'),
            month: String(month).padStart(2, '0'),
            year: String(year).padStart(2, '0'),
          });
          day--;
          // Điều kiện năm nhuận, đầu tháng 3
        } else if (month === 3 && year % 4 === 0 && year % 100 !== 0) {
          whereDays.push({
            day: String(day).padStart(2, '0'),
            month: String(month).padStart(2, '0'),
            year: String(year).padStart(2, '0'),
          });
          day = 29;
          month = 2;
          // Điều kiện năm không nhuận, đầu tháng 3
        } else if (month === 3) {
          whereDays.push({
            day: String(day).padStart(2, '0'),
            month: String(month).padStart(2, '0'),
            year: String(year).padStart(2, '0'),
          });
          day = 28;
          month = 2;
          // Điều kiện đầu các tháng có 30 ngày
        } else if ([2, 4, 6, 9, 11].includes(month)) {
          whereDays.push({
            day: String(day).padStart(2, '0'),
            month: String(month).padStart(2, '0'),
            year: String(year).padStart(2, '0'),
          });
          day = 31;
          month--;
          // Điều kiện đầu các tháng có 31 ngày
        } else if ([5, 7, 8, 10, 12].includes(month)) {
          whereDays.push({
            day: String(day).padStart(2, '0'),
            month: String(month).padStart(2, '0'),
            year: String(year).padStart(2, '0'),
          });
          day = 30;
          month--;
          // Điều kiện đầu tháng 1
        } else {
          whereDays.push({
            day: String(day).padStart(2, '0'),
            month: String(month).padStart(2, '0'),
            year: String(year).padStart(2, '0'),
          });
          day = 31;
          month = 12;
          year--;
        }
      }

      for await (const [index, projectId] of projectIds.entries()) {
        for await (const whereDay of whereDays) {
          const dayData = await db.AccessHistory.findOne({
            where: { ...whereDay, project_id: projectId },
            order: [['day', 'DESC']],
            attributes: ['n'],
            raw: true,
          });
          if (dayData) {
            resData[index].data.push({
              x: `${whereDay.day}/${whereDay.month}`,
              y: dayData.n,
            });
          } else {
            resData[index].data.push({
              x: `${whereDay.day}/${whereDay.month}`,
              y: 0,
            });
          }
        }
        resData[index].data.reverse();
      }

      resData = await resData.map(item => ({
        ...item,
        id: projectData.find(project => project.id === item.id).project_key,
      }));
      return resolve({
        status: 200,
        payload: {
          message: 'Get user line chart data successfully',
          data: resData,
        },
      });
    } catch (err) {
      reject(err);
    }
  });
}

async function getPipeChart() {
  return new Promise(async (resolve, reject) => {
    try {
      const projectData = await db.Project.findAll({
        raw: true,
        order: [['user_count', 'DESC']],
        limit: 5,
        attributes: ['project_key', 'user_count'],
      });
      const resData = projectData.map(item => ({
        label: item.project_key,
        value: item.user_count,
      }));
      return resolve({
        status: 200,
        payload: {
          message: 'Get user pipe chart data successfully',
          data: resData,
        },
      });
    } catch (err) {
      reject(err);
    }
  });
}

async function getBarChart() {
  return new Promise(async (resolve, reject) => {
    try {
      const staffs = await db.Staff.findAll({
        order: [['id', 'ASC']],
        raw: true,
        attributes: ['id', 'full_name'],
      });
      let resData = [];

      // await staffs.map(async item => {
      //
      // });
      for await (const [, item] of staffs.entries()) {
        const { count } = await db.Project.findAndCountAll({
          where: {
            staff_ids: {
              [Op.contains]: [item.id],
            },
          },
        });
        resData.push({
          'Nhân viên': item.full_name,
          'Số dự án': count,
        });
      }
      return resolve({
        status: 200,
        payload: {
          message: 'Get user bar chart data successfully',
          data: resData,
        },
      });
    } catch (err) {
      reject(err);
    }
  });
}

export {
  getAllDataFromUser,
  getDataById,
  getAllData,
  getProjectById,
  getAllDataFromError,
  getAllDataFromStaff,
  getExportErrorData,
  getLineChart,
  getPipeChart,
  getBarChart,
};
