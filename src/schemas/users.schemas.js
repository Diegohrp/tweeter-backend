const joi = require('joi');

const name = joi.string().max(30);
const lastName = joi.string().max(60);
const email = joi.string().email();
const username = joi.string().min(3).max(20);
const password = joi.string().min(8).max(200);
const bio = joi.string().max(200);

//Validates data when you create a new account
const createUserSchema = joi.object({
  name: name.required(),
  last_name: lastName.required(),
  email: email.required(),
  username: username.required(),
  password: password.required(),
});

const loginSchema = joi.object({
  email: email.required(),
  password: password.required(),
});

const changeUserInfoSchema = joi.object({
  name,
  last_name: lastName,
  bio,
  email,
  username,
  password,
});

module.exports = {
  createUserSchema,
  loginSchema,
  changeUserInfoSchema,
};
