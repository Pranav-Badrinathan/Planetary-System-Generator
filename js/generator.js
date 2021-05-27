import { Star } from "./classes.js";
import { addZUI } from "./pan&Zoom.js";

var seed;
var prng;

export function generate(two) {
	selectSeed();
	prng = new Math.seedrandom(seed);

	two.clear();

	two.height = $(document).height();
	two.width = $(document).width();

	generateStar(two);
	addZUI(two);
}

function generateStar(two) {
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
	var star = new Star(prng() * (selClass.max - selClass.min) + selClass.min, circle);
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