const express = require('express');
const passport = require('passport');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config');

router.post(
  '/login',
  passport.authenticate('local', { session: false }), //Auth with local strategy
  async (req, res, next) => {
    //We got the user from the local strategy with done(user,null)
    //The user is in request
    try {
      const user = req.user;
      //The user was authenticated, so generate the jwt payload
      const payload = {
        sub: user.id, //subject, unique identifier
      };
      //Sign token
      const token = jwt.sign(payload, jwtSecret);
      //Respond with user info and token
      res.status(200).json({ user, token });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
