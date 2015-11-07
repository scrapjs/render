/**
 * Rendering stream.
 *
 * It does not transform audio to text
 * because rendering may require repetition of the same data multiple times.
 * It just plots captured amount of data to a canvas in user-defined way.
 *
 * Separation by node/browser files is also unnecessary,
 * we can detect environment in-place without serious size overdraft.
 * All the required modules provide short browser versions.
 *
 * Any routines which may vary, like sliding window behaviour,
 * realtime data binding, etc are left to user.
 *
 * It is a transform stream with exception where there are no piped outputs,
 * it releases data, i. e. behaves like a writable.
 *
 * @module  audio-render
 */


var inherits = require('inherits');
var Analyser = require('audio-analyser');
var isBrowser = require('is-browser');
var Canvas = require('drawille-canvas');


//detect rendering scheduler
var raf, cancel;
if (isBrowser && (raf = requestAnimationFrame)) {
	cancel = cancelAnimationFrame;
}
else {
	raf = setTimeout;
	cancel = clearTimeout;
}


/**
 * @constructor
 */
function RenderStream (options) {
	if (!(this instanceof RenderStream)) return new RenderStream(options);

	var self = this;

	if (options instanceof Function) {
		options = {
			render: options
		};
	}

	Analyser.call(self, options);


	//ensure canvas
	if (!self.canvas) {
		self.canvas = new Canvas();
	}

	//set throttling
	self.throttle = 1000 / self.framesPerSecond;


	//plan rendering
	self._id = raf(update, self.throttle);

	//stop on end
	self.on('end', function () {
		cancel(self._id);
	});

	function update () {
		self.render(self.canvas, self._data);
		self.emit('render', self.canvas);

		self._id = raf(update, self.throttle);
	}
}


/** It should be duplex not to block pipe if there is no output sink */
inherits(RenderStream, Analyser);



/** How often to update */
RenderStream.prototype.framesPerSecond = 20;


/**
 * Default rendering method, does nothing
 * @override
 */
RenderStream.prototype.render = function (canvas, data) {

};


module.exports = RenderStream;