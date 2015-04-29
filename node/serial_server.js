/*== Setup HTTP server ==*/
var servi = require('servi');
var html_server = new servi(true); // servi instance
html_server.port(8080);             // port number to run the server on
 
// configure the server's behavior:
html_server.serveFiles("../http");     // serve static HTML from public folder
// html_server.route('/data', sendData); // route requests for /data to sendData()
// now that everything is configured, start the server:
html_server.start();



/*== Setup socket server ==*/
var app = require('http').createServer(handler);
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(80);

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

var socket = null;
io.on('connection', function (s) {
	socket = s;
  // socket.emit('news', { hello: 'world' });
  // socket.on('my other event', function (data) {
  //   console.log(data);
  // });
});



/*== Serial port listening ==*/
var serialport = require("serialport");
var SerialPort = serialport.SerialPort;
var portName   = process.argv[2]

if( !portName ) {
	console.log("No port name was supplied.  Please supply one of the following ports as the second parameter.");
	listPorts('  ');
	return;
}

var myPort = new SerialPort(portName, {
   baudRate: 9600,
   parser: serialport.parsers.readline("\r\n")
});

myPort.on('open', showPortOpen);
myPort.on('data', saveLatestData);
myPort.on('close', showPortClose);
myPort.on('error', showError);

// list serial ports:
function listPorts( indent ) {
	serialport.list(function (err, ports) {
		ports.forEach(function(port) {
			console.log(indent + port.comName);
		});
	});
}

function showPortOpen() {
   console.log('port open. Data rate: ' + myPort.options.baudRate);
}
 
function saveLatestData(data) {
   console.log(socket ? 'no socket' : data);
   // data = JSON.parse(data);
   data = data.split(',');
   socket && socket.emit('RGB', { hex: 'rgb('+data[0]+','+data[1]+','+data[2]+')' });
}
 
function showPortClose() {
   console.log('port closed.');
}
 
function showError(error) {
   console.log('Serial port error: ' + error);
}