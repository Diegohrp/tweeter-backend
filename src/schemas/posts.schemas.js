const joi = require('joi');

const content = joi.string();
const privacy_id = joi.number().max(2);
const user_id = joi.number().integer().positive().required();
const img = joi.string().regex(/^[\w -]*\.(png|jpg|jpge|jfif)$/i);
const imgSize = joi.number().max(2 * 1024 * 1024);

const PostWithoutImgSchema = joi.object({
  content: content.min(1).max(280).required(),
  privacy_id: privacy_id.required(),
  user_id,
});

const PostImageSchema = joi.object({
  img: img.required(),
  imgSize: imgSize.required(),
});

const PostWithImgSchema = joi.object({
  content: content.allow('').max(280),
  privacy_id: privacy_id.required(),
  user_id,
  image: PostImageSchema,
});

module.exports = { PostWithImgSchema, PostWithoutImgSchema };
