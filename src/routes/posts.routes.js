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
const { PostHashTags } = require('../services/post-hashtags.service');

const router = express.Router();
const postService = new Service();
const imageService = new Image();
const postHashtagsService = new PostHashTags();

router.post(
  '/',
  validateImgAndData(PostWithImgSchema, PostWithoutImgSchema),
  async (req, res, next) => {
    try {
      const postData = { ...req.body };
      const hashtags = postData.hashtags;
      delete postData.image; //Delete that filed, because it could be null
      delete postData.hashtags; //we don't need hashtags in postData, but they are stored in "hashtags"

      //If there is a file, upload to cloudinary
      //Get the URL and add it to the fiels image of the object postData
      if (req.file) {
        const { secure_url: imageUrl } =
          await imageService.uploadImage(req.file);
        postData['image'] = imageUrl;
      }
      const [{ insertId }] = await postService.makePost(postData);

      if (hashtags) {
        await postHashtagsService.registerHashtags(
          insertId,
          hashtags
        );
      }
      const post = { insertId, ...postData };
      res.json(post);
    } catch (err) {
      next(err);
    }
  }
);

router.get('/home', async (req, res, next) => {
  try {
    const { limit, offset } = req.query;

    const [data] = await postService.getPosts(4, offset, limit);

    res.json(data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
