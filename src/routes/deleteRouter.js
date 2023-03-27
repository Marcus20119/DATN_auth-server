import express from 'express';
// import deleteController from '../controllers/deleteController';
// import { checkAdmin, checkToken } from '../middlewares';

const deleteRouter = express.Router();

// deleteRouter.delete(
//   '/user/soft-delete/:userId',
//   checkToken,
//   checkAdmin,
//   deleteController.softDeleteUser
// );
// deleteRouter.delete(
//   '/user/hard-delete/:userId',
//   checkToken,
//   checkAdmin,
//   deleteController.hardDeleteUser
// );
// deleteRouter.delete(
//   '/user/restore/:userId',
//   checkToken,
//   checkAdmin,
//   deleteController.restoreUser
// );

export default deleteRouter;
