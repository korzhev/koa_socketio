// ЗАДАЧА - сделать readFile, возвращающее promise
// ЗАДАЧА - прочитать все файлы текущей директории, используя новый readfile
// (последовательно или параллельно - как считаете нужным)

const fs = require('mz/fs');

fs.readFile(__filename).then(console.log);
