const fs = require('fs');

const fileIn = fs.createReadStream(__filename, {highWaterMark: 100});

const fileOut = fs.createWriteStream(__filename + ".out", {highWaterMark: 100});

// data -> write
// end -> end
fileIn.pipe(fileOut);

// I/O error can happen before that?
fileIn.on('error', cleanup);
fileOut.on('error', cleanup);

function cleanup() {
  fs.unlink(fileOut.path, err => { // eslint-disable-line
    /* it's ok if no such file, ignore the error */
  });

  // close both files (otherwise won't be closed! no close event!)
  fileIn.destroy();
  fileOut.destroy();
}
