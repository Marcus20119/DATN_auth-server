import express from 'express';
import postController from '../controllers/postController';
import { checkPlayer, checkRole, checkToken } from '../middlewares';

const postRouter = express.Router();

export default postRouter;
