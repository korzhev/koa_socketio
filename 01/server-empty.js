const {Server} = require('http');

// same as http.createServer((req, res) => ...)
const server = new Server((req, res) => {
  debugger;
  res.end("Hello");
});

// nodemon
server.listen(8000);
