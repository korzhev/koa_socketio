// Альтернативное API mongoose: промисы
// Задача: создать юзеров параллельно?

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
  yield User.create({email: 'john@gmail.com'});
  yield User.create({email: 'pete@gmail.com'});
  yield User.create({email: 'mary@gmail.com'});

}

// ВОПРОС: что будет при ошибке валидации?
// структура ошибки валидации: err.errors
co(function*() {

  yield* createUsers();

  console.log("done");

}).catch(console.error).then(() => {
  mongoose.disconnect();
})
