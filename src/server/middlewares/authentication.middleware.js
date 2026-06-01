const jwt = require('jsonwebtoken');
const config = require('../configuration');

function verify(req, res, next) {
  // Get Auth Header Value
  const bearerHeader = req.headers['x-auth'];

  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;

    jwt.verify(req.token, config.auth.secret, (err, authData) => {
      if (err) {
        res.send('expired token');
      }
    });

    next();
  } else {
    res.sendStatus(403);
  }
}

exports.verify = verify;
