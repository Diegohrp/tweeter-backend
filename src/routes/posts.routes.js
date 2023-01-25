const express = require('express');

//middlewares to validate image and data (post content and privacy)
const {
  validateImgAndData,
} = require('../middlewares/validateWithImg.middlewares');

//Schemas
const {
  PostWithImgSchema,
  PostWithoutImgSchema,
} = require('../schemas/posts.schemas');

//Services
const Service = require('../services/post.service');
const { Image } = require('../services/images.service');

const router = express.Router();
const postService = new Service();
const imageService = new Image();

router.post(
  '/',
  validateImgAndData(PostWithImgSchema, PostWithoutImgSchema),
  async (req, res, next) => {
    try {
      const postData = { ...req.body };
      delete postData.image; //Delete that filed, because it could be null
      //If there is a file, upload to cloudinary
      //Get the URL and add it to the fiels image of the object postData
      if (req.file) {
        const { secure_url: imageUrl } =
          await imageService.uploadImage(req.file);
        postData['image'] = imageUrl;
      }
      const response = await postService.makePost(postData);
      res.json(response);
    } catch (err) {
      next(err);
    }

    /* cloudinary.uploader
    .upload_stream(
      {
        resource_type: 'raw',
        public_id: req.file.originalname,
        folder: 'tweeter/posts',
      },
      (err, result) => {
        if (err) {
          console.log('ERROR: ' + err);
          return res.status(500).send('Algo malió sal');
        }
        console.log(result);
        res.send('OKS');
      }
    )
    .end(req.file.buffer); */

    /* const send = await postService.makePost(data);
  res.json(send); */
  }
);

router.get('/', async (req, res, next) => {
  res.json('Hola');
});

module.exports = router;
