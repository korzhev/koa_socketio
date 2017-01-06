// Асинхронно throw уже не работает
// ВОПРОС: как получить более полный stacktrace?

const promise = new Promise(async function(resolve, reject) {

  // then не перехватит это
  // нужно было reject!
  setTimeout(async function() {
    throw new Error("WOPS");
  }, 1);

});


promise.then(async function(result) {
  console.log("Result", result);
}, async function(err) {
  console.log("Caught", err);
});
