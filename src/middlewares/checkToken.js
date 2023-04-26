var jwt = require('jsonwebtoken');
import dotenv from 'dotenv';

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
  jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
    if (err) {
      return res.status(403).json({
        message: 'Forbidden or outdated token',
      });
    }
    req.id = Number.parseInt(data.id);
    next();
  });
}

export { checkToken };
