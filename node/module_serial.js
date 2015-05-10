/*== Serial port listening ==*/
var serialport = require("serialport");
var SerialPort = serialport.SerialPort;
var portName   = process.argv[2] // alternatively pass in 'autoconnect'

var Serial = function(pName) {
	var o = {
		port : null,
		callback : null
	}

	this.o = o;

	function connect(name) {
		o.port = new SerialPort(name, {
		   baudRate: 9600,
		   parser: serialport.parsers.readline("\r\n")
		});	

		o.port.on('open', showPortOpen);
		o.port.on('data', saveLatestData);
		o.port.on('close', showPortClose);
		o.port.on('error', showError);

		o.port.addEventListener = function( fn ) {
			o.port.onMessage = fn;
		}
	}

	function autoconnect() {
		serialport.list(function (err, ports) {
			ports.forEach(function(port) {
				if( port.comName.match(/\/dev\/cu.usbmodem/) ) return connect(port.comName);
			});
		});
	}

	function showPortOpen() {
	   console.log('port open. Data rate: ' + o.port.options.baudRate);
	}

	function saveLatestData(data) {
		if(o.callback) o.callback(data);
	}
	 
	function showPortClose() {
	   console.log('port closed.');
	}
	 
	function showError(error) {
	   console.log('Serial port error: ' + error);
	}

	function init() {
		pName.match('autoconnect') ? autoconnect() : connect(pName);
	}

	init.call(this);
}

// list serial ports:
Serial.listPorts = function( indent ) {
	serialport.list(function (err, ports) {
		ports.forEach(function(port) {
			console.log(indent + port.comName);
		});
	});
}

if( !portName ) {
	console.log("No port name was supplied.  Please supply one of the following ports as the second parameter.");
	Serial.listPorts('  ');
	return;
}

module.exports = new Serial(portName);