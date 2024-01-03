const express = require('express');
const Service = require('../services/user.service');
const {
  createUserSchema,
  changeUserInfoSchema,
} = require('../schemas/users.schemas');
const validateData = require('../middlewares/validate.middlewares');
const boom = require('@hapi/boom');
const { verifyApiKey } = require('../middlewares/verifyApiKey.middlewares');
const passport = require('passport');

const router = express.Router();
const userService = new Service();

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const [data] = await userService.findByEmail('tory@cobrakai.com');
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

//Get and edit profile info
router.get(
  '/profile-info',
  verifyApiKey,
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      //req contains the jwt, passport gives it the name "user"
      //We want to get the id (the "sub" in the token)
      const { sub } = req.user;
      const [userData] = await userService.getUserInfo(sub);
      userData['password'] = '********';
      res.status(200).json(userData);
    } catch (err) {
      next(err);
    }
  }
);

router.patch(
  '/profile-info',
  verifyApiKey,
  passport.authenticate('jwt', { session: false }),
  validateData(changeUserInfoSchema, 'body'),
  async (req, res, next) => {
    try {
      const { sub } = req.user;
      const data = req.body;
      const { info } = await userService.updateUserInfo(data, sub);
      res.json({ msg: 'Your info has been updated', info });
    } catch (err) {
      if (err.code === 'ER_PARSE_ERROR') {
        next(boom.badData('You have to change at least one field'));
      }
      next(err);
    }
  }
);

//Get basic user info
router.get(
  '/basic-info',
  verifyApiKey,
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const id = req.user.sub;
      const [{ photo, name, last_name }] = await userService.getUserBasicInfo(
        id
      );

      photo
        ? res.json({ id, name, last_name, photo })
        : res.json({
            id,
            name,
            last_name,
            photo:
              'https://res.cloudinary.com/dpimpzyh4/image/upload/v1674951625/tweeter/posts/1674951621844_bobLavando.jpeg.jpg',
          });
    } catch (err) {
      next(err);
    }
  }
);

//Get users
router.get(
  '/explore',
  verifyApiKey,
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const { sub: userId } = req.user;
      const { filter, limit, offset } = req.query;
      let where = `users.id != ${userId}`;

      if (filter) {
        where += ` AND (users.name LIKE "%${filter}%" OR users.username LIKE "%${filter}%" OR users.last_name LIKE "%${filter}%")`;
      }

      const response = await userService.exploreUsers({
        userId,
        limit,
        offset,
        orderBy: 'num_followers DESC',
        whereClause: where,
      });
      res.json(response);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
