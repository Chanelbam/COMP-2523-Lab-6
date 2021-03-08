const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const userController = require("../controllers/userController");
const GitHubStrategy = require('passport-github2').Strategy;

const localLogin = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  (email, password, done) => {
    const user = userController.getUserByEmailIdAndPassword(email, password);
    return user
      ? done(null, user)
      : done(null, false, {
          message: "Your login details are not valid. Please try again",
        });
  }
);

const gitHubLogin = new GitHubStrategy(
  {
    clientID: process.env.clientID,
    clientSecret: process.env.clientSecret,
    callbackURL: 'http://localhost:8000/auth/github/callback',
  },
  (accessToken, refreshToken, profile, done) => {
      userController.gitHubFind({ githubId: profile.id }, function (err, user) {
        return done(err, user);
      });
    }
    );

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  let user = userController.getUserById(id);
  if (user) {
    done(null, user);
  } else {
    done({ message: "User is not found" }, null);
  }
});

module.exports = passport.use(localLogin).use(gitHubLogin);
