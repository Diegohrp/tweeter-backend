const express = require('express');
const userRouter = require('./users.routes');

function APIRouter(app) {
  const router = express.Router();
  router.use('/users', userRouter);
  app.use('/tweeter/api/v1', router);
}

module.exports = APIRouter;
