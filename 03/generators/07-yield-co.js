const fs = require('mz/fs');

function* read(path) {
  const stat = yield fs.stat(path);

  if (stat.isDirectory()) {
    const files = yield fs.readdir(path);
    return files;
  }

  const content = yield fs.readFile(path, 'utf-8');
  return content;
}

const co = require('co');

co(function*() {
  // For Async/Await compat
  // DO:
  //   yield promise
  // DON'T:
  //   yield thunk -> es6-promisify
  //   [] -> Promise.all
  //   {} -> [a, b, c] = Promise.all
  //   yield generator -> yield*
  //   yield generator function -> yield* с запуском generator function

  const result = yield* read('.');
  console.log(result);

  // return result

}).then(console.log, console.log);
