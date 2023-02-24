const express = require('express');
const Service = require('../services/comment.service');
const passport = require('passport');
const {
  CommentWithImgSchema,
  CommentWithoutImgSchema,
} = require('../schemas/comments.schemas');
const {
  validateImgAndData,
} = require('../middlewares/validateWithImg.middlewares');
const { Image } = require('../services/images.service');

const router = express.Router();
const commentService = new Service();
const imageService = new Image();

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  validateImgAndData(CommentWithImgSchema, CommentWithoutImgSchema),
  async (req, res, next) => {
    try {
      const { sub: user_id } = req.user;
      const commentData = { user_id, ...req.body };

      if (req.file) {
        const { secure_url: imageUrl } =
          await imageService.uploadImage(req.file);
        commentData['image'] = imageUrl;
      }
      const [{ insertId }] = await commentService.makeComment(
        commentData
      );
      console.log(insertId);
      res.json('OK');
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
