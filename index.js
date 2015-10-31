/**
 * Rendering stream.
 *
 * It does not transform audio to text
 * because rendering may require repetition of the same data multiple times.
 * It just plots captured amount of data to a canvas in user-defined way.
 *
 * Separation by node/browser files is also really unnecessary,
 * we can detect environment in-place without serious size overdraft.
 * All the required modules provide short browser versions.
 *
 * Any routines which may vary, like sliding window behaviour,
 * realtime data binding, etc are left to user.
 *
 * @module  audio-spiral
 */


var inherits = require('inherits');
var Transform = require('stream').Transform;
var extend = require('xtend/mutable');
var pcm = require('pcm-util');
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

	Transform.call(self, options);

	//overwrite options
	extend(self, options);

	//ensure canvas
	if (!self.canvas) {
		self.canvas = new Canvas();
	}

	//data buffer to draw
	self.data = [];

	//data counter
	self._count = 0;

	//plan rendering
	self._id = raf(update, 1000 / self.framesPerSecond);

	//stop on end
	self.on('end', function () {
		cancel(self._id);
	});

	self.emit('create', self.canvas);

	function update () {
		self.emit('beforeRender', self.canvas, self.data);
		self.render(self.canvas, self.data);
		self.emit('render', self.canvas, self.data);

		self._id = raf(update, 1000 / self.framesPerSecond);
	}
}


inherits(RenderStream, Transform);


/** Get PCM format */
extend(RenderStream.prototype, pcm.defaultFormat);


/** Number of channel to display */
RenderStream.prototype.channel = 0;


/** Max size of a buffer - 1s, change if required more */
RenderStream.prototype.bufferSize = 44100;


/** How often to update */
RenderStream.prototype.framesPerSecond = 20;


/**
 * Capture data for rendering.
 */
RenderStream.prototype._transform = function (chunk, enc, cb) {
	var self = this;
	//get channel data converting the input
	var channelData = pcm.getChannelData(chunk, self.channel, self).map(function (sample) {
		return pcm.convertSample(sample, self, {float: true});
	});

	//shift data & ensure window size
	self.data = self.data.concat(channelData).slice(-self.bufferSize);

	//release the chunk to prevent blocking pipes
	self.push(chunk);

	//increase count
	self._count += channelData.length;

	//meditate for a processor tick each FPS limit to make processor room for rendering
	if (self._count / self.sampleRate > 1 / self.framesPerSecond) {
		self._count %= Math.floor(self.sampleRate / self.framesPerSecond);
		setTimeout(cb);
	} else {
		cb();
	}
}


/**
 * Default rendering method, does nothing
 * @override
 */
RenderStream.prototype.render = function (canvas, data) {

};


module.exports = RenderStream;