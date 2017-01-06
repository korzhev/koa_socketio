const sendMail = require('./libs/sendMail');
const co = require('co');
const mongoose = require('./libs/mongoose');

co(function* () {

  let letter = yield* sendMail({
    template:     'hello.pug',
    subject:      "Привет",
    to:           'iliakan@gmail.com',
    name: "Ilya"
  });

  console.log(letter);

  mongoose.disconnect();

}).catch(console.error);
