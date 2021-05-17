var seed;

function generate(two) {
	seed = cyrb53(Math.random().toString());
	let prng = new Math.seedrandom(seed);

	var star = new Star(prng() * (16 - 0.02) + 0.02) 

	two.clear();

	two.height = $(document).height();
	two.width = $(document).width();

	var circle = two.makeCircle(two.width/2, two.height/2, 50);
		circle.fill = '#ffe100';
		circle.stroke = "orangered";
	two.update();
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