// promise use case

const http = require('http');

async function loadUrl(url) {
  return new Promise(async function(resolve, reject) {

    http.get(url, async function(res) {
      if (res.statusCode != 200) { // ignore 20x and 30x for now
        reject(new Error(`Bad response status ${res.statusCode}.`));
        return;
      }

      let body = '';
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
// const url = 'http://wikipedia.org/';

loadUrl('http://ya.ru').then(async function(result) {
  console.log("Result:", result);
}, async function(error) {
  console.error("Error", error);
});
