const { Router } = require('express');
const jwt = require('jsonwebtoken');
const UserService = require('../services/UserService');
const GITHUB_OAUTH_URL = `https://github.com/login/oauth/authorize?client_id=${process.env.GH_CLIENT_ID}&scope=user&redirect_uri=${process.env.GH_REDIRECT_URI}`;
const SIXTEEN_HOURS_IN_MS = 1000 * 60 * 60 * 16;

module.exports = Router()
  .get('/auth', (req, res) => {
    res.redirect(GITHUB_OAUTH_URL);
  })
  .get('/auth/callback', (req, res, next) => {
    UserService.create(req.query.code)
      .then((user) => jwt.sign(user.toJSON(), process.env.JWT_SECRET, { expiresIn: '1 day' }))
      .then((payload) => {
        res.cookie(process.env.COOKIE_NAME, payload, {
          httpOnly: true,
          maxAge: SIXTEEN_HOURS_IN_MS
        }).redirect('/api/v1/posts');
      })
      .catch(error => next(error));
  })
  .delete('/auth', (req, res) => {
    res.clearCookie(process.env.COOKIE_NAME)
      .json({ message: 'You have logged out.' });
  });
