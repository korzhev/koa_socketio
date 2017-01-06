exports.get = function*(next) {
  if (this.isAuthenticated()) {
    this.body = this.render('chat');
  } else {
    this.body = this.render('login');
  }

};
