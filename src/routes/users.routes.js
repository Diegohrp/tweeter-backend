const express = require('express');
const service = require('../services/user.service');
const { createUserSchema } = require('../schemas/users.schemas');
const validateData = require('../middlewares/validate.middleware');
const boom = require('@hapi/boom');

const router = express.Router();
const user = new service();

router.get('/', async (req, res, next) => {
  try {
    const data = await user.find();
    res.status(200).json({
      msg: 'users',
      data,
    });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

//Create account
router.post(
  '/signup',
  validateData(createUserSchema, 'body'),
  async (req, res, next) => {
    try {
      const data = req.body;
      const newUser = await user.createAccount(data);
      res.status(201).json(newUser);
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
