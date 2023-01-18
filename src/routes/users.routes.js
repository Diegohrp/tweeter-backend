const express = require('express');
const Service = require('../services/user.service');
const { createUserSchema } = require('../schemas/users.schemas');
const validateData = require('../middlewares/validate.middlewares');
const boom = require('@hapi/boom');
const {
  verifyApiKey,
} = require('../middlewares/verifyApiKey.middlewares');
const passport = require('passport');

const router = express.Router();
const userService = new Service();

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const [data] = await userService.findByEmail(
        'tory@cobrakai.com'
      );
      res.status(200).json({
        msg: 'users',
        data,
      });
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  }
);

//Create account

router.post(
  '/signup',
  verifyApiKey, //Protect routes with api key
  validateData(createUserSchema, 'body'),
  async (req, res, next) => {
    try {
      const data = req.body;
      const newUserId = await userService.createAccount(data);
      res.status(201).json({ message: 'Account created', newUserId });
    } catch (err) {
      let error;
      //Status code 409 conflict (usually when a register already exists)
      err.code == 'ER_DUP_ENTRY'
        ? (error = boom.conflict('Email already registered'))
        : (error = boom.conflict());
      next(error);
    }
  }
);

module.exports = router;
