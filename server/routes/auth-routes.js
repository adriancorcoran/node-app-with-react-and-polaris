const router = require("express").Router();
// adrian
// const passport = require('passport');

// Auth login
// adrian
// router.get('/login', (req, res) => {
//   res.send('login');
// });

// Auth logout
// adrian
// router.get('/logout', (req, res) => {
//   req.logout();
//   res.redirect('/');
// });

// Get the currently logged in user
// adrian
// router.get('/current-user', (req, res) => {
//     res.json(req.user);
// });

// Auth with google+
// adrian
// router.get('/google', passport.authenticate('google', {
//   scope:  [
//     'https://www.googleapis.com/auth/userinfo.profile',
//     'https://www.googleapis.com/auth/userinfo.email'
//   ]
// }));

// adrian
// router.get('/google/callback', passport.authenticate('google'), (req, res) => {
//   res.redirect('/');
// });

module.exports = router;
