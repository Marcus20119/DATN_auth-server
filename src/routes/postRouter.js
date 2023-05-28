import express from 'express';
import postController from '../controllers/postController';
import { checkAdmin, checkManager, checkToken } from '../middlewares';

const postRouter = express.Router();

postRouter.post(
  '/add-new-user',
  checkToken,
  checkManager,
  postController.addNewUser
);
postRouter.post(
  '/add-new-staff',
  checkToken,
  checkAdmin,
  postController.addNewStaff
);
postRouter.post('/add-new-error', postController.addNewError);

export default postRouter;
