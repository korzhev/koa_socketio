var koa = require('koa');
var app = koa();
var mount = require('koa-mount');
var Router = require('koa-router');


// /callback
var webmoneyRouter = new Router();

webmoneyRouter.get('/callback', function*(next) {
  this.body = "Webmoney " + this.path;
});

var paypalRouter = new Router();

paypalRouter.get('/callback', function*(next) {
  this.body = "Paypal " + this.path;
});


function* payment(next) {
  // ...

  // /webmoney/callback
  yield* mount('/webmoney', webmoneyRouter.routes()).call(this, next);
  yield* mount('/paypal', paypalRouter.routes()).call(this, next);
}

// /payment/webmoney/callback
app.use(mount('/payment', payment));

app.listen(3000);
