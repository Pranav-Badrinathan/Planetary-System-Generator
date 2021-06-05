import { Star } from "./classes.js";
import { addZUI } from "./pan&Zoom.js";

var seed;
var prng;
const precision = 5;

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
	const minMaxMassMap = {
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
	return new Star(randScale(selClass.min, selClass.max), circle);
}

//TODO: Make this another type alongside star. Will be useful to access everything in 1 variable
function genSystem(star){
	const innerLimit = round(star.mass * 0.1, precision); //Value in AU (1 AU = 149600000 km / 1.496e+8 km / 1.496 * 10^8 km)
	const outerLimit = round(star.mass * 40, precision); //Value in AU
	const frostLine = round(Math.sqrt(star.luminosity) * 4.85, precision); //Value in AU

	//The distance from the star for the orbit
	var orbits = calculateOrbits(frostLine, innerLimit, outerLimit, star.svgRef.radius);

	console.table(orbits);

	console.log(`inner:${innerLimit} AU, outer:${outerLimit} AU, Frost:${frostLine}`);
}

function selectSeed() {
	if($("#cseed").is(":checked")) seed = $("#seed").val();
	else seed = cyrb53(Math.random().toString());

	$("#seed").val(seed);

	console.log(seed);
}

/**
 * Calculates all stable orbits around the host star based on it's 
 * inner limit, outer limit, and frost line
 * 
 * @param {number} frost frost line
 * @param {number} inner inner limit
 * @param {number} outer outer limit
 * @param {number} starRad
 * @returns 
 */
function calculateOrbits(frost, inner, outer, starRad){
	//Create the orbit array, initializing it with the orbit of the gas giant nearest to the frost line.
	var orbits = [frost + round((prng() + 0.5), precision)];
	var num;

	//Calculate the orbits moving outwards from the initial gas giant
	var i = 0;
	while (true) {
	 	num = round(randScale(1.4, 2.2), precision);
		
		//make sure that the orbit doesn't excede the outer limit and is at least 0.15AU away from the previous orbit 
	 	if(orbits[i] * num < outer && (orbits[i] * num - orbits[i]) > 0.15) orbits.push(orbits[i] * num);
		else break;
	 	i++;
	}

	//Calculate the orbits moving inwards from the initial gas giant
	while (true) {
	 	num = round(randScale(1.4, 2.2), precision);

		//make sure that the orbit doesn't cross the inner limit and is at least 0.15AU away from the previous orbit
	 	if(orbits[0] / num > inner && (orbits[0] - orbits[0] / num) > 0.15) orbits.unshift(orbits[0] / num);
		else break;
	}

	for (let i = 0; i < orbits.length; i++) {
		var a = two.makeCircle(two.width/2, two.height/2, starRad * (orbits[i] + 1));
		a.fill = "transparent";
		a.stroke = "white";
	}

	console.log("heretoo")
	return orbits;
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

/**
 * 
 * @param {number} num number to round
 * @param {number} precision number of decimal places to round to
 * @returns rounded number
 */
function round(num, precision){
	return +(Math.round(num + `e+${precision}`)  + `e-${precision}`);
}

/**
 * returns a random number between the min and max values provided
 * @param {number} min minimum value of output
 * @param {number} max maximum value of output
 */
function randScale(min, max){
	return (prng() * (max - min) + min);
}