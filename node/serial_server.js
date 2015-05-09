var CONFIG = require('./config')
var HTTP   = require('./module_http');
var SERIAL = require('./module_serial');
var LightChannel = require('./module_light_channel');



// function rgbMessage( i, color ) {
// 	return { index: i, hex: 'rgb('+color[0]+','+color[1]+','+color[2]+')' };
// }

var lights = {
	0 : new LightChannel({channel:2}),
	1 : new LightChannel({channel:3}),
	stage : new LightChannel({channel:1})
}

SERIAL.onMessage = function(data) {
	// TODO: add in support for party mode
	if( data.match(/partymode/) ) {
		lights[0].togglePartyMode();
		lights[1].togglePartyMode();
		lights.stage.togglePartyMode();
	}

	var pieces = data.match(/rgb (\d)1: (\d+,\d+,\d+)/);

	if( !pieces ) return;

	var index = parseInt(pieces[1])-7;
	var rgb   = pieces[2].split(',');

	// send the RGB sensor data to the correct console
	lights[index].onMessage(rgb);
	// send BLACK to the stage
	lights['stage'].onMessage([0,0,0]);

    console.log(index, rgb);
}