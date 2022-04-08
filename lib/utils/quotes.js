const fetch = require('cross-fetch');

const getQuote = (apiURL) => fetch(apiURL);

module.exports = { getQuote };
