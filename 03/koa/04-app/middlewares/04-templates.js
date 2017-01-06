// initialize template system early, to let error handler use them
// koa-views is a wrapper around many template systems!
// most of time it's better to use the chosen template system directly
const config = require('config');
const path = require('path');
const pug = require('pug'); // jade

module.exports = function*(next) {
  this.render = function(relPath, options) {
    return pug.renderFile(path.join(config.root, 'templates', relPath) + '.pug', options);
  };

  yield* next;
};
