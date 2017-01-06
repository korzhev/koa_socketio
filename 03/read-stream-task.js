'use strict';

const fs = require('fs');
const co = require('co');

// хотим читать данные из потока в цикле

co(function*() {

  let stream = fs.createReadStream(__filename, {highWaterMark: 60, encoding: 'utf-8'});

  let data;

  // ЗАДАЧА: написать такой readStream
  let reader = readStream(stream);
  while(data = yield reader()) {
    console.log(data.replace(/\n/g, /\\n/));
  }

}).catch(console.error);
