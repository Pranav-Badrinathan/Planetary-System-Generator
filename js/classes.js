class Star {
	constructor(mass){
		this.mass = mass;
		this.luminosity = Math.pow(mass, 3.5);
		this.diameter = Math.pow(mass, 0.74);
		this.surfTemp = Math.pow(mass, 0.505);
		this.lifetime = Math.pow(mass, -2.5);

		console.log(this.mass + " : "
					+ this.luminosity + " : "
					+ this.diameter + " : "
					+ this.surfTemp + " : "
					+ this.lifetime);
	}
}