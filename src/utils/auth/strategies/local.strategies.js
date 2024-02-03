const { Strategy } = require('passport-local');
const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const Service = require('../../../services/user.service');

const userService = new Service();

const LocalStrategy = new Strategy(
  {
    //change default names of fields for this strategy
    usernameField: 'email',
    passwordField: 'password',
  },
  async (email, password, done) => {
    try {
      //MySQL return an array of data, but in this case there's only 1 element in that array
      //We extract that only object from the array
      const [user] = await userService.findByEmail(email);

      if (!user) {
        //done(error,user=false)
        done(boom.unauthorized('Wrong password or email'), false);
      }
      //compare passwords by hash
      const passMatch = await bcrypt.compare(password, user.password);
      if (!passMatch) {
        done(boom.unauthorized('Wrong password or email'), false);
      }
      delete user.password;
      done(null, user);
    } catch (err) {
      done(err, false);
    }
  }
);

module.exports = { LocalStrategy };
