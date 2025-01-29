const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const config = require('../config/database');


module.exports = function (passport) {
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.secret,
  };

  passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      try {
        // Async call to fetch the user by ID
        const user = await User.getUserById(jwt_payload.id);

        if (user) {
          console.log('User authenticated:', user);
          return done(null, user);  // User found
        } else {
          return done(null, false); // No user found
        }
      } catch (err) {
        console.error('Error during authentication:', err);
        return done(err, false);  // Error during DB lookup
      }
    })
  );
};
