var CONFIG = require('./config');
var SOCKET = require('./module_socket');
var MIDI   = require('./module_midi');

var LightChannel = function( opts ) {
	var o = {
		channel : opts.channel || 1,
		state   : CONFIG.states.active,
		awake   : false,
		color   : null
	}

	this.o = o;

	// This is the primary loop that reacts to data coming in from the sensors.
	// rgb is an array of three values
	this.onMessage = function(rgb) {
		// ignore the time of day and RGB sensor data if party mode is engaged
		if( o.state == CONFIG.states.party ) return;

		var d = isWorkingHours();

		d ? handleColor(rgb, d) : handleSleep(rgb);
	}

	function isWorkingHours() {
		var d = new Date();

		if( d.getHours() <  CONFIG.hours[d.getDay()].min ) return false;
		if( d.getHours() >= CONFIG.hours[d.getDay()].max ) return false;

		return d;
	}

	function handleColor(rgb, d) {
		// Finds the color closest to the app specifics, returns null otherwise
		color = findClosestColor(rgb);

		// If the app doesn't match a color, then use the time of day color
		if( !color ) color = getTimeOfDayColor(d);

		// don't issue any change commands if the color hasn't changed.
	    if( o.color == color ) return;

	    sendSocketColor(color);
	    sendColor(color);
	}

	function handleSleep() {
		color = 'blueout';

		if( color == o.color ) return;

		sendSocketColor(color);
		sendColor(color);
	}

	function sendSocketColor(color) {
	    var rgb = CONFIG.colors[color] || CONFIG.timeOfDay[color];
	    SOCKET.sendColor(rgb);
	}

	function getTimeOfDayColor(d) {
		var color;
		if(d.getHours < 11) { color = 'morning' }   else
		if(d.getHours < 15) { color = 'midday' }    else
		if(d.getHours < 19) { color = 'afternoon' } else
							{ color = 'evening' }

		return color;
	}

	function togglePartyMode() {
		o.state = (o.state == CONFIG.states.party ? CONFIG.states.active : CONFIG.states.party);
	}

	function sendColor(color) {
		MIDI.send(o.channel, CONFIG.velocities[color]);
	}

	function distance(a, b) {
		return Math.sqrt( Math.pow(a[0]-b[0],2) + Math.pow(a[1]-b[1],2) + Math.pow(a[2]-b[2],2));
	} 

	var maxDistance = distance( CONFIG.colors.blue, CONFIG.colors.water ) * 0.5;

	function findClosestColor( color ) {
		if( distance(color, CONFIG.colors.blue)   < maxDistance ) return "blue";
		if( distance(color, CONFIG.colors.yellow) < maxDistance ) return "yellow";
		if( distance(color, CONFIG.colors.red)    < maxDistance ) return "red";
		if( distance(color, CONFIG.colors.aqua)   < maxDistance ) return "aqua";
		if( distance(color, CONFIG.colors.green)  < maxDistance ) return "green";
		if( distance(color, CONFIG.colors.water)  < maxDistance ) return "water";
		return null;
	}
}

module.exports = LightChannel;