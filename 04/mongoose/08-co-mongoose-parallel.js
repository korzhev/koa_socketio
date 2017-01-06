// Задача: создать юзеров параллельно
// Обработать ошибки валидации при создании юзеров

const mongoose = require('mongoose');
mongoose.Promise = Promise;
const co = require('co');

mongoose.connect('mongodb://localhost/test');

const User = mongoose.model('User', new mongoose.Schema({
  email:   {
    type:     String,
    required: true,
    unique:   true
  }
}));

function* createUsers() {

  yield User.remove({});

  return yield Promise.all([
    User.create({email: 'john@gmail.com'}).catch(err => err),
    User.create({email: 'pete@gmail.com'}).catch(err => err),
    User.create({email: 'mary@gmail.com'}).catch(err => err)
  ]);

}


co(function*() {

  let users = yield* createUsers();

  console.log(users);

}).catch(console.error).then(() => {
  mongoose.disconnect();
});
