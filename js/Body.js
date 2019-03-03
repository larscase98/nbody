class Body {

	constructor(x, y, xVel, yVel, mass, color = '#a8ce4e', trailColor = '#aeed9a') {
		this.x = x;
		this.y = y;
		this.xVel = xVel;
		this.yVel = yVel;
		this.mass = mass;
		this.color = color;
		this.trailCoords = []; // Will contain arrays of [x, y] values.
		this.trailColor = trailColor;

		this.trailMaxLength = 100; // Storing 100, but only showing every few dots for drawing speed.

		this.radius = this.radiusFactor(1000);
	}

	radiusFactor(scaleFactor) {
		return Math.round(Math.cbrt((this.mass * scaleFactor) / 20));
	}

	tick() {
		this.x += this.xVel;
		this.y += this.yVel;
	}

	addTrailPoint(newPoint) {
		this.trailCoords.unshift(newPoint);

		while (this.trailCoords.length > this.trailMaxLength) {
			this.trailCoords.pop();
		}
	}
}
