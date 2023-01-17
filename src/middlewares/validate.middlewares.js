const boom = require('@hapi/boom');

//middleware to validate data using a joi schema,
//If the data is not correct, generates a boom error

function validateData(schema, origin) {
  return (req, res, next) => {
    const data = req[origin]; //To know where the data comes from (params, body, etc.)
    const { error } = schema.validate(data);
    if (error) {
      next(boom.badData(error));
    } else {
      next();
    }
  };
}

module.exports = validateData;
