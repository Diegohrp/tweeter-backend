const boom = require('@hapi/boom');
const cloudinary = require('cloudinary').v2;
const { cloudName, cloudApiKey, cloudSecret } = require('../config');

cloudinary.config({
  cloud_name: cloudName,
  api_key: cloudApiKey,
  api_secret: cloudSecret,
});

class Image {
  constructor() {}

  async uploadImage(imgData) {
    //We need to assign a public id to the image
    //A new name, because users could upload images with the same name
    //I use the static method Date.now() to get the number of ms of the moment when this method is excecuted
    //Combine it with the original name
    const public_id = `${Date.now()}_${imgData.originalname}`;
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: 'image',
            public_id,
            folder: 'tweeter/posts',
          },
          (error, result) => {
            if (error) {
              reject(boom.internal('Server error, try again later'));
            } else {
              resolve(result);
            }
          }
        )
        .end(imgData.buffer);
    });
  }
}

module.exports = { Image };
