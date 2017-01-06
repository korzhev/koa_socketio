const User = require('../models/user');
const passport = require('koa-passport');
const sendMail = require('../libs/sendMail');
const config = require('config');

exports.get = function() {
  this.body = this.render('register');
};

exports.post = function*() {

  var verifyEmailToken = Math.random().toString(36).slice(2, 10);
  var user = new User({
    email: this.request.body.email.toLowerCase(),
    displayName: this.request.body.displayName,
    password: this.request.body.password,
    verifiedEmail: false,
    verifyEmailToken: verifyEmailToken,
    verifyEmailRedirect: this.request.body.successRedirect
  });


  try {
    yield user.save();
  } catch(e) {
    if (e.name == 'ValidationError') {
      let errorMessages = "";
      for(let key in e.errors) {
        errorMessages += `${key}: ${e.errors[key].message}<br>`;
      }
      this.flash('error', errorMessages);
      this.redirect('/register');
      return;
    } else {
      this.throw(e);
    }
  }

  // We're here if no errors happened

  yield sendMail({
    template: 'verify-registration-email',
    to: user.email,
    subject: "Подтверждение email",
    link: config.server.siteHost + '/verify-email/' + verifyEmailToken
  });

  this.body = 'Вы зарегистрированы. Пожалуйста, загляните в почтовый ящик, там письмо с Email-подтверждением.';

};
