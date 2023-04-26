import * as deleteService from '../services/deleteService';

class DeleteController {
  async hardDeleteUser(req, res) {
    try {
      const { status, payload } = await deleteService.hardDeleteUser(
        req.params.role,
        Number.parseInt(req.params.userId)
      );
      return res.status(status).json(payload);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }
}

export default new DeleteController();
