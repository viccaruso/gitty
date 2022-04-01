const fetch = require('cross-fetch');

const codeExchange = async (code) => {
  const token = fetch('https://github.com/login/oauth/access_token', {
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
  return token;
};

module.exports = { codeExchange };
