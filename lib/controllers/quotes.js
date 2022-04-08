const { Router } = require('express');
const QuoteService = require('../services/QuoteService');

module.exports = Router()
  .get('/', (req, res) => {
    QuoteService.getQuotes()
      .then(quotes => res.send(quotes));
  });

