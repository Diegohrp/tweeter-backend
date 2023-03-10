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
      delete commentData.image;

      if (req.file) {
        const { secure_url: imageUrl } =
          await imageService.uploadImage(req.file);
        commentData['image'] = imageUrl;
      }
      const insertId = await commentService.makeComment(commentData);

      res.send({ insertId, ...commentData });
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  '/:postId',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const { sub: currentUserId } = req.user;
      const { postId } = req.params;
      const { limit, offset } = req.query;
      const data = await commentService.getComments(
        currentUserId,
        postId,
        limit,
        offset
      );

      res.json(data);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  '/like-comment',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const { sub: userId } = req.user;
      const { commentId } = req.body;
      await commentService.addInteraction(
        userId,
        commentId,
        'like_comment'
      );
      res.json('OK');
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  '/like-comment/:commentId',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const { sub: userId } = req.user;
      const { commentId } = req.params;
      await commentService.removeInteraction(
        userId,
        parseInt(commentId),
        'remove_like_comment'
      );
      res.json('OK');
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
