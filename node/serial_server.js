/*
36,83,109 - blue
105,90,40 - yellow
146,54,45 - red
40,98,89  - aqua
58,117,51 - green
34,89,102 - blue
104,69,69 - pink
*/

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

function distance(a, b) {
	return Math.sqrt( Math.pow(a[0]-b[0],2) + Math.pow(a[1]-b[1],2) + Math.pow(a[2]-b[2],2));
} 

function rgbMessage( color ) {
	return { hex: 'rgb('+color[0]+','+color[1]+','+color[2]+')' };
}

var colors = {
	blue:   [36,83,109],
	yellow: [105,90,40],
	red:    [146,54,45],
	aqua:   [40,98,89],
	green:  [58,117,51],
	blue:   [34,89,102],
	pink:   [104,69,69],
	black:  [0,0,0]
};

var maxDistance = distance( colors.red, colors.pink ) * 0.5;

function findClosestColor( color ) {
	if( distance(color, colors.blue)   < maxDistance ) return colors.blue;
	if( distance(color, colors.yellow) < maxDistance ) return colors.yellow;
	if( distance(color, colors.red)    < maxDistance ) return colors.red;
	if( distance(color, colors.aqua)   < maxDistance ) return colors.aqua;
	if( distance(color, colors.green)  < maxDistance ) return colors.green;
	return colors.black;
}

var lastColor = null;

function saveLatestData(data) {
   console.log(socket ? 'no socket' : data);
   // data = JSON.parse(data);
   data = data.split(',');
   socket && socket.emit('RGB', rgbMessage( findClosestColor(data) ));
}
 
function showPortClose() {
   console.log('port closed.');
}
 
function showError(error) {
   console.log('Serial port error: ' + error);
}