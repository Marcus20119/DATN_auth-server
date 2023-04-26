import * as getService from '../services/getService';

class GetController {
  async getAllDataFromUser(req, res) {
    try {
      const { status, payload } = await getService.getAllDataFromUser(
        req.params.role,
        req.query,
        req.params.type,
        req.params.project
      );
      return res.status(status).json(payload);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }

  async getUserByUserId(req, res) {
    try {
      const { status, payload } = await getService.getDataByUserId(
        'User',
        req.id,
        Number.parseInt(req.params.userId)
      );
      return res.status(status).json(payload);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }
}

export default new GetController();
