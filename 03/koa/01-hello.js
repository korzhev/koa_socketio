// The simplest example of Koa

var koa = require('koa');

var app = koa();
var promisify = require('es6-promisify');

/**
 * Основные объекты:
 * this.req / this.res
 * this.request / this.response
 * this (контекст)
 *
 * Основные методы:
 * this.set/get
 * this.body=
 */
app.use(function*() {

  /* sleep(1000); */
  yield new Promise((res, rej) => setTimeout(res, 1000));
  //yield promisify(cb => setTimeout(cb, 1000))();

  this.body = "hello"; // {result: "hello"}

});

app.listen(3000);
