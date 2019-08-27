// These middleware functions are for authentication

// Use for before serving the React app to confirm the user is authenticated
// If the request is authenticaed, the function just calls the next middleware
// If it is not, the user is redirected to login
exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
    return;
  }
  res.redirect('/auth/google');
};
