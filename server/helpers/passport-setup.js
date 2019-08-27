const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../db/models/user-model');
const env = require('dotenv').load();
const request = require('request');
const md5 = require('md5');

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET
} = process.env;
passportCred = {
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
 User.findByPk(id).then((user) => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy({
    // options for google strategy
    clientID: passportCred.clientID,
    clientSecret: passportCred.clientSecret,
    callbackURL: passportCred.callbackURL,
  }, (accessToken, refreshToken, profile, done) => {
    // check if user already exists in our own db
    User.findOne({
      where: {
        googleID: profile.id
      }
    }).then(function (user) {
      if (user) {
        return done(null, user, {
          message: 'That Google ID is already taken.'
        });
      } else {


        var options = { url: 'https://slack.com/api/users.lookupByEmail',         //options to POST to the Slack API to get user ID
        headers: {'Content-Type': 'application/x-www-form-urlencoded' },
        form:
         { token: process.env.SLACKBOT_TOKEN,
           email: profile.emails[0].value,
            } };
        request.post(options, function (error, response, body) {
          console.log(response.body);
          response = JSON.parse(response.body);
          slack = "";
          console.log(response.ok);
          if(response.ok == false ){console.log("unable to get slack ID for ",profile.emails[0].value);}
          if(response.ok != false ){slack = response.user.id;}                               //User is created in the callback from the slack API function
          var data = {
            googleID: profile.id,
            displayName: profile.displayName,
            givenName: profile.name.givenName,
            familyName: profile.name.familyName,
            avatar: profile.photos[0].value,
            email: profile.emails[0].value,
            slack_id: slack,
            admin_level: 0
          };
          data.avatar = md5(data.email);
          User.create(data).then(function (newUser, created) {
            if (!newUser) {
              return done(null, user);
            }
            if (newUser) {
              return done(null, newUser);
            }
          });
        });


      }
    })
  })
);
