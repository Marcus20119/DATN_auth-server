import * as getService from '../services/getService';

class GetController {
  async getAllDataFromUsers(req, res) {
    try {
      const { status, payload } = await getService.getAllData(
        'User',
        req.query,
        req.params.type
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
        req.params.userId
      );
      return res.status(status).json(payload);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }
}

export default new GetController();
