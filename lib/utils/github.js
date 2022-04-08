const fetch = require('cross-fetch');

const codeExchange = function(code) {
  return fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    body: { 
      code,
      client_id: process.env.GH_CLIENT_ID,
      client_secret: process.env.GH_CLIENT_SECRET
    },
    headers: {
      Accept: 'application/json'
    }
  });
};

const getGithubProfile = function(token) {
  return fetch('https://api.github.com/user', {
    method: 'GET',
    headers: {
      Authorization: `token ${token}`
    }
  });
};

module.exports = { codeExchange, getGithubProfile };
