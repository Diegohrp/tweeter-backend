const express = require('express');
const APIRouter = require('./routes/index.routes');
const {
  logErrors,
  errorHandler,
  boomError,
} = require('./middlewares/errors.middlewares');
const cors = require('cors');
const multer = require('multer');

const uploadImg = multer();

const port = 3000;
const app = express();

const whitelist = [
  'http://127.0.0.1:3006',
  'http://localhost:3006',
  'https://boisterous-faun-d63901.netlify.app',
];
const options = {
  origin: (origin, cb) => {
    /*  console.log(origin); */
    if (whitelist.includes(origin) || !origin) {
      cb(null, true);
    } else {
      cb(new Error('Unauthorized'));
    }
  },
};

//app needs to use middleware express.json() to understand json
app.use(express.json());
//multer middelware to understand multipart/form-data
app.use(uploadImg.single('image'));
app.use(cors(options));
require('./utils/auth');

APIRouter(app);
//middlewares to handle errors
app.use(logErrors);
app.use(boomError);
app.use(errorHandler);

app.listen(port, () => {
  console.log('Listening port: ' + port);
});
