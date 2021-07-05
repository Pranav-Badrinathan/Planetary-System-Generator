import { Planet, Star, System } from "./classes.js";
import { addZUI } from "./pan&Zoom.js";
import * as Util from "./utilities.js"

var seed;
var prng;
var system;
const precision = 5;

export function generate() {
	selectSeed();
	prng = new Math.seedrandom(seed);

	two.clear();

	two.height = $(document).height();
	two.width = $(document).width();

	system = genSystem();
	new Planet(1);

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
	return new Star(Util.numScale(selClass.min, selClass.max, prng()), circle);
}

function genSystem(){
	const star = generateStar();
	const innerLimit = Util.round(star.mass * 0.1, precision); //Value in AU (1 AU = 149600000 km / 1.496e+8 km / 1.496 * 10^8 km)
	const outerLimit = Util.round(star.mass * 40, precision); //Value in AU
	const frostLine = Util.round(Math.sqrt(star.luminosity) * 4.85, precision); //Value in AU

	//The distance from the star for the orbit
	const orbits = calculateOrbits(frostLine, innerLimit, outerLimit, star.svgRef.radius);

	console.table(orbits);

	console.log(`inner:${innerLimit} AU, outer:${outerLimit} AU, Frost:${frostLine}`);

	return new System(star, orbits, innerLimit, outerLimit, frostLine);
}

function selectSeed() {
	if($("#cseed").is(":checked")) seed = $("#seed").val();
	else seed = Util.cyrb53(Math.random().toString());

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
	var orbits = [frost + Util.round(Util.numScale(0.4, 1, prng()), precision)];
	var num;

	//Calculate the orbits moving outwards from the initial gas giant
	var i = 0;
	while (true) {
	 	num = Util.round(Util.numScale(1.4, 2.2, prng()), precision);
		
		//make sure that the orbit doesn't excede the outer limit and is at least 0.15AU away from the previous orbit 
	 	if(orbits[i] * num < outer && (orbits[i] * num - orbits[i]) > 0.15) orbits.push(orbits[i] * num);
		else break;
	 	i++;
	}

	//Calculate the orbits moving inwards from the initial gas giant
	while (true) {
	 	num = Util.round(Util.numScale(1.4, 2.2, prng()), precision);

		//make sure that the orbit doesn't cross the inner limit and is at least 0.15AU away from the previous orbit
	 	if(orbits[0] / num > inner && (orbits[0] - orbits[0] / num) > 0.15) orbits.unshift(orbits[0] / num);
		else break;
	}

	for (let j = 0; j < orbits.length; j++) {
		var a = two.makeCircle(two.width/2, two.height/2, starRad * (orbits[j] + 1));
		a.fill = "transparent";
		a.stroke = j==orbits.length-i-1 ? "#fa0015":"white";
	}
	return orbits;
}