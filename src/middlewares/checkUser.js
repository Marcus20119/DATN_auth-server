import db from '../models';

async function checkBasicClient(req, res, next) {
  try {
    const userData = await db.User.findOne({
      where: { id: req.id },
      raw: true,
    });

    if (userData.role_id >= 0) {
      next();
    } else {
      return res.status(401).json({
        message: 'User does not have access to call this request',
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
}

async function checkEngineer(req, res, next) {
  try {
    const userData = await db.User.findOne({
      where: { id: req.id },
      raw: true,
    });

    if (userData.role_id >= 1) {
      next();
    } else {
      return res.status(401).json({
        message: 'User does not have access to call this request',
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
}

async function checkManager(req, res, next) {
  try {
    const userData = await db.User.findOne({
      where: { id: req.id },
      raw: true,
    });

    if (userData.role_id >= 2) {
      next();
    } else {
      return res.status(401).json({
        message: 'User does not have access to call this request',
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
}

async function checkAdmin(req, res, next) {
  try {
    const userData = await db.User.findOne({
      where: { id: req.id },
      raw: true,
    });

    if (userData.role_id >= 3) {
      next();
    } else {
      return res.status(401).json({
        message: 'User does not have access to call this request',
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
}

export { checkBasicClient, checkEngineer, checkManager, checkAdmin };
