/*== Serial port listening ==*/
var serialport = require("serialport");
var SerialPort = serialport.SerialPort;
var portName   = process.argv[2] // alternatively pass in 'autoconnect'

var Serial = function(pName) {
	var o = {
		name : null,
		port : null,
		callback : null,
		timeSinceLast : Date.now()
	}

	this.o = o;

	function connect(name) {
		o.name = (name || o.name);
		o.port = new SerialPort(o.name, {
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

	this.reload = function() {
		connect(o.name);
	}

	function autoconnect() {
		var self = this;
		serialport.list(function (err, ports) {
			ports.forEach(function(port) {
				if( port.comName.match(/\/dev\/cu.usbmodem/) ) {
					console.log('SERIAL', 'connecting to port', port);
					return connect(port.comName);
				}
			});
		});
	}

	function showPortOpen() {
	   console.log('port open. Data rate: ' + o.port.options.baudRate);
	}

	function saveLatestData(data) {
		o.timeSinceLast = Date.now();
		if(o.callback) o.callback(data);
	}
	 
	function showPortClose() {
	   console.log('port closed.');
	}
	 
	function showError(error) {
	   console.log('Serial port error: ' + error);
	}

	this.checkHealth = function() {
		var duration = Date.now() - o.timeSinceLast;
		console.log('SERIAL', 'check health - since last message:', duration);
		return duration;
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