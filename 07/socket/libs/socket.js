let Cookies = require('cookies');
let config = require('config');
let mongoose = require('mongoose');
let co = require('co');
let User = require('../models/user');

let socketIO = require('socket.io');
let socketEmitter = require('socket.io-emitter');

let redisClient = require('redis').createClient({ host: 'localhost', port: 6379 });

let socketRedis = require('socket.io-redis');

let sessionStore = require('./sessionStore');

function socket(server) {
  let io = socketIO(server);

  io.adapter(socketRedis(redisClient));

  io.use(function(socket, next) {
    let handshakeData = socket.request;

    let cookies = new Cookies(handshakeData, {}, config.keys);

    let sid = 'koa:sess:' + cookies.get('sid');

    co(function*() {

      let session = yield* sessionStore.get(sid, true);

      console.log(session);
      if (!session) {
        throw new Error("No session");
      }

      if (!session.passport && !session.passport.user) {
        throw new Error("Anonymous session not allowed");
      }

      // if needed: check if the user is allowed to join
      socket.user = yield User.findById(session.passport.user);

      // if needed later: refresh socket.session on events
      socket.session = session;

      // on restarts may be junk sockedIds
      // no problem in them
      session.socketIds = session.socketIds ? session.socketIds.concat(socket.id) : [socket.id];

      console.log(session.socketIds);
      yield* sessionStore.save(sid, session);

      socket.on('disconnect', function() {
        co(function* clearSocketId() {
          let session = yield* sessionStore.get(sid, true);
          if (session) {
            session.socketIds.splice(session.socketIds.indexOf(socket.id), 1);
            yield* sessionStore.save(sid, session);
          }
        }).catch(function(err) {
          console.error("session clear error", err);
        });
      });

    }).then(function() {
      next();
    }).catch(function(err) {
      next(err);
    });

  });

  io.on('connection', function (socket) {
    socket.emit('message', 'hello', function(response) {
      console.log("delivered", response);
    });
  });
}


socket.emitter = socketEmitter(redisClient);

module.exports = socket;
