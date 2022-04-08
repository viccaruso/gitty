const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    req.user = jwt.verify(req.cookies[process.env.COOKIE_NAME], process.env.JWT_SECRET);
    next();
  } catch (error) {
    error.message = 'You must be signed in to continue.',
    error.status = 401;
    next(error);
  }
};
