var CONFIG = require('./config');
// var SOCKET = require('./module_socket');
var MIDI   = require('./module_midi');

var LightChannel = function( opts ) {
	var o = {
		channel : opts.channel || 1,
		state   : CONFIG.states.active,
		awake   : false,
		color   : null
	}

	this.o = o;
	this.MIDI = MIDI;

	// This is the primary loop that reacts to data coming in from the sensors.
	// rgb is an array of three values
	this.onMessage = function(rgb) {
		try {
			var d = isWorkingHours();
			// console.log('isWorkingHours', d);

			d ? handleColor(rgb, d) : handleSleep(rgb);
		} catch(e) {
			console.log('!!! LightChannel error', e);
		}
	}

	this.onPartyMessage = function(channel) {
		if( !cacheColor('party') )  return;

		sendColor('party', {channel: channel});
		sendSocketColor('party');
	}

	function isWorkingHours() {
		var d = new Date();

		if( d.getHours() <  CONFIG.hours[d.getDay()].min ) return false;
		if( d.getHours() >= CONFIG.hours[d.getDay()].max ) return false;

		return d;
	}

	function cacheColor(color) {
		console.log('cacheColor',color, o.color);
		// if( o.color == color ) return;
		o.color = color;
		return color;
	}

	function handleColor(rgb, d) {
		// Finds the color closest to the app specifics, returns null otherwise
		color = findClosestColor(rgb);

		// If the app doesn't match a color, then use the time of day color
		if( !color ) color = getTimeOfDayColor(d);

		// don't issue any change commands if the color hasn't changed.
	    // if( o.color == color ) return;

	    // cache the color
	    // o.color = color;

	    if( cacheColor(color) ) {
		    sendSocketColor(color);
		    sendColor(color);
	    }
	}

	function handleSleep() {
		color = 'blueout';

		// if( color == o.color ) return;

		// cache the color to prevent sending the message multiple times
		// o.color = color;

		if( cacheColor( color ) ) {
			sendSocketColor(color);
			sendColor(color);
		}
	}

	function sendSocketColor(color) {
	 	var rgb = CONFIG.colors[color] || CONFIG.timeOfDay[color] || [0,0,0];
	    // SOCKET.sendRGB(rgb, o.channel);
	}

	function getTimeOfDayColor(d) {
		var color;
		if(d.getHours() < 12) { color = 'morning' }   else
		if(d.getHours() < 15) { color = 'midday' }    else
		if(d.getHours() < 19) { color = 'afternoon' } else
							  { color = 'evening' }

		return color;
	}

	function sendColor(color, opts) {
		opts = opts || {};
		var channel = opts.channel || o.channel;
		MIDI.send(channel, CONFIG.velocities[color]);
	}

	function distance(a, b) {
		return Math.sqrt( Math.pow(a[0]-b[0],2) + Math.pow(a[1]-b[1],2) + Math.pow(a[2]-b[2],2));
	} 

	var maxDistance = 16; //distance( CONFIG.colors.blue, CONFIG.colors.water ) * 0.5;

	function findClosestColor( rgb ) {
		var c = 'blue';
		var d = distance(rgb, CONFIG.colors.blue);

		var d1;
		function compare(newColor) {
			d1 = distance(rgb, CONFIG.colors[newColor]);
			if( d1 > d ) return;
			c = newColor;
			d = d1;
		}

		compare('yellow');
		compare('red');
		compare('aqua');
		compare('green');
		compare('water');

		// if( distance(rgb, CONFIG.colors.blue)   < maxDistance ) return "blue";
		// if( distance(rgb, CONFIG.colors.yellow) < maxDistance ) return "yellow";
		// if( distance(rgb, CONFIG.colors.red)    < maxDistance ) return "red";
		// if( distance(rgb, CONFIG.colors.aqua)   < maxDistance ) return "aqua";
		// if( distance(rgb, CONFIG.colors.green)  < maxDistance ) return "green";
		// if( distance(rgb, CONFIG.colors.water)  < maxDistance ) return "water";
		return d > maxDistance ? null : c;
	}
}

module.exports = LightChannel;