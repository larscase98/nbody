let DOM, SIM;

window.onload = () => {
	DOM = {};
	DOM.canvas = document.getElementById('canvas');
	DOM.ctx = DOM.canvas.getContext('2d');

	// SET attrs of canvas.
	DOM.canvas.setAttribute('width', Math.round($('#canvas').innerWidth()));
	DOM.canvas.setAttribute('height', Math.round($('#canvas').innerHeight()));

	// Canvas gradient background variable;
	DOM.canvasGradient = DOM.ctx.createLinearGradient(0, 0, 0, DOM.canvas.width);
	DOM.canvasGradient.addColorStop(0, '#060d1e');
	DOM.canvasGradient.addColorStop(0.31, '#16093a');
	DOM.canvasGradient.addColorStop(0.62, '#040e1e');
	DOM.canvasGradient.addColorStop(1, '#03010f');

	SIM = {};
	SIM.isPaused = false;
	SIM.speedFactor = 0.00001;

	init();
};

function init() {
	SIM.bodies = [];

	DOM.canvas.addEventListener('click', mouseClickEvent => {
		addBody(mouseClickEvent);
	});

	// Start running.
	window.requestAnimationFrame(tick);
}

function tick() {
	nBody();

	// Draw background color/gradient;
	DOM.ctx.fillStyle = DOM.canvasGradient;
	DOM.ctx.fillRect(0, 0, DOM.canvas.width, DOM.canvas.height);

	//Drawing the actual animation
	SIM.bodies.forEach(body => {
		let radius = body.radius;
		let offset = Math.round(radius / 2);

		DOM.ctx.beginPath();
		DOM.ctx.fillStyle = body.color;

		DOM.ctx.arc(body.x - offset, body.y - offset, radius, 0, Math.PI * 2);

		DOM.ctx.fill();
	});

	if (!SIM.isPaused) window.requestAnimationFrame(tick);
}

function addBody(mouseEvent) {
	const coords = canvasCoords(mouseEvent);
	const x = coords[0];
	const y = coords[1];
	const xVel = 0;
	const yVel = 0;
	const mass = parseInt($('#newBody_mass')[0].value);

	SIM.bodies.push(new Body(x, y, xVel, yVel, mass, '#f9f5ea'));

	//Draw one frame
	window.requestAnimationFrame(tick);
}

// Actually calculate trajectories for new tick.
function nBody() {
	let sf = 0.0000001;

	for (let i = 0; i < SIM.bodies.length; i++) {
		let one = SIM.bodies[i];

		for (let j = 0; j < SIM.bodies.length; j++) {
			let two = SIM.bodies[j];

			let diffX = two.x - one.x;
			let diffY = two.y - one.y;

			let subtractX = diffX < 0;
			let subtractY = diffY < 0;

			let xVal = Math.sqrt(Math.abs(diffX)) * (two.mass / one.mass) * sf;
			let yVal = Math.sqrt(Math.abs(diffY)) * (two.mass / one.mass) * sf;

			if(subtractX)
				one.xVel -= xVal;
			else one.xVel += xVal;

			if(subtractY)
				one.yVel -= yVal;
			else one.yVel += yVal;
		}

	}

	// Update them all after the n-body tick has been solved.
	for(let i = 0; i < SIM.bodies.length; i++)
		SIM.bodies[i].tick();
}

function toggleRunning() {
	const button = $('#pauseButton');

	if (SIM.isPaused) {
		// Unpause, so start ticking again.
		SIM.isPaused = false;
		button.text('pause');
		window.requestAnimationFrame(tick);

		console.log('Unpaused.');
	} else {
		SIM.isPaused = true;
		button.text('play');

		console.log('Paused');
	}
}

function canvasCoords(e) {
	// Returns Array([x, y]);
	const rect = DOM.canvas.getBoundingClientRect();
	const ret = [e.clientX - rect.left, e.clientY - rect.top];
	return ret;
}

function newMassCallback(value) {
	$('#newBody_mass_readout').text(value);
}

function updateSpeed(value) {
	SIM.speedFactor = value;
	$("#speedMultiplier_readout").text(value + "x");
}