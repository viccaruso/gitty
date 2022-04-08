const fetch = require('cross-fetch');

const apis = [
  'https://programming-quotes-api.herokuapp.com/quotes/random',
  'https://futuramaapi.herokuapp.com/api/quotes/1',
  'https://api.quotable.io/random'
];

const fetchQuote = (url) => fetch(url)
  .then(res => {
    if (res.status >= 400) {
      throw new Error("Bad response from server");
    }
    
    return res.json();
  })
  .then((quote) => {
    // Gross
    // APIs all return different shape and the following code works
    // Futurama api returns an array, while others return objects
    // The following works for these 3 specific apis, but feels brittle
    // as clearly it would break with any other api
    const formattedQuote = {
      author: quote[0] ? quote[0].character : quote.author,
      content: quote[0] ? quote[0].quote : quote.content || quote.en
    };
    return formattedQuote;
  })
  .catch(err => {
    console.error(err);
  });

module.exports = class QuoteService {
  static getQuotes() {
    return Promise.all(apis.map((url) => fetchQuote(url)));
  }
};
