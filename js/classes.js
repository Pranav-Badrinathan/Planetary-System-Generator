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

/*
Planet Maker Equation: g = (M/R^2) = R(d), where 'M' is Mass, 'R' is Radius and 'd' is Density

Guidelines (Dwarf Planet):
M = 0.0001 to 0.1 M⊕ (⊕ = earth)
R = > 0.03 R⊕

Guidelines (Gas Giant): (Can use clamped random Mass and Radius values.
						 The density will then determine the composition)
M = 10M⊕ to 13Mj (Jupiter mass)
R = (for 2-13 Mj) ~1 Rj. 
	(for < 2Mj, or Puffy giants)	>1 Rj.

Guidelines (Gas Dwarf):
M = 1 M⊕ to 20 M⊕
R = > 2 R⊕

Puffy giants will most likely be near the host star, Gas giants right after the frost line, and 
Gas Dwarfs at the outer extreme reaches of the Planetary System.

Guidelines (Habitable Earth Like Terrestrial Planets):
M = (0.4 - 2.35 M⊕)  or (0.1 - 3.5 M⊕)
R = (0.78 - 1.25 R⊕) or (0.5 - 1.5 R⊕)
g = (0.68 - 1.5 g⊕)  or (0.4 - 1.6 g⊕)

*/
export class Planet {
	
	static planetType = {ROCKY:0, WATER:1, ICEGIANT:2, GASGIANT:3}
	static lines;

	static a = [0.16257948306584155, 0.1894919288606639, 0.2507213700025281, 0.32997631252628495, 0.4297178432610279, 0.5596259406653193, 0.7249416709995805, 0.9341717378370232, 1.197443383193676, 1.5268200615276568, 1.9365349153991862, 2.45611658624142, 3.082545453177321, 3.8686208904241597, 4.8041002970488655, 5.965789959215811, 7.369572308714649, 9.055394748132745, 11.068554867195417, 13.457526214016335, 16.362639960076606, 19.685693720483712, 23.558773573569113, 28.193866072049254, 33.56303234460062, 39.53456458873703, 46.56855141017863, 54.85402464911093, 64.27304429202361, 74.91480900586292, 86.85548697655959, 100.70259691580331, 116.13813777751635, 133.94387948804518, 153.66518874021477, 175.35529772592386, 200.11337475772254, 228.3669970411424, 259.23591595457526, 295.82751692915133, 335.81523735621, 335.81523735621, 381.20819459677205, 432.7370275744368, 491.231137441935, 554.6748752079665, 629.6516186426952, 710.9953472574794, 802.8477476346251, 911.3706180260087, 1023.6843467049983, 1155.9325601933956, 1298.3851402622697, 1450.7052428622906, 1820.6474790501898, 2034.2368079848818, 2260.9020999127406, 2512.9036308653494, 2792.904480737349, 3104.1044880167674, 3431.7938012492923, 3794.076114305548, 4000.0]
	static b = [0.5000000166258108, 0.5244829283514122, 0.5718318192674093, 0.6223091841483236, 0.6759974141412317, 0.7316202576707931, 0.7918198949241064, 0.8506984408354084, 0.9156281138208829, 0.9819045622869076, 1.0510310704993087, 1.1229685070584594, 1.195422600251989, 1.2702121981584498, 1.3471998552722086, 1.4288537400890697, 1.5071147460477428, 1.5867576746885605, 1.667519855641035, 1.7459753061482508, 1.824761510352382, 1.9035972035333415, 1.9821884263380136, 2.056443003616315, 2.129557396219183, 2.1971954915897474, 2.2669567525473506, 2.334659320116367, 2.3955523189118724, 2.4580062953283477, 2.517480218141384, 2.5736534887318854, 2.6262436356842076, 2.670064883999523, 2.7146173294428664, 2.754870348078673, 2.7905501373981787, 2.8215271938129387, 2.8475723598714553, 2.873889799268495, 2.8950866779576545, 2.8950866779576545, 2.9164722235770144, 2.9380157408263505, 2.954245004632207, 2.965136198151786, 2.976067543417781, 2.987039188454627, 2.998051281832466, 3.0090706203256583, 3.0146121751184425, 3.0201639353312375, 3.0201639353312375, 3.0257259197585147, 3.0257259197585147, 3.0201639353312375, 3.0201639353312375, 3.0146121751184425, 3.0090706203256583, 2.998051281832466, 2.987039188454627, 2.976067543417781, 2.965136198151786]

	constructor(mass, type){
		Planet.initLines();

		this.mass = mass;
		this.type = type;
	}
	
	static initLines(){
		$.getJSON("js/planetdata.json", function (data) {
			Planet.lines = data;
			console.log(Planet.lines);
		});
	}
}
