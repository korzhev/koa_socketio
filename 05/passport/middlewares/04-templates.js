// initialize template system early, to let error handler use them
// koa-views is a wrapper around many template systems!
// most of time it's better to use the chosen template system directly
var pug = require('pug');
var config = require('config');
var path = require('path');

module.exports = function* (next) {

  var ctx = this;

  /* default helpers */
  this.locals = {
    /* at the time of this middleware, user is unknown, so we make it a getter */
    get user() {
      return ctx.req.user; // passport sets this
    },

    get flash() {
      return ctx.flash();
    }
  };

  this.locals.csrf = function() {
    // function, not a property to prevent autogeneration
    // pug touches all local properties
    return ctx.req.user ? ctx.csrf : null;
  };

  this.render = function(templatePath, locals) {
    locals = locals || {};
    // use inheritance for all getters to work
    var localsFull = Object.create(this.locals);

    for(var key in locals) {
      localsFull[key] = locals[key];
    }

    var templatePathResolved = path.join(config.template.root, templatePath + '.pug');

    return pug.renderFile(templatePathResolved, localsFull);
  };

  yield* next;

};
