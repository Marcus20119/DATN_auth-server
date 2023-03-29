import * as updateService from '../services/updateService';

class PostController {
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

export default new PostController();
