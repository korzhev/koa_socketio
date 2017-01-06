
const passport = require('koa-passport');

exports.post = function*(next) {

  const ctx = this;

  // @see node_modules/koa-passport/lib/framework/koa.js for passport.authenticate
  // it returns the middleware to delegate
  const middleware = passport.authenticate('local', function*(err, user, info) {
    // only callback-form of authenticate allows to assign ctx.body=info on 401
    // in passport.authenticate callback: this == global, so we need a wrapper to access context
    if (err) throw err;

    if (user === false) {
      ctx.status = 401;
      ctx.body = { error: info };
    } else {
      yield ctx.login(user);
      ctx.body = {
        user: user.getPublicFields()
      };
    }
  });

  yield* middleware.call(this, next);

};
