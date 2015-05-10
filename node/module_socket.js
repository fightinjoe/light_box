/*== Setup socket server ==*/
var app = require('http').createServer(handler);
var io  = require('socket.io')(app);
var fs  = require('fs');

app.listen(8081);

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

var socket = null
io.on('connection', function (s) {
  socket = s;
  s.sendMidi = function(h){
    s.sendMessage([ s.cmd, s.channel, s.val]);
  }
});

// function rgbMessage( i, rgb ) {
//   return { index: i, hex: 'rgb('+rgb[0]+','+rgb[1]+','+rgb[2]+')' };
// }

// module.exports = socket;
module.exports = {
  sendRGB : function(rgb, i) {
    var message = { index: i, rgb: 'rgb('+rgb[0]+','+rgb[1]+','+rgb[2]+')' };
    socket && socket.emit('RGB', message);
  }
}