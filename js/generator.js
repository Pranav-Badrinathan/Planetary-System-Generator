import { Star } from "./classes.js";
import { addZUI } from "./pan&Zoom.js";

var seed;
var prng;

export function generate() {
	selectSeed();
	prng = new Math.seedrandom(seed);

	two.clear();

	two.height = $(document).height();
	two.width = $(document).width();

	genSystem(generateStar());
	addZUI();
}

function generateStar() {
	//the min and max values for each star mass class
	var minMaxMassMap = {
		M: { min: 0.02, max: 0.45 },
		K: { min: 0.45, max: 0.8 },
		G: { min: 0.8, max: 1.04 },
		F: { min: 1.04, max: 1.4 },
		A: { min: 1.4, max: 2.1 },
		B: { min: 2.1, max: 16 },
		O: { min: 16, max: 150 }
	}

	var starClass = Star.weightedSize(prng());

	// Get the selected class into a variable.
	var selClass = minMaxMassMap[Star.starClass[starClass]];

	console.log(Star.starClass[starClass]);

	var circle = two.makeCircle(two.width/2, two.height/2, 30);
	return new Star(prng() * (selClass.max - selClass.min) + selClass.min, circle);
}

function genSystem(star){
	var precision = 5;
	var innerLimit = round(star.mass * 0.1, precision); //Value in AU (1 AU = 149600000 km / 1.496e+8 km / 1.496 * 10^8 km)
	var outerLimit = round(star.mass * 40, precision); //Value in AU
	var frostLine = round(Math.sqrt(star.luminosity) * 4.85, precision); //Value in AU

	console.log(`inner:${innerLimit} AU, outer:${outerLimit} AU, Frost:${frostLine}`);
}

function selectSeed() {
	if($("#cseed").is(":checked")) seed = $("#seed").val();
	else seed = cyrb53(Math.random().toString());

	$("#seed").val(seed);

	console.log(seed);
}

//Alpha numeric hash generator based on inputs.
const cyrb53 = function(str, seed = 0) {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1>>>16), 2246822507) ^ Math.imul(h2 ^ (h2>>>13), 3266489909);
    h2 = Math.imul(h2 ^ (h2>>>16), 2246822507) ^ Math.imul(h1 ^ (h1>>>13), 3266489909);
    return (h2>>>0).toString(16).padStart(8,0)+(h1>>>0).toString(16).padStart(8,0);
};

function round(num, precision){
	return +(Math.round(num + `e+${precision}`)  + `e-${precision}`);
}