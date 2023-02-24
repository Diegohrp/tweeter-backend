const joi = require('joi');
const post_id = joi.number();
const content = joi.string();
const img = joi.string().regex(/^[\w -()]*\.(png|jpg|jpeg|jfif)$/i);
const imgSize = joi.number().max(2 * 1024 * 1024);

const CommentWithoutImgSchema = joi.object({
  post_id,
  content: content.min(1).max(400).required(),
});

const CommentImageSchema = joi.object({
  img: img.required(),
  imgSize: imgSize.required(),
});

const CommentWithImgSchema = joi.object({
  post_id,
  content: content.allow('').max(280),
  image: CommentImageSchema,
});

module.exports = { CommentWithoutImgSchema, CommentWithImgSchema };
