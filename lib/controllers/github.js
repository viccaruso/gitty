const { Router } = require('express');
const jwt = require('jsonwebtoken');
const GithubUser = require('../models/GithubUser');
const { codeExchange, getGithubProfile } = require('../utils/github');
const GITHUB_OAUTH_URL = `https://github.com/login/oauth/authorize?client_id=${process.env.GH_CLIENT_ID}&scope=user&redirect_uri=${process.env.GH_REDIRECT_URI}`;
const SIXTEEN_HOURS_IN_MS = 1000 * 60 * 60 * 16;

module.exports = Router()
  .get('/auth', (req, res, next) => {
    res.redirect(GITHUB_OAUTH_URL)
      .catch(error => next(error));
  })
  .get('/auth/callback', async (req, res, next) => {
    try {
      const { code } = req.query;
      const token = await codeExchange(code);
      const info = await getGithubProfile(token);
      let user = await GithubUser.findByUsername(info.login);
      if (!user) {
        user = await GithubUser.insert({
          username: info.login,
          avatar: info.avatar_url,
          email: info.email
        });
      }

      console.log('This is the user', user);
      const payload = jwt.sign(user.toJSON(), process.env.JWT_SECRET, { expiresIn: '1 day' });
      console.log('This is payload', payload);
      res.cookie(process.env.COOKIE_NAME, payload, {
        httpOnly: true,
        maxAge: SIXTEEN_HOURS_IN_MS
      }).redirect('/api/v1/posts');
      console.log('This is says anything');
    } catch (error) {
      next(error);
    }
  })
  .delete('/auth', (req, res, next) => {
    res.clearCookie(process.env.COOKIE_NAME)
      .json({ message: 'You have logged out.' })
      .catch(error => next(error));
  });
