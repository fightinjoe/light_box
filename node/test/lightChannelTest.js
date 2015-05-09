var CONFIG = require('../config');

var expect  = require('chai').expect,
    sinon   = require('sinon'),
    mockery = require('mockery');

var LightChannel,
    lc,
    mock_socket,
    mock_midi,
    clock;

describe('LightChannel', function() {
	before(function(){
		mockery.enable({
		    warnOnReplace: false,
		    warnOnUnregistered: false
		});

		mock_socket = {sendColor:sinon.spy()};
		mock_midi = {send:sinon.spy()};

		mockery.registerMock('./module_socket', mock_socket);
		mockery.registerMock('./module_midi',   mock_midi);
	});

	beforeEach(function(){
		mockery.registerAllowable('../module_light_channel');
		LightChannel = require('../module_light_channel');
		lc = new LightChannel({channel:2});
	});

    afterEach(function() {
        mockery.deregisterAll();    // Deregister all Mockery mocks from node's module cache
    	mock_socket.sendColor.reset();
		mock_midi.send.reset();
    });

	after(function(){ mockery.disable(); })

	describe('lightChannel instance', function(){
		it('send a socket message for the color during daytime hours',function(){
			var clock = sinon.useFakeTimers( (new Date(2015, 1, 1, 11, 0, 0)).getTime() ); // Sunday
			var rgb = CONFIG.colors.blue;

			lc.onMessage(rgb);
			expect( mock_midi.send.args[0][0] ).to.equal(2);
			expect( mock_midi.send.args[0][1] ).to.equal( CONFIG.velocities.blue );

			clock.restore()
		});

		it('send a socket message for the time of day before hours',function(){
			var clock = sinon.useFakeTimers( (new Date(2015, 1, 1, 0, 0, 0)).getTime() ); // Sunday
			var rgb = CONFIG.colors.blue;

			lc.onMessage(rgb);
			expect( mock_midi.send.args[0][0] ).to.equal(2);
			expect( mock_midi.send.args[0][1] ).to.equal( CONFIG.velocities.blueout );

			clock.restore()

		});

		it('send a socket message for the time of day after hours',function(){});
	})
})