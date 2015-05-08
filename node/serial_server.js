var CONFIG = require('./config')

/*== Setup HTTP server ==*/
var servi = require('servi');
var html_server = new servi(true);  // servi instance
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

/*== Midi setup ==*/
var midi    = require('midi');
var midiOut = new midi.output();
// output.getPortCount();
// output.getPortName(0);
midiOut.openPort(0);



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

function rgbMessage( i, color ) {
	return { index: i, hex: 'rgb('+color[0]+','+color[1]+','+color[2]+')' };
}

var maxDistance = distance( CONFIG.colors.blue, CONFIG.colors.water ) * 0.5;

function findClosestColor( color ) {
	if( distance(color, CONFIG.colors.blue)   < maxDistance ) return "blue";
	if( distance(color, CONFIG.colors.yellow) < maxDistance ) return "yellow";
	if( distance(color, CONFIG.colors.red)    < maxDistance ) return "red";
	if( distance(color, CONFIG.colors.aqua)   < maxDistance ) return "aqua";
	if( distance(color, CONFIG.colors.green)  < maxDistance ) return "green";
	if( distance(color, CONFIG.colors.water)  < maxDistance ) return "water";
	return "black";
}

var lastColor = null;

function saveLatestData(data) {
    // console.log(socket ? 'no socket' : data);
    // data = JSON.parse(data);

    // check the message
    var pieces = data.match(/rgb (\d)1: (\d+,\d+,\d+)/);

	if( !pieces ) return;

	var index = parseInt(pieces[1])-7;
	var rgb   = pieces[2].split(',');

    console.log(index, rgb);

	color = findClosestColor(rgb);
    if( lastColor == color ) return;

    socket && socket.emit('RGB', rgbMessage( index, CONFIG.colors[color] ));

    var midiChannel = CONFIG.midiChannels[color == 'black' ? lastColor : color];
    midiOut.sendMessage([176, midiChannel, 1]);
    lastColor = color;
}
 
function showPortClose() {
   console.log('port closed.');
}
 
function showError(error) {
   console.log('Serial port error: ' + error);
}


// TODO: Time of day