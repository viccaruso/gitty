const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  try {
    req.user = jwt.verify(req.cookies.session, process.env.JWT_SECRET);
  } catch (error) {
    error.message = 'You must be signed in to continue.',
    error.status = 401;
    next(error);
  }
};
