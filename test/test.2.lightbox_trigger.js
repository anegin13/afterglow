import LightboxTrigger from '../src/js/afterglow/components/LightboxTrigger';
import Lightbox from '../src/js/afterglow/components/Lightbox';
import Emitter from '../vendor/Emitter/Emitter';
import DOMElement from '../src/js/afterglow/lib/DOMElement';

var chai = require('chai');
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
var jsdom = require('mocha-jsdom');

chai.use(sinonChai);
chai.should();

var assert = chai.assert;
var expect = chai.expect;

describe("Afterglow Lightbox Trigger", () => {	
	// Initiate the DOM
	jsdom();

	var lightboxtrigger,
		triggerelement,
		$;

	beforeEach(() => {
		$ = require('jquery');

		document.body.innerHTML = '<a class="afterglow" href="#testid"></a><video id="testid"></video>';
		triggerelement = document.querySelector('a.afterglow');
	});

	describe('constructor', () => {
		it('should call init()', () => {
			sinon.stub(LightboxTrigger.prototype, 'init');
			lightboxtrigger = new LightboxTrigger(triggerelement);
			assert(LightboxTrigger.prototype.init.calledOnce);
			LightboxTrigger.prototype.init.restore();
		});
	});

	describe('init()', () => {
		beforeEach(() => {
			sinon.stub(LightboxTrigger.prototype, 'prepare');
			lightboxtrigger = new LightboxTrigger(triggerelement);
		});

		afterEach(() => {
			LightboxTrigger.prototype.prepare.restore();
		});

		it('should get the correct playerid', () => {
			lightboxtrigger.playerid.should.equal('testid');
		});

		it('should get the video element properly', () => {
			let videoelement = document.querySelector('#testid');
			// This isn't a proper solution because it still relies on DOMElement to work. But as this class is also tested, this should do for testings.
			lightboxtrigger.videoelement.node.should.equal(videoelement);
		});

		it('should call prepare()', () => {
			assert(LightboxTrigger.prototype.prepare.calledOnce);
		});

		it('should use Emitter for itself', () => {
			// This isn't a proper solution because it relies on Emitter to work. But as this class is also tested, this should do for testings.
			lightboxtrigger.on.should.be.a('function');
		});
	});

	describe('trigger()', () => {
		beforeEach(() => {

			sinon.stub(LightboxTrigger.prototype, 'init');
			sinon.stub(Emitter.prototype, 'on');
			sinon.stub(Emitter.prototype, 'emit');
			lightboxtrigger = new LightboxTrigger(triggerelement);
			sinon.stub(Lightbox.prototype, 'init', function(){ this.on = () => { return {} } });
			sinon.stub(Lightbox.prototype, 'passVideoElement', (input) => { return input });
			sinon.stub(Lightbox.prototype, 'launch');
			
			lightboxtrigger.videoelement = {
				cloneNode : () => { return 'test' }
			}
			lightboxtrigger.emit = () => {
				return
			};
		});

		afterEach(() => {
			LightboxTrigger.prototype.init.restore();
			Lightbox.prototype.init.restore();
			Lightbox.prototype.passVideoElement.restore();
			Lightbox.prototype.launch.restore();
			Emitter.prototype.on.restore();
			Emitter.prototype.emit.restore();
		});

		it('should create a new Lightbox Element', () => {
			lightboxtrigger.trigger();
			lightboxtrigger.lightbox.should.be.an('object');
		});

		it('should pass a clone of the video element node to the lightbox', () => {
			sinon.spy(lightboxtrigger.videoelement, 'cloneNode');
			var passedinput;
			lightboxtrigger.trigger();
			assert(Lightbox.prototype.passVideoElement.calledOnce);
			assert(lightboxtrigger.videoelement.cloneNode.calledOnce);
			expect(Lightbox.prototype.passVideoElement).to.have.been.calledWith('test');
		});
	});

});