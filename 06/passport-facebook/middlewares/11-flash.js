
module.exports = function* (next) {

  // keep previous flash
  let messages = this.session.messages || {};

  // clear all flash
  delete this.session.messages;

  this.flash = function(type, html) {

    if (type === undefined) {
      return messages || {};
    }
    if (html === undefined) {
      return messages[type] || [];
    }

    if (!this.session.messages) {
      this.session.messages = {};
    }

    if (!this.session.messages[type]) {
      this.session.messages[type] = [];
    }

    this.session.messages[type].push(html);
  };

  yield* next;

  // note that this.session can be null after other middlewares,
  // e.g. logout does session.destroy()
  if (!this.session) return;

  if (this.status == 302 && !this.session.messages) {
    // pass on the flash over a redirect
    this.session.messages = messages;
  }

};
