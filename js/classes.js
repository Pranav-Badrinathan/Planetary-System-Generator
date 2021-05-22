
class Star {
	constructor(mass, svgRef){
		this.svgRef = svgRef;

		this.mass = mass;
		this.luminosity = Math.pow(mass, 3.5);
		this.diameter = Math.pow(mass, 0.74);
		this.surfTemp = Math.pow(mass, 0.505) * 5778;
		this.lifetime = Math.pow(mass, -2.5);

		this.setDisplayProps();

		console.log(this.mass + " : "
					+ this.luminosity + " : "
					+ this.diameter + " : "
					+ this.surfTemp + " : "
					+ this.lifetime);
	}

	setDisplayProps() {
		let col = Star.kelvinToRGB(this.surfTemp); 
		this.svgRef.fill = RGBToHex(col.R, col.G, col.B);
		this.svgRef.radius *= this.diameter;
	}

	/**
	 * Converts the input kelvin `temp` into an RGB value.
	 * Uses Mitchell Charity’s raw blackbody datafile at 
	 * http://www.vendian.org/mncharity/dir3/blackbody/UnstableURLs/bbr_color.html
	 * 
	 * Also uses Tanner Helland's idea to plot this table to function and use it. 
	 * https://tannerhelland.com/2012/09/18/convert-temperature-rgb-algorithm-code.html
	 * 
	 * lastly, it uses a revised edition of Tanner's functions by neilb
	 * https://www.zombieprototypes.com/?p=210
	 * 
	 * @param {number} temp Temperature in Kelvin  
	 * @returns RGB value for given `temp`
	 */
	static kelvinToRGB(temp) {
		temp /= 100

		return{
			R: temp <= 66 ? 255 : 
							Math.round(Math.min(Math.max((351.97690566805693 + (0.114206453784165 * (temp-55)) + (-40.25366309332127 * Math.log(temp-55))), 0), 255)),

			G: temp < 66 && temp > 10 
							? Math.round(Math.min(Math.max((-155.25485562709179 + (-0.44596950469579133 * (temp-2)) + (104.49216199393888 * Math.log(temp-2))), 0), 255))
							: Math.round(Math.min(Math.max((325.4494125711974 + (0.07943456536662342 * (temp-50)) + (-28.0852963507957 * Math.log(temp-50))), 0), 255)),
			B: temp >= 66 ? 255 :
					temp <= 20 ? 0 
							: Math.round(Math.min(Math.max((-254.76935184120902 + (0.8274096064007395 * (temp-10)) + (115.67994401066147 * Math.log(temp-10))), 0), 255)),
		}
	}
}

function RGBToHex(r, g, b) {
	r = r.toString(16);
	g = g.toString(16);
	b = b.toString(16);
  
	r = r.length === 1 ? "0" + r : r;
	g = g.length === 1 ? "0" + g : g;
	b = b.length === 1 ? "0" + b : b;

	return "#" + r + g + b;
  }