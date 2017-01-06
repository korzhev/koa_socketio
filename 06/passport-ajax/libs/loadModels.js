const mongoose = require('./mongoose');

module.exports = function* (models) {

  let promises = [];
  for (let name in models) {
    let modelObjects = models[name];

    for (let modelObject of modelObjects) {
      promises.push(mongoose.model(name).create(modelObject));
    }
  }

  yield Promise.all(promises);

};
