var CONFIG = {};

// CONFIG.colors = {
// 	blue:   [36,83,109],
// 	yellow: [105,90,40],
// 	red:    [146,54,45],
// 	aqua:   [40,98,89],
// 	green:  [58,117,51],
// 	blue:   [34,89,102],
// 	pink:   [104,69,69],
// 	black:  [0,0,0]
// };

CONFIG.colors = {
	blue:   [31,85,118],   // [39,85,125]
	yellow: [120,81,37],   // [122,87,45]
	red:    [169,44,38],   // [181,47,48]
	aqua:   [40,103,87],   // [45,106,95]
	green:  [62,121,49],   // [66,127,60]
	water:  [33,91,107],   // [39,93,113]
	white:  [67,87,77],
	pink:   [121,61,59],
	party:  [255, 5, 202],
	black:  [0,0,0]
};

CONFIG.timeOfDay = {
	morning:   [251, 220, 102], // soft yellow
	midday:    [126, 251, 89],  // green
	afternoon: [83, 176, 251],  // sky blue
	evening:   [36, 2, 104]     // purple
};

CONFIG.midiChannels = {
	blue:   1,
	yellow: 2,
	red:    3,
	aqua:   4,
	green:  5,
	water:  6
};

CONFIG.velocities = {
	blue:      11,
	yellow:    21,
	red:       31,
	aqua:      41,
	green:     51,
	water:     61,
	morning:   71,
	midday:    76,
	afternoon: 81,
	evening:   86,
	blueout:   1,
	party:     11,
	blackout:  50
}

CONFIG.states = {
	active : 'state-active',
	party  : 'state-party',
	blueout: 'state-blueout',
	off    : 'state-off'
}

CONFIG.midi = {
	blueout : { cmd: 176, channel: 4, val: 1 }
}

CONFIG.hours = {
	0 : { min : 11, max: 20 }, // Sunday
	1 : { min : 11, max: 21 },
	2 : { min : 11, max: 21 },
	3 : { min : 11, max: 21 },
	4 : { min : 11, max: 21 },
	5 : { min : 11, max: 21 },
	6 : { min : 11, max: 21 }
}

module.exports = CONFIG;