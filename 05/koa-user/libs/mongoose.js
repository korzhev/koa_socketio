const mongoose = require('mongoose');
mongoose.Promise = Promise;

const beautifyUnique = require('mongoose-beautiful-unique-validation');

// вместо MongoError будет выдавать ValidationError (проще ловить и выводить)
mongoose.plugin(beautifyUnique);
// mongoose.set('debug', true);

mongoose.connect('mongodb://localhost/test', {
  server: {
    socketOptions: {
      keepAlive: 1
    },
    poolSize: 5
  }
});

module.exports = mongoose;
