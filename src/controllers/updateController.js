import * as updateService from '../services/updateService';

class UpdateController {
  async softDeleteUser(req, res) {
    try {
      const { status, payload } = await updateService.handleUpdateUser(
        req.id,
        Number.parseInt(req.params.userId),
        { is_deleted: true },
        'Delete User successfully'
      );
      return res.status(status).json(payload);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }
  async restoreUser(req, res) {
    try {
      const { status, payload } = await updateService.handleUpdateUser(
        req.id,
        Number.parseInt(req.params.userId),
        { is_deleted: false },
        'Restore User successfully'
      );
      return res.status(status).json(payload);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }
  async activateUser(req, res) {
    try {
      const { status, payload } = await updateService.handleUpdateUser(
        req.id,
        Number.parseInt(req.params.userId),
        { is_activated: true },
        'Restore User successfully'
      );
      return res.status(status).json(payload);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }
  async deactivateUser(req, res) {
    try {
      const { status, payload } = await updateService.handleUpdateUser(
        req.id,
        Number.parseInt(req.params.userId),
        { is_activated: false },
        'Restore User successfully'
      );
      return res.status(status).json(payload);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }
  async editUser(req, res) {
    try {
      const { status, payload } = await updateService.handleUpdateUser(
        req.id,
        Number.parseInt(req.params.userId),
        req.body,
        'Edit User successfully'
      );
      return res.status(status).json(payload);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }
  async advancedChangePassword(req, res) {
    try {
      const { status, payload } =
        await updateService.handleAdvancedChangePassword(
          Number.parseInt(req.params.userId),
          req.body.new_password
        );
      return res.status(status).json(payload);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }
  async selfChangePassword(req, res) {
    try {
      const { status, payload } = await updateService.handleSelfChangePassword(
        Number.parseInt(req.params.userId),
        req.body.old_password,
        req.body.new_password
      );
      return res.status(status).json(payload);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }
}

export default new UpdateController();
