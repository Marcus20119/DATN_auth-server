import express from 'express';
import getController from '../controllers/getController';
import { checkToken, checkAdmin } from '../middlewares';

const getRouter = express.Router();

// getRouter.get(
//   '/wordle/:userId',
//   checkToken,
//   checkPlayer,
//   getController.getWordleByUserId
// );
// getRouter.get(
//   '/wordle',
//   checkToken,
//   checkPlayer,
//   getController.getAllDataFromWordle
// );
// getRouter.get(
//   '/tictactoe/:userId',
//   checkToken,
//   checkPlayer,
//   getController.getTictactoeByUserId
// );
getRouter.get(
  '/users/:type',
  checkToken,
  checkAdmin,
  getController.getAllDataFromUsers
);
// getRouter.get(
//   '/user/:userId',
//   checkToken,
//   checkAdmin,
//   getController.getUserByUserId
// );
// getRouter.get(
//   '/chart/pipe',
//   checkToken,
//   checkAdmin,
//   getController.getChartPipeData
// );
// getRouter.get(
//   '/chart/grid/:type',
//   checkToken,
//   checkAdmin,
//   getController.getChartGridData
// );

export default getRouter;
