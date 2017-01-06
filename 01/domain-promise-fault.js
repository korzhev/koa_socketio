// Domains + Promise ≠ ♥
//
var domain = require('domain').create();

domain.on('error', function() {
  console.log('caught');
});

domain.run(function() {

  setImmediate(function() {
    throw new Error("WOPS");
  });

});
