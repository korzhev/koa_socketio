
module.exports = function*(next) {
  try {
    // first, do the middleware, maybe authorize user in the process
    yield* next;
  } finally {
    // then if we have a user, set XSRF token
    if (this.req.user) {
      try {
        // if this doesn't throw, the user has a valid token in cookie already
        this.assertCsrf({_csrf: this.cookies.get('XSRF-TOKEN') });
      } catch(e) {
        // error occurs if no token or invalid token (old session)
        // then we set a new (valid) one
        this.cookies.set('XSRF-TOKEN', this.csrf, { httpOnly: false, signed: false });
      }
    }
  }
};
