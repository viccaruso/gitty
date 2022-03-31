const { Router } = require('express');
const GITHUB_OAUTH_URL = `https://github.com/login/oauth/authorize?client_id=${process.env.GH_CLIENT_ID}&scope=user&redirect_uri=${process.env.GH_REDIRECT_URI}`;

module.exports = Router().get('/auth', async (req, res, next) => {
  try {
    res.redirect(GITHUB_OAUTH_URL);
  } catch (error) {
    next(error);
  }
});
