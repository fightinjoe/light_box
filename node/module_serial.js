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
	if(myPort.onMessage) myPort.onMessage(data);
}
 
function showPortClose() {
   console.log('port closed.');
}
 
function showError(error) {
   console.log('Serial port error: ' + error);
}

module.exports = myPort;