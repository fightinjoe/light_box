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

		mock_socket = {sendRGB:sinon.spy()};
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
    	mock_socket.sendRGB.reset();
		mock_midi.send.reset();
    });

	after(function(){ mockery.disable(); })

	describe('lightChannel instance', function(){
		it('sends a MIDI message for the color during daytime hours at opening',function(){
			var clock = sinon.useFakeTimers( (new Date(2015, 1, 1, 11, 0, 0)).getTime() ); // Sunday
			var rgb = CONFIG.colors.blue;

			lc.onMessage(rgb);
			expect( mock_midi.send.args[0][0] ).to.equal(2);
			expect( mock_midi.send.args[0][1] ).to.equal( CONFIG.velocities.blue );

			clock.restore();
		});

		it('sends a socket message for the color during daytime hours at opening',function(){
			var clock = sinon.useFakeTimers( (new Date(2015, 1, 1, 11, 0, 0)).getTime() ); // Sunday
			var rgb = CONFIG.colors.blue;

			lc.onMessage(rgb);
			expect( mock_socket.sendRGB.calledOnce ).to.equal(true);
			expect( mock_midi.send.args[0][1] ).to.equal( CONFIG.velocities.blue );

			clock.restore();
		});

		it('sends a MIDI message for the color during daytime hours at closing on Sunday',function(){
			var clock = sinon.useFakeTimers( (new Date(2015, 1, 1, 19, 59, 59)).getTime() ); // Sunday
			var rgb = CONFIG.colors.blue;

			lc.onMessage(rgb);
			expect( mock_midi.send.args[0][0] ).to.equal(2);
			expect( mock_midi.send.args[0][1] ).to.equal( CONFIG.velocities.blue );

			clock.restore();
		});

		it('sends a MIDI message for the color during daytime hours at closing on Monday',function(){
			var clock = sinon.useFakeTimers( (new Date(2015, 1, 2, 20, 59, 59)).getTime() ); // Monday
			var rgb = CONFIG.colors.blue;

			lc.onMessage(rgb);
			expect( mock_midi.send.args[0][0] ).to.equal(2);
			expect( mock_midi.send.args[0][1] ).to.equal( CONFIG.velocities.blue );

			clock.restore();
		});

		it('sends a MIDI message for the time of day before hours',function(){
			var clock = sinon.useFakeTimers( (new Date(2015, 1, 1, 10, 59, 0)).getTime() ); // Sunday
			var rgb = CONFIG.colors.blue;

			lc.onMessage(rgb);
			expect( mock_midi.send.args[0][0] ).to.equal(2);
			expect( mock_midi.send.args[0][1] ).to.equal( CONFIG.velocities.blueout );

			clock.restore()
		});

		it('sends a MIDI message for the time of day after hours',function(){
			var clock = sinon.useFakeTimers( (new Date(2015, 1, 1, 20, 00, 0)).getTime() ); // Sunday
			var rgb = CONFIG.colors.blue;

			lc.onMessage(rgb);
			expect( mock_midi.send.args[0][0] ).to.equal(2);
			expect( mock_midi.send.args[0][1] ).to.equal( CONFIG.velocities.blueout );

			// make sure that the message is only sent once
			lc.onMessage(rgb);
			expect( mock_midi.send.calledOnce ).to.equal(true);

			clock.restore()
		});

		it('only sends a MIDI message once for the same color', function() {
			var clock = sinon.useFakeTimers( (new Date(2015, 1, 1, 12, 00, 0)).getTime() ); // Sunday
			var rgb = CONFIG.colors.blue;

			lc.onMessage(rgb);
			lc.onMessage(rgb);
			
			expect( mock_midi.send.args.length ).to.equal( 1 );

			clock.restore();
		});

		it('only sends a MIDI message once for black', function() {
			var clock = sinon.useFakeTimers( (new Date(2015, 1, 1, 12, 00, 0)).getTime() ); // Sunday
			var rgb = CONFIG.colors.black;

			lc.onMessage(rgb);
			lc.onMessage(rgb);
			
			expect( mock_midi.send.args.length ).to.equal( 1 );

			clock.restore();
		});

		it('sends separate MIDI messages for two different colors', function() {
			var clock = sinon.useFakeTimers( (new Date(2015, 1, 1, 12, 00, 0)).getTime() ); // Sunday
			
			lc.onMessage( CONFIG.colors.blue );
			lc.onMessage( CONFIG.colors.red );
			
			expect( mock_midi.send.args.length ).to.equal( 2 );

			clock.restore();
		});

		it('sends a party MIDI message when party mode is toggled', function() {
			var clock = sinon.useFakeTimers( (new Date(2015, 1, 1, 12, 00, 0)).getTime() ); // Sunday
			
			lc.togglePartyMode();
			expect( mock_midi.send.args[0][1] ).to.equal( CONFIG.velocities.party );

			// expect that subsequent calls don't issue more MIDI calls
			lc.onMessage( CONFIG.colors.blue );
			expect( mock_midi.send.args.length ).to.equal(1);

			clock.restore();
		});

		it('goes back to normal when party mode is toggled off', function() {
			var clock = sinon.useFakeTimers( (new Date(2015, 1, 1, 12, 00, 0)).getTime() ); // Sunday
			
			lc.togglePartyMode();
			lc.togglePartyMode();

			// expect that subsequent calls don't issue more MIDI calls
			lc.onMessage( CONFIG.colors.blue );
			expect( mock_midi.send.args.length ).to.equal(2);
			expect( mock_midi.send.args[0][1] ).to.equal( CONFIG.velocities.blue );

			clock.restore();
		});

		it('sends a message for Red when the color close to red', function() {
			var clock = sinon.useFakeTimers( (new Date(2015, 1, 1, 11, 0, 0)).getTime() ); // Sunday
			var rgb = [169,48,42];

			lc.onMessage(rgb);
			expect( mock_midi.send.args[0][0] ).to.equal(2);
			expect( mock_midi.send.args[0][1] ).to.equal( CONFIG.velocities.red );
			expect( mock_socket.sendRGB.args[0][0] ).to.equal( CONFIG.colors.red );

			clock.restore();
		})
	})
})