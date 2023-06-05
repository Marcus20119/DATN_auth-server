import * as postService from '../services/postService';

class PostController {
  async addNewUser(req, res) {
    try {
      const { status, payload } = await postService.handleAddNewUser(
        req.role_id,
        req.body
      );
      return res.status(status).json(payload);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }
  async addNewStaff(req, res) {
    try {
      const { status, payload } = await postService.handleAddNewStaff(req.body);
      return res.status(status).json(payload);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }
  async addNewError(req, res) {
    try {
      const { status, payload } = await postService.handleAddNewError(req.body);
      return res.status(status).json(payload);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }
  async addNewProject(req, res) {
    try {
      const { status, payload } = await postService.handleAddNewProject(
        req.body
      );
      return res.status(status).json(payload);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }
}

export default new PostController();
