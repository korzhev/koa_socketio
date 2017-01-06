'use strict';

// long stack trace (+clarify from co) if needed
if (process.env.TRACE) {
  require('./libs/trace');
}

const koa = require('koa');
const app = koa();

const config = require('config');
const mongoose = require('./libs/mongoose');

// keys for in-koa KeyGrip cookie signing (used in session, maybe other modules)
app.keys = [config.secret];

var path = require('path');
var fs = require('fs');
var middlewares = fs.readdirSync(path.join(__dirname, 'middlewares')).sort();

middlewares.forEach(function(middleware) {
  app.use(require('./middlewares/' + middleware));
});

// ---------------------------------------

// can be split into files too
const Router = require('koa-router');
const _ = require('lodash');

const router = new Router({
  prefix: '/users'
});

const User = require('./libs/user');

router
  .param('userById', function*(id, next) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      this.throw(404);
    }

    this.userById = yield User.findById(id);

    if (!this.userById) {
      this.throw(404);
    }

    yield* next;

  })
  .post('/', function*() {
    let user = yield User.create(_.pick(this.request.body, User.publicFields));

    this.body = _.pick(user, User.publicFields);
  })
  .get('/:userById', function*() {
    this.body = _.pick(this.userById, User.publicFields);
  })
  .del('/:userById', function*() {
    yield this.userById.remove();
    this.body = 'ok';
  })
  .get('/', function*() {
    let users = yield User.find({});

    this.body = users.map(user => _.pick(user, User.publicFields));
  });


app.use(router.routes());

app.listen(3000);
