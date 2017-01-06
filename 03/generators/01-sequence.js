// Generator Function
function* generateSequence(start, end) {
  for (let i = start; i <= end; i++) {
    yield i;
  }
}

// Generator
const generator = generateSequence(2, 5);
console.log(generator); // объект-генератор

while(true) {
  const next = generator.next();

  console.log(next);

  if (next.done) break;
}

/*
 { value: 1, done: false }
 { value: 2, done: false }
 { value: 3, done: false }
 { value: undefined, done: true }
 */

// ИЛИ так:

for(let value of generateSequence(3, 5)) {
  console.log(value);
}

/*
1
2
3
 */
