_Audio-render_ is a pass-through audio stream, providing structure for rendering any pcm information.

It resolves common routines like inheriting stream, reading pcm format, providing unified API for rendering both in node/browser, events, options, hooks etc. Creating new rendering components based on _audio-render_ is as simple as creating them from scratch, but times more reliable. It is also useful for creating quick debuggers.


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
	render: function (canvas, data) {
		//e. g. volume, spectrum, spectrogram, waveform etc.
	},

	//channel number to render, 0 - L, 1 - R, ...
	channel: 0,

	//FPS (node only)
	framesPerSecond: 20,

	//max amount of data to store, number of samples
	bufferSize: 44100,

	//custom canvas (optinal), if you need to render along with other renderer
	canvas: undefined

	//...also pass any pcm format options, if required. See pcm-util below.
});


//Depending on the enviromnent, expose canvas
if (isBrowser) {
	document.body.appendChild(renderer.canvas);
} else {
	renderer.on('render', function (canvas, data) {
		process.stdout.write(canvas._canvas.frame());
	});
}


Generator().pipe(renderer).pipe(Speaker());
```

## Related

> [pcm-util](https://npmjs.org/package/pcm-util) — utils for work with pcm-streams.<br/>
> [audio-stat](https://npmjs.org/package/audio-stat) — render any kind of audio info: waveform, spectrogram etc.<br/>
> [audio-spectrogram](https://npmjs.org/package/audio-spectrogram) — render audio spectrogram.<br/>
> [audio-waveform](https://npmjs.org/package/audio-waveform) — render audio waveform.<br/>
> [audio-spiral](https://npmjs.org/package/audio-spiral) — render spiral spectrogram, based on audio-render.<br/>
> [drawille-canvas](https://github.com/madbence/node-drawille-canvas) — node/browser canvas class.<br/>