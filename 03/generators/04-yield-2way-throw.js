// демо ошибки

function* gen() {
  console.log("Hello");

  try {
    const result = yield new Promise((resolve, reject) => {
      setTimeout(reject, 1000, 'could not resolve host');
    });
    console.log(`success to load resource: ${result}`);
  } catch (err) {
    console.error(`fail to load resource. ${err}`);
  }
}

const generator = gen();

let next = generator.next();

console.log(next);
// { value: Promise { <pending> }, done: false }

// здесь мы обрабатываем запрос и передаём ответ *обратно* в генератор
next.value
  .then(result => generator.next(result))
  .catch(err => generator.throw(err));
