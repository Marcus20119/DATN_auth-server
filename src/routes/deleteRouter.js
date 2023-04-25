import express from 'express';
import deleteController from '../controllers/deleteController';
import { checkRole, checkToken } from '../middlewares';

const deleteRouter = express.Router();

deleteRouter.delete(
  '/:role/user/hard-delete/:userId',
  checkToken,
  checkRole,
  deleteController.hardDeleteUser
);

export default deleteRouter;
