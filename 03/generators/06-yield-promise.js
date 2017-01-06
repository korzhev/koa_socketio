const fs = require('mz/fs');

// можно yield Promise, который execute выполняет и отсылает результат в генератор
function* read(path) {
  const stat = yield fs.stat(path);

  if (stat.isDirectory()) {
    const files = yield fs.readdir(path);
    return files;
  } else {
    const content = yield fs.readFile(path);
    return content;
  }
}


/**
 * Выполняет promise и возвращает его значение в генератор
 * @param generator
 * @param yieldValue
 */
function execute(generator, toGenerator) {

  let fromGenerator = generator.next(toGenerator);

  if (fromGenerator.done) {
    console.log(fromGenerator.value);
  } else {
    // must be promise
    let promise = fromGenerator.value;
    promise.then(
      result => execute(generator, result),
      err => generator.throw(err)
    );
  }

}

execute(read("."));
