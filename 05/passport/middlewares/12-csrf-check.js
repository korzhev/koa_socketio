
module.exports = function*(next) {
  // skip these methods
  if (this.method === 'GET' || this.method === 'HEAD' || this.method === 'OPTIONS') {
    return yield* next;
  }

  var checkCsrf = true;

  if (!this.req.user) {
    checkCsrf = false;
  }

  // If test check CSRF only when "X-Test-Csrf" header is set
  if (process.env.NODE_ENV == 'test' && !this.get('X-Test-Csrf')) {
    checkCsrf = false;
  }

  if (checkCsrf) {
    this.assertCSRF(this.request.body);
  } else {
    console.log("csrf check skipped");
  }

  yield* next;
};
