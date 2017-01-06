// Много-ко-многим, populate

const mongoose = require('mongoose');
mongoose.Promise = Promise;
const co = require('co');

mongoose.connect('mongodb://localhost/test');

// вместо MongoError будет выдавать ValidationError (проще ловить и выводить)

const userSchema = new mongoose.Schema({
  email: {
    type:     String,
    required: 'Укажите email', // true for default message
    unique:   true
  },
  friends: [{
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'User'
  }]
});

const User = mongoose.model('User', userSchema);

co(function* () {

  yield User.remove({});

  let pete = yield User.create({email: 'pete@gmail.com'});
  // ..
  // ..
  let john = yield User.create({email: 'john@gmail.com'});
  let ann = yield User.create({email: 'ann@gmail.com'});

  pete.friends = [john, ann];

  // MongooseArray, not Array
  pete.friends.addToSet(john);

  console.log(pete);

  yield pete.save();

  pete = yield User.findOne({
    email: 'pete@gmail.com'
  }).populate('friends');

  console.log(pete.friends[0]);

  // deep (multi-level) populate: http://mongoosejs.com/docs/populate.html#deep-populate

}).catch(console.error).then(() => mongoose.disconnect());
