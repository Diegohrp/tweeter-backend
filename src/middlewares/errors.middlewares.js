//Prints error in console and sends it to the next middleware
function logErrors(err, req, res, next) {
  console.log('---------------Log Errors---------------');
  console.log(err);
  next(err);
}

//Sends to the client a error message when an internal server error happens
function errorHandler(err, req, res, next) {
  const errMsg = err.errors[0].message || err.message;
  res.status(500).json({
    message: errMsg,
  });
}

/*
  Boom errors happen when the client send incorrect data
  or is not authorized to do something.
  This middleware identifies when an error is type boom, if
  it's not, the sends it to the next middleware
*/
function boomError(err, req, res, next) {
  if (err.isBoom) {
    console.log(err);
    const { output } = err;
    res.status(output.statusCode).json(output.payload);
  } else {
    next(err);
  }
}

module.exports = { logErrors, errorHandler, boomError };
