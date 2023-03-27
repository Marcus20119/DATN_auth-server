import * as deleteService from '../services/deleteService';

class DeleteController {
  // async softDeleteUser(req, res) {
  //   try {
  //     const { status, payload } = await deleteService.softDeleteUser(
  //       req.params.userId
  //     );
  //     return res.status(status).json(payload);
  //   } catch (err) {
  //     console.log(err);
  //     return res.status(500).json(err);
  //   }
  // }
  // async hardDeleteUser(req, res) {
  //   try {
  //     const { status, payload } = await deleteService.hardDeleteUser(
  //       req.params.userId
  //     );
  //     return res.status(status).json(payload);
  //   } catch (err) {
  //     console.log(err);
  //     return res.status(500).json(err);
  //   }
  // }
  // async restoreUser(req, res) {
  //   try {
  //     const { status, payload } = await deleteService.restoreUser(
  //       req.params.userId
  //     );
  //     return res.status(status).json(payload);
  //   } catch (err) {
  //     console.log(err);
  //     return res.status(500).json(err);
  //   }
  // }
}

export default new DeleteController();
