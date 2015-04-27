var app = require('http').createServer(handler);
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(80);


/*== Setup HTTP server ==*/
var servi = require('servi');
var html_server = new servi(true); // servi instance
html_server.port(8080);             // port number to run the server on
 
// configure the server's behavior:
html_server.serveFiles("../http");     // serve static HTML from public folder
// html_server.route('/data', sendData); // route requests for /data to sendData()
// now that everything is configured, start the server:
html_server.start();

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});