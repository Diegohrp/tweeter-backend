//Import passport
const passport = require('passport');
//Import required strategy
const { LocalStrategy } = require('./strategies/local.strategies');
//Tell passport to use the strategy
passport.use(LocalStrategy);
