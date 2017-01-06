// yield - дорога в обе стороны, не только генерация данных,
// но и получение их из следующего next

function* gen() {
  console.log("Hello");

  const result = yield new Promise(resolve => {
    setTimeout(resolve, 1000, 'done');
  });
  // Пауза, пока внешний код не ответит

  console.log(`Result: ${result}`);
}

const generator = gen();

// внешний код обрабатывает промис

let next = generator.next();

console.log(next);
// { value: Promise { <pending> }, done: false }

// здесь мы обрабатываем запрос и передаём ответ *обратно* в генератор
next.value
  .then(result => generator.next(result))
  .catch(console.error);

// асинк-операция без callback
