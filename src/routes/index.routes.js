const express = require('express');
const userRouter = require('./users.routes');
const authRouter = require('./auth.routes');
const postRouther = require('./posts.routes.js');

function APIRouter(app) {
  const router = express.Router();
  router.use('/auth', authRouter);
  router.use('/users', userRouter);
  router.use('/posts', postRouther);
  app.use('/tweeter/api/v1', router);
}

module.exports = APIRouter;
