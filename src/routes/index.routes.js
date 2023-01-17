const express = require('express');
const userRouter = require('./users.routes');
const authRouter = require('./auth.routes');

function APIRouter(app) {
  const router = express.Router();
  router.use('/auth', authRouter);
  router.use('/users', userRouter);
  app.use('/tweeter/api/v1', router);
}

module.exports = APIRouter;
