var fs = require('fs');
var co = require('co');
var path = require('path');
var root = require('config').root;
var mongoose = require('../libs/mongoose');
var loadModels = require('../libs/loadModels');
var clearDatabase = require('../libs/clearDatabase');

module.exports = function() {

  return co(function*() {

    var args = require('yargs')
      .usage("gulp db:load --from fixture/init")
      .demand(['from'])
      .describe('from', 'file to import')
      .argv;

    var dbPath = path.join(root, args.from);

    console.log("loading db " + dbPath);

    yield* clearDatabase();
    yield* loadModels(require(dbPath));

    console.log("loaded db " + dbPath);

    mongoose.disconnect();
  });

};
