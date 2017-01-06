const zlib = require('zlib');
const fs = require('fs');

let fileIn = fs.createReadStream('bad.gz') // error, no such file!
let fileOut = fs.createWriteStream('test');

fileIn
  .on('error', cleanup)
  .pipe(zlib.createGunzip()) // error, bad format!
  .on('error', cleanup)
  .pipe(fileOut) // error, perm denied!
  .on('error', cleanup)
  .on('finish', () => {
    console.log("DONE");
  });

function cleanup() {
  /* close streams, unlink unfinished files */
  fileIn.destroy();
  fileOut.destroy();
  fs.unlink(fileOut, () => {});
}
