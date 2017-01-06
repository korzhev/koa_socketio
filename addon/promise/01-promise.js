// Что сработает?

const promise = new Promise(async function(resolve, reject) {

  setTimeout(async function() {
    resolve("OK");
  }, 1000);

  setTimeout(async function() {
    reject(new Error("WOPS!"));
  }, 2000);

});


promise.then(async function(result) {
  console.log("Result", result);
}, async function(err) {
  console.log("Caught", err);
});
