const express = require('express');
const passport = require('passport');
const router = express.Router();

router.post(
  '/login',
  passport.authenticate('local', { session: false }), //Auth with local strategy
  async (req, res, next) => {
    //We got the user from the local strategy with done(user,null)
    //The user is in request
    try {
      res.status(200).json(req.user);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
