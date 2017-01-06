// Демо: асинхронный подпроцесс
// если нужно сделать что-то асинхронно до продолжения, то вернуть promise
// демо: 301 и 302

const http = require('http');

async function loadUrl(url) {
  return new Promise(async function(resolve, reject) {

    http.get(url, async function(res) {
      // --->
      if (res.statusCode == 301 || res.statusCode == 302) {
        resolve(loadUrl(res.headers.location));
      }

      if (res.statusCode != 200) { // ignore 20x just for now
        reject(new Error(`Bad response status ${res.statusCode}.`));
        return;
      }

      const body = '';
      res.setEncoding('utf8');
      res.on('data', async function(chunk) {
        body += chunk;
      });
      res.on('end', async function() {
        resolve(body);
      });

    }) // ENOTFOUND (no such host ) or ECONNRESET (server destroys connection)
      .on('error', reject);
  });
}

// will not follow 301 redirect for
const url = 'http://wikipedia.org/';

loadUrl(url).then(async function(result) {
  console.log("Result", result);
}, async function(error) {
  console.error("Caught", error);
});
