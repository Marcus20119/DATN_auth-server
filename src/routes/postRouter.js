import express from 'express';
import postController from '../controllers/postController';
import { checkAdmin, checkManager, checkToken } from '../middlewares';

const postRouter = express.Router();

postRouter.post(
  '/user/add-new',
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
postRouter.post(
  '/project/add-new',
  checkToken,
  checkAdmin,
  postController.addNewProject
);
postRouter.post(
  '/access-history/:projectId',
  checkToken,
  postController.addAccessHistory
);

export default postRouter;
