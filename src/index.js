const express = require('express');
const APIRouter = require('./routes/index.routes');
const {
  logErrors,
  errorHandler,
  boomError,
} = require('./middlewares/errors.middlewares');

const port = 3000;

const app = express();

//app needs to use middleware express.json() to understand json
app.use(express.json());
APIRouter(app);
//middlewares to handle errors
app.use(logErrors);
app.use(boomError);
app.use(errorHandler);

app.listen(port, () => {
  console.log('Listening port: ' + port);
});
