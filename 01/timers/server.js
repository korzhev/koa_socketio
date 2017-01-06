const {createServer} = require('http');

const server = createServer(function(req, res) {

  switch (req.url) {

  case '/shutdown':
    res.end('shutting down');

    this.close(() => {
      console.log("closed");
    });

    break;

  default:
    res.end('up and running!');
  }

});

server.timeout = 1;

server.listen(3000);

// каждые 5 сек смотрим - нет ли утечек?
// было много версий ноды с утечками, они ещё есть
const timer = setInterval(() => {
  console.log(process.memoryUsage());
}, 5000);

timer.unref();
