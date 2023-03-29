import express from 'express';
import { checkPlayer, checkToken } from '../middlewares';

const postRouter = express.Router();

// postRouter.post('/test', postController.handleTest);

export default postRouter;
