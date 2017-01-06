/* global describe, it, context, before, after */


const app = require('../server');
const request = require('request-promise').defaults({
  simple: false,
  resolveWithFullResponse: true
});

const User = require('../models/user');

const serverURL = 'http://localhost:3333';

function getURL(path) {
  return `${serverURL}${path}`;
}

function* loginUser(userData) {
  const jar = request.jar();

  const response = yield request({
      method: 'post',
      url: getURL('/login'),
      json: true,
      body: userData,
      jar
  });

  return {response, jar};
}

const existingUserData = {
  email: 'john@test.ru',
  displayName: 'John',
  password: '123456'
};
const newUserData = {
  email: 'alice@test.ru',
  displayName: 'Alice',
  password: '123456'
};

let existingUser;
let server;

describe('Passport authorization', () => {
  before(function* () {
    yield User.remove({});
    existingUser = yield User.create(existingUserData);
    server = app.listen(3333);
  });

  after(done => {
    server.close(done);
  });

  describe('main page', () => {
    context('for anonymous user', () => {
      it('should return login page', function* () {
        const response = yield request({
            method: 'get',
            url: getURL('/')
        });

        response.statusCode.should.eql(200);

        /Please sign in/.test(response.body).should.be.eql(true);
      });
    });
    context('for logged user', () => {
      it('should return welcome page', function* () {
        const {jar} = yield* loginUser(existingUserData);

        const response = yield request({
            method: 'get',
            url: getURL('/'),
            jar
        });

        response.statusCode.should.eql(200);

        /You are logged in\./.test(response.body).should.be.eql(true);
      });
    });
  });

  describe('login flow', () => {
    context("user doesn't exist", () => {
      it('should return 401', function* () {
        const response = yield request({
            method: 'post',
            url: getURL('/login'),
            json: true,
            body: newUserData
        });

        response.statusCode.should.be.eql(401);
        response.body.should.deepEqual({
          error: {
            message: 'Нет такого пользователя или пароль неверен.'
          }
        });
      });
    });

    context('user exists', () => {
      it('should login user', function* () {
        const jar = request.jar();

        const response = yield request({
            method: 'post',
            url: getURL('/login'),
            json: true,
            body: existingUserData,
            jar
        });

        response.statusCode.should.eql(200);
        response.body.should.deepEqual({
          user: {
            displayName: 'John', email: 'john@test.ru'
          }
        });

        const cookieNames = jar.getCookies(serverURL).map(cookie => cookie.key);
        cookieNames.should.containDeep(['sid']);
      });
    });
  });

  describe('logout flow', () => {
    context('when user logged in', () => {
      it('should remove session', function* () {
        const {jar} = yield* loginUser(existingUserData);

        const response = yield request({
            method: 'post',
            url: getURL('/logout'),
            json: true,
            followRedirect: false,
            jar
        });

        const cookieNames = jar.getCookies(serverURL).map(cookie => cookie.key);

        response.statusCode.should.eql(302);
        cookieNames.should.not.containEql('sid');
      });
    });
  })
});
