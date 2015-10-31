_Audio-render_ is a pass-through audio stream, providing structure for implementing rendering of any pcm information. It resolves common routines like inheriting stream, reading pcm format, providing unified API for rendering both in node/browser, events, options, hooks etc. Creating new rendering components based on _audio-render_ is as simple as creating them from scratch, but times more reliable. It is also useful for creating quick debuggers.


## Usage

[![$ npm install audio-render](http://nodei.co/npm/audio-render.png?mini=true)](http://npmjs.org/package/audio-render)


```js
var Generator = require('audio-generator');
var Speaker = require('audio-speaker');
var RenderStream = require('audio-render');


var renderer = RenderStream({
	//channel number to render, 0 - L, 1 - R, ...
	channel: 0,

	//FPS, if requestAnimationFrame is not available
	framesPerSecond: 20,

	//max amount of data to store, number of samples
	bufferSize: 44100 * 60,

	//custom rendering function, can be passed instead of options
	render: function (canvas, data) {
		//e. g. volume, spectrum, spectrogram, waveform etc.
	},

	//custom canvas (optinal), if you need to render along with other renderer
	canvas: undefined

	//...also pass any pcm format options, if required
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

> [audio-stat](https://npmjs.org/package/audio-stat) — render any kind of audio info: waveform, spectrogram etc.<br/>
> [audio-spectrogram](https://npmjs.org/package/audio-spectrogram) — render audio spectrogram.<br/>
> [audio-waveform](https://npmjs.org/package/audio-waveform) — render audio waveform.<br/>
> [audio-spiral](https://npmjs.org/package/audio-spiral) — render spiral spectrogram, based on audio-render.<br/>
> [drawille-canvas](https://github.com/madbence/node-drawille-canvas) — node/browser canvas class.<br/>