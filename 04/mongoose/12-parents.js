// Один-ко-многим: Вывод юзера с детьми

const mongoose = require('mongoose');
mongoose.Promise = Promise;
const co = require('co');

mongoose.connect('mongodb://localhost/test');

const userSchema = new mongoose.Schema({
  email: {
    type:     String,
    required: 'Укажите email', // true for default message
    unique:   true
  },
  parent: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'User'
  }
}, {
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true // for console.log, to output children
  }
});

userSchema.virtual('children', {
  ref: 'User', // The model to use
  localField: '_id', // Find people where `localField`
  foreignField: 'parent' // is equal to `foreignField`
});

const User = mongoose.model('User', userSchema);

co(function* () {

  yield User.remove({});

  let pete = yield User.create({email: 'pete@gmail.com'});

  yield User.create({
    email: 'john@gmail.com',
    parent: pete
  });

  yield User.create({
    email: 'ann@gmail.com',
    parent: pete
  });

  pete = yield User.findOne({
    email: 'pete@gmail.com'
  }).populate('children');

  console.log(pete);

}).catch(console.error).then(() => mongoose.disconnect());
