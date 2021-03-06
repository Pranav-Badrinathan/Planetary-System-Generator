import Two from "../libs/two.module.js";
import * as Util from "../js/utilities.js"

export class Star {

	static starClass = { 0:"M", 1:"K", 2:"G", 3:"F", 4:"A", 5:"B", 6:"O" };

	constructor(mass, svgRef){
		this.svgRef = svgRef;

		this.mass = mass;
		this.luminosity = Math.pow(mass, 3.5);
		this.diameter = Math.pow(mass, 0.74);
		this.surfTemp = Math.pow(mass, 0.505) * 5778;
		this.lifetime = Math.pow(mass, -2.5);

		this.setDisplayProps();

		console.log(`${this.mass} : ${this.luminosity} : ${this.diameter} : ${this.surfTemp} : ${this.lifetime}`);
	}

	setDisplayProps() {
		this.svgRef.stroke = "transparent";
		this.svgRef.radius *= this.diameter;

		var col = Star.kelvinToRGB(this.surfTemp);
		var rGrad = two.makeRadialGradient(
			0,0,
			this.svgRef.radius,
			// new Two.Stop(0, "white"),
			new Two.Stop(0, Util.RGBToHex(col.R, col.G, col.B)),
			// new Two.Stop(0.95, "#57a8eb"),
			// new Two.Stop(1, "#379bed"),
		);

		this.svgRef.fill = rGrad;
	}

	/**
	 * Returns a number that coressponds with a class from `Star.starClass`
	 * 
	 * @param {number} selector A number between 0 and 1, used to calculate the weights accordingly.
	 */
	static weightedSize(selector) {
		// The weights per star mass class. (All add upto 100)
		// Class:	    M   K   G   F   A  B  O
		const weights = [ 23, 24, 25, 17, 8, 3, 0 ];

		//clamp the value between 0 and 1, and multiply by 100 to convert to percentage.
		selector = Math.min(Math.max(selector, 0), 1) * 100;

		var total = 0;

		for (let i = 0; i < weights.length; i++) {
			total += weights[i];
			if(total >= selector) return i;
		}

		// execution should never reach here.
		return null;
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

export class System {
	constructor(star, orbits, innerLimit, outerLimit, frostLine) {
		this.star = star;
		this.orbits = orbits;
		this.innerLimit = innerLimit //Value in AU (1 AU = 149600000 km / 1.496e+8 km / 1.496 * 10^8 km)
		this.outerLimit = outerLimit //Value in AU
		this.frostLine = frostLine //Value in AU
	}
}

