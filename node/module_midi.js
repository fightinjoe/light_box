/*== Midi setup ==*/
var midi    = require('midi');
var midiOut = new midi.output();

// output.getPortCount();
// output.getPortName(0);

midiOut.openPort(0);

module.exports = {
	send : function(channel, value, control) {
		console.log('sending MIDI');
		control = control || 176;
		midiOut.sendMessage([control, channel, value]);
	}
}