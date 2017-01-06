
exports.post = function*(next) {
  this.logout();

  this.session = null; // destroy session (!!!)

  this.redirect('/');
};
