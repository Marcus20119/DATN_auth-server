import express from 'express';
import updateController from '../controllers/updateController';
import { checkRole, checkToken } from '../middlewares';
// import updateController from '../controllers/updateController';
// import { checkPlayer, checkToken } from '../middlewares';

const updateRouter = express.Router();

// updateRouter.put(
//   '/user/:userId',
//   checkToken,
//   checkPlayer,
//   updateController.handleUpdateUser
// );
updateRouter.patch(
  '/:role/user/soft-delete/:userId',
  checkToken,
  checkRole,
  updateController.softDeleteUser
);
updateRouter.patch(
  '/:role/user/restore/:userId',
  checkToken,
  checkRole,
  updateController.restoreUser
);

export default updateRouter;
