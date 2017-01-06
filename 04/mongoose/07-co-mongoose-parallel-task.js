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

// ПЕРЕПИСАТЬ
function* createUsers() {

  yield User.remove({});

  yield User.create({email: 'john@gmail.com'});
  yield User.create({email: 'pete@gmail.com'});
  yield User.create({email: 'mary@gmail.com'});
}

co(function*() {

  // массив юзеров ИЛИ ошибок при их создании
  let users = yield* createUsers();

  console.log(users);

}).catch(console.error).then(() => {
  mongoose.disconnect();
})
