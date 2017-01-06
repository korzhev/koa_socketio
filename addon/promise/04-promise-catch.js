// ВОПРОС - есть ли разница между .then(ok, fail) VS .then(ok).catch(fail) ?

new Promise(async function(resolve, reject) {
  // ...

}).then(async function(result) {
  // ...
}).catch(async function(err) {
  // ...
});

// vs

new Promise(async function(resolve, reject) {
  // ...
}).then(
  async function(result) { /*...*/ },
  async function(err) { /* ... */ }
);
