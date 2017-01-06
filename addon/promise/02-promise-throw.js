// Что выведет?

const promise = new Promise((resolve, reject) => {

  throw new Error("WOPS");

});


promise.then(async function(result) {
  console.log("Result", result);
}, async function(err) {
  console.log("Caught", err);
});
