import express from 'express';
import getController from '../controllers/getController';
import { checkToken, checkAdmin, checkRole } from '../middlewares';

const getRouter = express.Router();

getRouter.get(
  '/:role/users/:type/:project',
  checkToken,
  checkRole,
  getController.getAllDataFromUser
);
getRouter.get(
  '/:role/users/:type',
  checkToken,
  checkRole,
  getController.getAllDataFromUser
);
getRouter.get('/user/:userId', checkToken, getController.getUserByUserId);

export default getRouter;
