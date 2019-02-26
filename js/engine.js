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
	SIM.currentMouseCoords = [];
	SIM.firstClick = false;
	SIM.firstClickCoords = [];
	SIM.secondClickCoords = [];

	init();
};

function init() {
	SIM.bodies = [];

	DOM.canvas.addEventListener('mousemove', e => {
		canvasMove(e);
	});

	DOM.canvas.addEventListener('click', e => {
		canvasClick(e);
	});

	addBodyFromCoords(200, 200, 0, 0);

	// Start running.
	window.requestAnimationFrame(tick);

	setTimeout(hideHint, 10000);
}

function tick() {
	// Draw background color/gradient;
	DOM.ctx.fillStyle = DOM.canvasGradient;
	DOM.ctx.fillRect(0, 0, DOM.canvas.width, DOM.canvas.height);

	if (SIM.bodies.length > 0) {
		nBody();

		//Drawing the actual bodies
		SIM.bodies.forEach(body => {
			let radius = body.radius;
			let offset = Math.round(radius / 2);

			//Drawing trails
			DOM.ctx.strokeStyle = body.trailColor;
			DOM.ctx.moveTo(body.x - offset, body.y - offset);
			body.trailCoords.forEach(pair => {
				DOM.ctx.lineTo(pair[0] - offset, pair[1] - offset);
				DOM.ctx.stroke();
				DOM.ctx.moveTo(pair[0] - offset, pair[1] - offset);
			});

			// Draw actual body over the trail.
			DOM.ctx.beginPath();
			DOM.ctx.fillStyle = body.color;
			DOM.ctx.arc(body.x - offset, body.y - offset, radius, 0, Math.PI * 2);
			DOM.ctx.fill();
		});
	}

	// Draw temporary trajectory line for new bodies.
	// Set color
	if (SIM.firstClick) {
		DOM.ctx.strokeStyle = '#cf9bf2';
		DOM.ctx.moveTo(SIM.firstClickCoords[0], SIM.firstClickCoords[1]);
		DOM.ctx.lineTo(SIM.currentMouseCoords[0], SIM.currentMouseCoords[1]);
		DOM.ctx.stroke();
	}

	if (!SIM.isPaused) window.requestAnimationFrame(tick);
}

function addBody(mouseEvent) {
	if (SIM.bodies.length <= 1) hideHint();

	const coords = canvasCoords(mouseEvent);
	const x = coords[0];
	const y = coords[1];
	const xVel = 0;
	const yVel = 0;
	const mass = parseInt($('#newBody_mass')[0].value);

	SIM.bodies.push(new Body(x, y, xVel, yVel, mass));

	//Draw one frame
	window.requestAnimationFrame(tick);
}

function addBodyFromCoords(x, y, xVel, yVel) {
	SIM.bodies.push(new Body(x, y, xVel, yVel, parseInt($('#newBody_mass')[0].value)));
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

			if (subtractX) one.xVel -= xVal;
			else one.xVel += xVal;

			if (subtractY) one.yVel -= yVal;
			else one.yVel += yVal;
		}
	}

	// Update them all after the n-body tick has been solved.
	for (let i = 0; i < SIM.bodies.length; i++) {
		SIM.bodies[i].addTrailPoint([SIM.bodies[i].x, SIM.bodies[i].y]); // Add this point to the trail points.
		SIM.bodies[i].tick();
	}
}

function canvasMove(mouseEvent) {
	SIM.currentMouseCoords = canvasCoords(mouseEvent);
}

function canvasClick(mouseEvent) {
	if (!SIM.firstClick) {
		SIM.firstClick = true;
		SIM.firstClickCoords = canvasCoords(mouseEvent);
	} else {
		SIM.firstClick = false;
		SIM.secondClickCoords = canvasCoords(mouseEvent);

		let x = SIM.firstClickCoords[0];
		let y = SIM.firstClickCoords[1];
		let xVel = SIM.secondClickCoords[0] - SIM.firstClickCoords[0];
		let yVel = SIM.secondClickCoords[1] - SIM.firstClickCoords[1];

		console.log(`xvel = ${xVel}, yvel = ${yVel}`);

		addBodyFromCoords(x, y, xVel / 200, yVel / 200);
	}
}

function handleMouseMove(mouseEvent) {}

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
	$('#speedMultiplier_readout').text(value + 'x');
}

function hint(text) {
	$('#hintbox > p').text(text);
	$('#hintbox').show();
}

function hideHint() {
	$('#hintbox').hide();
}
