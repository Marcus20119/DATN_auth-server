import express from 'express';
import getController from '../controllers/getController';
import { checkToken, checkAdmin } from '../middlewares';

const getRouter = express.Router();

getRouter.get(
  '/:project/users/:type',
  checkToken,
  checkAdmin,
  getController.getAllDataFromUser
);
getRouter.get(
  '/users/:type',
  checkToken,
  checkAdmin,
  getController.getAllDataFromUser
);

export default getRouter;
