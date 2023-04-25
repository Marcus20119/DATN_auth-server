import express from 'express';
import updateController from '../controllers/updateController';
import { checkRole, checkToken } from '../middlewares';
// import updateController from '../controllers/updateController';
// import { checkPlayer, checkToken } from '../middlewares';

const updateRouter = express.Router();

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
updateRouter.patch(
  '/:role/user/activate/:userId',
  checkToken,
  checkRole,
  updateController.activateUser
);
updateRouter.patch(
  '/:role/user/deactivate/:userId',
  checkToken,
  checkRole,
  updateController.deactivateUser
);

export default updateRouter;
