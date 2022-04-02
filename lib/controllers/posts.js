const { Router } = require('express');
const Post = require('../models/Post');

module.exports = Router()
  .get('/', async (req, res, next) => {
    try {
      res.send(await Post.getAll());
    } catch (error) {
      next(error);
    }
  });
