import express from 'express';
import authController from '../controllers/authController';
import { authToken } from '../middlewares';

const authRouter = express.Router();

authRouter.post('/sign-in', authController.handleSignIn);
authRouter.post('/sign-up', authController.handleSignUp);
authRouter.post('/refresh-token', authController.handleRefreshToken);

export default authRouter;
