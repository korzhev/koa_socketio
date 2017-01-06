'use strict';

const juice = require('juice');
const config = require('config');
const fs = require('fs');
const path = require('path');
const AWS = require('aws');
const pug = require('pug');

const nodemailer = require('nodemailer');
const htmlToText = require('nodemailer-html-to-text').htmlToText;
const stubTransport = require('nodemailer-stub-transport');
const SesTransport = require('nodemailer-ses-transport');
const SMTPTransport = require('nodemailer-smtp-transport');

const transportEngine = (process.env.NODE_ENV == 'test' || process.env.MAILER_DISABLED) ? stubTransport() :
  config.mailer.transport == 'aws' ? new SesTransport({
    ses: new AWS.SES(),
    rateLimit: 50
  }) : new SMTPTransport({
  service: "Gmail",
  debug: true,
  auth: {
    user: config.mailer.gmail.user,
    pass: config.mailer.gmail.password
  }
});

const transport = nodemailer.createTransport(transportEngine);

transport.use('compile', htmlToText());

module.exports = function*(options) {

  var message = {};

  var sender = config.mailer.senders[options.from || 'default'];
  if (!sender) {
    throw new Error("Unknown sender:" + options.from);
  }

  var locals = Object.create(options);

  locals.config = config;
  locals.sender = sender;

  var letterHtml = pug.renderFile(options.template, locals);
  letterHtml = yield juice(letterHtml);

  message.from = {
    name: sender.fromName,
    address: sender.fromEmail
  };

  message.to = (typeof options.to == 'string') ? {address: options.to} : options.to;

  if (process.env.MAILER_REDIRECT) {
    message.to = {address: sender.fromEmail};
  }

  if (!message.to.address) {
    throw new Error("No email for recepient, message options:" + JSON.stringify(options));
  }

  message.html = letterHtml;

  message.subject = options.subject;

  message.headers = options.headers;

  let result = yield transport.sendMail(message);

}

if (process.env.MAILER_DISABLED) {
  console.log("MAILER DISABLED");
}
