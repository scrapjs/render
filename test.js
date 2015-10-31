var Render = require('./');
var Generator = require('audio-generator');
var Sink = require('stream-sink');
var Canvas = require('drawille-canvas');
var isBrowser = require('is-browser');

var canvas = new Canvas(120, 80);

Generator().pipe(Render({
	channel: 0,
	canvas: canvas,
	render: function (canvas, data) {
		var ctx = canvas.getContext('2d');

		ctx.clearRect(0,0,canvas.width, canvas.height);

		if (!data.length) return;

		//get average magnitude
		var w = 5;
		var magnitude = 0;
		for (var i = 1; i <= w; i++) {
			magnitude += data[data.length - i];
		}

		magnitude /= w;
		magnitude = magnitude / 2 + 0.5;

		ctx.fillRect(0,0, magnitude * canvas.width, 20);
		ctx.fillText('Magnitude: ' + magnitude, 0, 40);

	}
}))
.on('render', function (canvas) {
	if (!isBrowser) {
		process.stdout.write(canvas._canvas.frame());
	}
})
.pipe(Sink());

if (isBrowser) {
	document.documentElement.appendChild(canvas);
}