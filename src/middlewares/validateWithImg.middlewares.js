const boom = require('@hapi/boom');

function validateData(data, schema) {
  const { error } = schema.validate(data);
  return error;
}

function validateImgAndData(WithImgSchema, WithoutImgSchema) {
  return (req, res, next) => {
    const data = { ...req.body }; //{content:"",privacy:""}
    const imageData = req.file;

    if (imageData) {
      //Add the image data required for the schema
      data['image'] = {
        img: imageData.originalname,
        imgSize: imageData.size,
      };

      const error = validateData(data, WithImgSchema);
      error ? next(boom.badData(error)) : next();
    } else {
      delete data.image;
      const error = validateData(data, WithoutImgSchema);
      error ? next(boom.badData(error)) : next();
    }
  };
}

module.exports = { validateImgAndData };
