import { getCurrentTime } from '../helpers';
import db from '../models';

/**
 *
 * @param {'Wordle' | 'Tic Tac Toe'} game
 * @returns
 */

async function handleSetGameHistoryData(game) {
  return new Promise(async (resolve, reject) => {
    try {
      const { day, month, year } = getCurrentTime();
      const currentDayData = await db.GameHistory.findOne({
        where: { year, month, day, game },
        raw: true,
      });
      if (currentDayData) {
        await db.GameHistory.update(
          { nPlay: currentDayData.nPlay + 1 },
          {
            where: {
              year,
              month,
              day,
              game,
            },
          }
        );
      } else {
        await db.GameHistory.create({ year, month, day, game, nPlay: 1 });
      }
      return resolve();
    } catch (err) {
      reject(err);
    }
  });
}

async function handleSaveWordleResult(clientData) {
  return new Promise(async (resolve, reject) => {
    try {
      // Kiểm tra xem data cos status và userId hay không
      if (!clientData.status || !clientData.userId) {
        return resolve({
          status: 422,
          payload: {
            message: 'Missing parameters',
          },
        });
      }
      // Kiểm tra xem data cos status và userId hay không
      if (clientData.status === 'win' || !clientData.currentRow) {
        return resolve({
          status: 422,
          payload: {
            message: 'Missing "currentRow" parameter',
          },
        });
      }

      const userWordleData = await db.Wordle.findOne({
        where: { userId: clientData.userId },
        raw: true,
      });

      // Nếu đã có dữ liệu chơi trước đây thì cập nhật
      if (userWordleData) {
        let { id, ...newUserWordleData } = userWordleData;
        if (clientData.status === 'lose') {
          newUserWordleData.nLose = userWordleData.nLose + 1;
        } else if (clientData.status === 'win') {
          newUserWordleData[`nWinR${clientData.currentRow}`] =
            userWordleData[`nWinR${clientData.currentRow}`] + 1;
        }
        newUserWordleData.nPlay = userWordleData.nPlay + 1;
        await db.Wordle.update(newUserWordleData, {
          where: {
            userId: clientData.userId,
          },
        });
        // Nếu là lần đầu tiên chơi thì tạo dữ liệu mới
      } else {
        let newUserWordleData = {
          userId: clientData.userId,
          nWinR1: 0,
          nWinR2: 0,
          nWinR3: 0,
          nWinR4: 0,
          nWinR5: 0,
          nWinR6: 0,
          nLose: 0,
          nPlay: 1,
        };
        if (clientData.status === 'lose') {
          newUserWordleData.nLose = 1;
        } else if (clientData.status === 'win') {
          newUserWordleData[`nWinR${clientData.currentRow}`] = 1;
        }
        await db.Wordle.create(newUserWordleData);
      }
      await handleSetGameHistoryData('Wordle');
      return resolve({
        status: 200,
        payload: {
          message: "Update user's wordle data successfully",
        },
      });
    } catch (err) {
      reject(err);
    }
  });
}
async function handleSaveTictactoeResult(clientData) {
  return new Promise(async (resolve, reject) => {
    try {
      // Kiểm tra xem data cos status và userId hay không
      if (!clientData.status || !clientData.userId) {
        return resolve({
          status: 422,
          payload: {
            message: 'Missing parameters',
          },
        });
      }
      // Kiểm tra xem data cos status và userId hay không
      if (clientData.status === 'win' || !clientData.playerMark) {
        return resolve({
          status: 422,
          payload: {
            message: 'Missing "playerMark" parameter',
          },
        });
      }

      const userTictactoeData = await db.Tictactoe.findOne({
        where: { userId: clientData.userId },
        raw: true,
      });

      // Nếu đã có dữ liệu chơi trước đây thì cập nhật
      if (userTictactoeData) {
        let { id, ...newUserTictactoeData } = userTictactoeData;
        if (clientData.status === 'lose') {
          newUserTictactoeData.nLose = userTictactoeData.nLose + 1;
        } else if (clientData.status === 'win') {
          newUserTictactoeData[`nWin${clientData.playerMark}`] =
            userTictactoeData[`nWin${clientData.playerMark}`] + 1;
        } else if (clientData.status === 'draw') {
          newUserTictactoeData.nDraw = userTictactoeData.nDraw + 1;
        }
        newUserTictactoeData.nPlay = userTictactoeData.nPlay + 1;
        await db.Tictactoe.update(newUserTictactoeData, {
          where: {
            userId: clientData.userId,
          },
        });
        // Nếu là lần đầu tiên chơi thì tạo dữ liệu mới
      } else {
        let newUserTictactoeData = {
          userId: clientData.userId,
          nWinX: 0,
          nWinO: 0,
          nLose: 0,
          nDraw: 0,
          nPlay: 1,
        };
        if (clientData.status === 'lose') {
          newUserTictactoeData.nLose = 1;
        } else if (clientData.status === 'win') {
          newUserTictactoeData[`nWin${clientData.playerMark}`] = 1;
        } else if (clientData.status === 'draw') {
          newUserTictactoeData.nDraw = 1;
        }
        await db.Tictactoe.create(newUserTictactoeData);
      }

      await handleSetGameHistoryData('Tic Tac Toe');

      return resolve({
        status: 200,
        payload: {
          message: "Update user's Tictactoe data successfully",
        },
      });
    } catch (err) {
      reject(err);
    }
  });
}

export { handleSaveWordleResult, handleSaveTictactoeResult };
