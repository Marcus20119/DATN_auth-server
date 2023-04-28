import express from 'express';
import postController from '../controllers/postController';
import { checkManager, checkToken } from '../middlewares';

const postRouter = express.Router();

postRouter.patch(
  '/add-new-user',
  checkToken,
  checkManager,
  postController.addNewUser
);

export default postRouter;
