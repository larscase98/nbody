class Body {

	x;
	y;
	xVel;
	yVel;
	mass;
	radius;
	color;

	constructor(x, y, xVel, yVel, mass, color = '#33cc11') {

		this.x = x;
		this.y = y;
		this.xVel = xVel;
		this.yVel = yVel;
		this.mass = mass;
		this.color = color;

		this.radius = this.radiusFactor(1000);
	}

	radiusFactor(scaleFactor) {
		return Math.round(Math.cbrt((this.mass * scaleFactor) / 20));
	}

	tick() {
		this.x += this.xVel;
		this.y += this.yVel;
	}
}