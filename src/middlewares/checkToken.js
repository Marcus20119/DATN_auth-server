var jwt = require('jsonwebtoken');
import dotenv from 'dotenv';
import db from '../models';

dotenv.config();

function checkToken(req, res, next) {
  const authorizationHeader = req.headers['authorization'];
  const access_token = authorizationHeader
    ? authorizationHeader.split(' ')[1]
    : '';

  if (!access_token || access_token === 'undefined') {
    return res.status(401).json({
      message: 'access_token is needed',
    });
  }
  jwt.verify(
    access_token,
    process.env.ACCESS_TOKEN_SECRET,
    async (err, data) => {
      if (err) {
        return res.status(403).json({
          message: 'Forbidden or outdated token',
        });
      }
      const userData = await db.User.findOne({
        where: { id: Number.parseInt(data.id) },
        raw: true,
      });

      if (!userData || userData.is_deleted) {
        return res.status(400).json({
          message: 'User Not Found or is Deleted',
        });
      }
      req.id = Number.parseInt(data.id);
      req.role_id = Number.parseInt(userData.role_id);
      next();
    }
  );
}

export { checkToken };
