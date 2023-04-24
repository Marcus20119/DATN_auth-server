import * as updateService from '../services/updateService';

class UpdateController {
  async softDeleteUser(req, res) {
    try {
      const { status, payload } = await updateService.softDeleteUser(
        req.params.role,
        req.params.userId
      );
      return res.status(status).json(payload);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }
  async restoreUser(req, res) {
    try {
      const { status, payload } = await updateService.restoreUser(
        req.params.userId
      );
      return res.status(status).json(payload);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }
  // async handleUpdateUser(req, res) {
  //   try {
  //     const { status, payload } = await updateService.handleUpdateUser(
  //       req.body,
  //       req.params.userId
  //     );
  //     return res.status(status).json(payload);
  //   } catch (err) {
  //     console.log(err);
  //     return res.status(500).json(err);
  //   }
  // }
}

export default new UpdateController();
