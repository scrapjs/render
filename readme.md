_Audio-render_ is a pass-through audio stream, providing structure for rendering stream audio data.

It resolves common routines like frequency analysis (fft), buffering data, reading pcm format, providing unified API for rendering both in node/browser, events, options, hooks etc. Creating new rendering components based on _audio-render_ is as simple as creating them from scratch, but times more reliable. It is also useful for creating quick debuggers.


## Usage

[![$ npm install audio-render](http://nodei.co/npm/audio-render.png?mini=true)](http://npmjs.org/package/audio-render)


```js
var Generator = require('audio-generator');
var Speaker = require('audio-speaker');
var RenderStream = require('audio-render');
var isBrowser = require('is-browser');


//create rendering stream from passed options
var renderer = RenderStream({
	//custom rendering function, can be passed instead of options
	render: function (canvas) {
		//e. g. volume, spectrum, spectrogram, waveform etc.
		//see audio-analyser for API
		var fdata = this.getFrequencyData();
		var waveform = this.getTimeData(size);

		//or use web-audio-api AnalyserNode methods here
		this.getFloatFrequencyData(new Float32Array(self.frequencyBinCount));
		this.getFloatTimeDomainData(new Float32Array(self.fftSize));
	},

	//channel number to render, 0 - L, 1 - R, ...
	channel: 0,

	//FPS (node only)
	framesPerSecond: 20,

	//max amount of data to store, number of samples
	bufferSize: 44100,

	//custom canvas (optinal), if you need to render along with other renderer
	canvas: undefined,

	//Analysis options

	//Magnitude diapasone, in dB
	minDecibels: -100,
	maxDecibels: 0,

	// Number of points to grab for fft
	fftSize: 1024,

	// Number of points to plot for fft
	frequencyBinCount: 1024/2,

	// Smoothing, or the priority of the old data over the new data
	smoothingTimeConstant: 0.2


	//...any pcm format options, if required. See pcm-util below.
});


//Depending on the enviromnent, expose canvas
isBrowser && document.body.appendChild(renderer.canvas);

renderer.on('render', function (canvas, data) {
	process.stdout.write(canvas._canvas.frame());
});


//If renderer is not piped, it works as a sink, else - as pass-through
Generator().pipe(renderer).pipe(Speaker());
```

## Related

> [audio-analyser](https://npmjs.org/package/audio-analyser) — audio analyser stream.<br/>
> [audio-spectrum](https://npmjs.org/package/audio-spectrum) — render audio spectrum.<br/>
> [audio-spectrogram](https://npmjs.org/package/audio-spectrogram) — render audio spectrogram.<br/>
> [audio-waveform](https://npmjs.org/package/audio-waveform) — render audio waveform.<br/>
> [audio-stat](https://npmjs.org/package/audio-stat) — render any kind of audio info: waveform, spectrogram etc.<br/>
> [audio-spiral](https://npmjs.org/package/audio-spiral) — render spiral spectrogram, based on audio-render.<br/>
> [drawille-canvas](https://github.com/madbence/node-drawille-canvas) — node/browser canvas class.<br/>
> [pcm-util](https://npmjs.org/package/pcm-util) — utils for work with pcm-streams.<br/>