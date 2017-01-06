let koa = require('koa');

let app = koa();

app.use(function*() {
  this.throw(404, "Test me");
});

app.listen(8080);
