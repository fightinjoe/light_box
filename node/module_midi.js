/*== Midi setup ==*/
var midi    = require('midi');
var midiOut = new midi.output();

// output.getPortCount();
// output.getPortName(0);

midiOut.openPort(0);

var paused = false;

var send = function(channel, value, control) {
	try {
		control = control || 176;
		var message = [control, channel, value];
		
		console.log('sending MIDI', message);
		midiOut.sendMessage( message );
	} catch(e) {
		console.log("MIDI ERROR", e);
		reload();
	}
}

var reload = function() {
	if(paused) return;
	paused = true;

	console.log('!!! reloading MIDI connection !!!')
	midiOut.closePort(0);
	midiOut.closePort();
	midiOut.openPort(0);

	paused = false;
}

module.exports = {
	send   : send,
	reload : reload
}