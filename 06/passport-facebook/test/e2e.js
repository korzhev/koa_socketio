'use strict';

// java -jar selenium.jar

const wd = require('selenium-webdriver');
const config = require('config');
const By = wd.By;

describe('facebook', function() {
  let client, app, server;

  before(function() {
    client = new wd.Builder()
      .usingServer('http://localhost:4444/wd/hub')
      .withCapabilities({ browserName: 'chrome' })
      .build();

    app = require('..');
    server = app.listen(3000);

  });

  after(function() {
    server.close();
    client.quit();
  });

  it('logs in', function*() {

    yield client.get(config.server.siteHost + '/login/facebook');

    yield client.findElement(By.id('email')).sendKeys(config.providers.facebook.test.login);
    yield client.findElement(By.id('pass')).sendKeys(config.providers.facebook.test.password, wd.Key.RETURN);

    let needConfirm;
    yield client.wait(function*() {
       needConfirm = yield client.isElementPresent(By.name('__CONFIRM__'));
       if (needConfirm) return true;

       let url = yield client.getCurrentUrl();
       if (url.startsWith(config.server.siteHost)) {
         return true;
       }
    });

    if (needConfirm) {

      yield client.findElement(By.name('__CONFIRM__')).click();

      yield client.wait(function*() {
         let url = yield client.getCurrentUrl();
         if (url.startsWith(config.server.siteHost)) {
           return true;
         }
      });

    }

    yield client.wait(function*() {
       return yield client.isElementPresent(By.css('form[action="/logout"]'));
    });

  });


});
