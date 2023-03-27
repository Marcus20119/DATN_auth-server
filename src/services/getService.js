import { Op } from 'sequelize';
import { getCurrentTime } from '../helpers';
import db from '../models';

/**
 *
 * @param {'User' | 'Wordle' | 'Tictactoe'} modelName
 * @returns
 */
async function getAllData(modelName, query, type) {
  const offset = query?.page ? (query.page - 1) * 10 : 0;
  const limit = 10;
  return new Promise(async (resolve, reject) => {
    try {
      if (!modelName) {
        reject('missing modelName');
      }
      const data = await db[modelName].findAll({
        offset,
        limit,
        where: { isDeleted: type === 'deleted' ? true : false }, // Postgres thì true/false còn mySQL thì 1/0
        order: [
          [
            query?.orderField ? query.orderField : 'id',
            query?.orderType ? query.orderType : 'DESC',
          ],
        ],
        raw: true,
      });
      const { count: countRow } = await db[modelName].findAndCountAll({
        where: { isDeleted: type === 'deleted' ? true : false }, // Postgres thì true/false còn mySQL thì 1/0
      });
      return resolve({
        status: 200,
        payload: {
          message: `Get page ${
            query?.page ? query.page : 1
          } data from ${modelName} successfully`,
          data,
          totalPages:
            countRow % limit === 0
              ? Math.floor(countRow / limit)
              : Math.floor(countRow / limit + 1),
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
async function getDataByUserId(modelName, userId) {
  return new Promise(async (resolve, reject) => {
    try {
      if (!modelName) {
        reject('missing modelName');
      }
      let data;
      if (modelName === 'User') {
        data = await db[modelName].findOne({
          where: { id: userId },
          raw: true,
        });
      } else {
        data = await db[modelName].findOne({ where: { userId }, raw: true });
      }
      if (data) {
      }
      if (!data) {
        return resolve({
          status: 404,
          payload: {
            message: 'Data not found',
          },
        });
      }
      const { password, ...resData } = data;
      return resolve({
        status: 200,
        payload: {
          message: `Get data successfully`,
          data: resData,
        },
      });
    } catch (err) {
      reject(err);
    }
  });
}

async function getChartPipeData() {
  return new Promise(async (resolve, reject) => {
    try {
      const { count: wordleCount } = await db.User.findAndCountAll({
        where: {
          '$Wordle.userId$': {
            [Op.ne]: null,
          },
          '$Tictactoe.userId$': null,
        },
        attributes: { exclude: ['password'] },
        include: [
          {
            model: db.Tictactoe,
            required: false,
            as: 'Tictactoe',
            attributes: [],
          },
          {
            model: db.Wordle,
            required: false,
            as: 'Wordle',
            attributes: [],
          },
        ],
        raw: true,
      });

      const { count: tictactoeCount } = await db.User.findAndCountAll({
        where: {
          '$Tictactoe.userId$': {
            [Op.ne]: null,
          },
          '$Wordle.userId$': null,
        },
        attributes: { exclude: ['password'] },
        include: [
          {
            model: db.Tictactoe,
            required: false,
            as: 'Tictactoe',
            attributes: [],
          },
          {
            model: db.Wordle,
            required: false,
            as: 'Wordle',
            attributes: [],
          },
        ],
        raw: true,
      });

      const { count: bothCount } = await db.User.findAndCountAll({
        where: {
          '$Tictactoe.userId$': {
            [Op.ne]: null,
          },
          '$Wordle.userId$': {
            [Op.ne]: null,
          },
        },
        attributes: { exclude: ['password'] },
        include: [
          {
            model: db.Tictactoe,
            required: false,
            as: 'Tictactoe',
            attributes: [],
          },
          {
            model: db.Wordle,
            required: false,
            as: 'Wordle',
            attributes: [],
          },
        ],
        raw: true,
      });

      const userCount = await db.User.count();

      const pipeData = [
        {
          label: 'Wordle',
          value: wordleCount,
        },
        {
          label: 'Tic Tac Toe',
          value: tictactoeCount,
        },
        {
          label: 'All games',
          value: bothCount,
        },
        {
          label: 'None',
          value: userCount - (wordleCount + tictactoeCount) - bothCount,
        },
      ];

      return resolve({
        status: 200,
        payload: {
          message: `Get data successfully`,
          data: pipeData,
        },
      });
    } catch (err) {
      reject(err);
    }
  });
}

async function getChartGridData(type) {
  return new Promise(async (resolve, reject) => {
    try {
      const currentTime = getCurrentTime();
      const games = ['Wordle', 'Tic Tac Toe'];
      let resData = games.map(game => ({ id: game, data: [] }));
      switch (type) {
        case 'day': {
          let whereDays = [];
          let { day, month, year } = { ...currentTime };
          for (let i = 0; i < 7; i++) {
            if (day > 1) {
              whereDays.push({ day, month, year });
              day--;
              // Điều kiện năm nhuận, đầu tháng 3
            } else if (month === 3 && year % 4 === 0 && year % 100 !== 0) {
              whereDays.push({ day, month, year });
              day = 29;
              month = 2;
              // Điều kiện năm không nhuận, đầu tháng 3
            } else if (month === 3) {
              whereDays.push({ day, month, year });
              day = 28;
              month = 2;
              // Điều kiện đầu các tháng có 30 ngày
            } else if ([2, 4, 6, 9, 11].includes(month)) {
              whereDays.push({ day, month, year });
              day = 31;
              month--;
              // Điều kiện đầu các tháng có 31 ngày
            } else if ([5, 7, 8, 10, 12].includes(month)) {
              whereDays.push({ day, month, year });
              day = 30;
              month--;
              // Điều kiện đầu tháng 1
            } else {
              whereDays.push({ day, month, year });
              day = 31;
              month = 12;
              year--;
            }
          }

          for await (const [index, game] of games.entries()) {
            for await (const whereDay of whereDays) {
              const dayData = await db.GameHistory.findOne({
                where: { ...whereDay, game },
                order: [['day', 'DESC']],
                attributes: ['nPlay'],
                raw: true,
              });
              if (dayData) {
                resData[index].data.push({
                  x: `${whereDay.day < 10 ? '0' : ''}${whereDay.day}/${
                    whereDay.month < 10 ? '0' : ''
                  }${whereDay.month}`,
                  y: dayData.nPlay,
                });
              } else {
                resData[index].data.push({
                  x: `${whereDay.day < 10 ? '0' : ''}${whereDay.day}/${
                    whereDay.month < 10 ? '0' : ''
                  }${whereDay.month}`,
                  y: 0,
                });
              }
            }
            resData[index].data.reverse();
          }
          return resolve({
            status: 200,
            payload: {
              message: 'Get day chart data successfully',
              data: resData,
            },
          });
        }
        default: {
          return resolve({
            status: 422,
            payload: {
              message: 'Missing type chart parameters',
            },
          });
        }
      }
    } catch (err) {
      reject(err);
    }
  });
}

export { getAllData, getDataByUserId, getChartPipeData, getChartGridData };
