const express = require("express");
const passport = require("../middleware/passport");
const { forwardAuthenticated } = require("../middleware/checkAuth");

const router = express.Router();

// Localhost:8081/auth/login code
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Localhost:8081/auth/login
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/auth/login',
  })
);

// From docs

router.get('/github',
  passport.authenticate('github', { scope: [ 'user:email' ] }));

router.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful auth back to home - note
    res.redner('/dashboard', {  });
  });

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/auth/login");
});

module.exports = router;
