import express from 'express';
import updateController from '../controllers/updateController';
import {
  checkAdmin,
  checkManager,
  checkRole,
  checkToken,
} from '../middlewares';
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
  '/staff/soft-delete/:staffId',
  checkToken,
  checkAdmin,
  updateController.softDeleteStaff
);
updateRouter.patch(
  '/:role/user/restore/:userId',
  checkToken,
  checkRole,
  updateController.restoreUser
);
updateRouter.patch(
  '/staff/restore/:staffId',
  checkToken,
  checkAdmin,
  updateController.restoreStaff
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
updateRouter.patch(
  '/:role/user/edit/:userId',
  checkToken,
  checkRole,
  updateController.editUser
);
updateRouter.patch(
  '/staff/edit/:staffId',
  checkToken,
  checkAdmin,
  updateController.editStaff
);
updateRouter.patch(
  '/advanced/user/change-password/:userId',
  checkToken,
  checkManager,
  updateController.advancedChangePassword
);
updateRouter.patch(
  '/self/user/change-password/:userId',
  checkToken,
  updateController.selfChangePassword
);

export default updateRouter;
