//Alpha numeric hash generator based on inputs.
export const cyrb53 = function(str, seed = 0) {
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
 export function round(num, precision){
	return +(Math.round(num + `e+${precision}`)  + `e-${precision}`);
}

/**
 * returns a scaled number between the min and max values provided
 * @param {number} min minimum value of output
 * @param {number} max maximum value of output
 * @param {number} num number to scale
 */
 export function numScale(min, max, num){
	return (num * (max - min) + min);
}

/**
 * Converts RGB color value to hexadecimal
 * 
 * @param {number} r r value of the rgb color 
 * @param {number} g g value of the rgb color 
 * @param {number} b b value of the rgb color 
 * @returns 
 */
export function RGBToHex(r, g, b) {
	r = r.toString(16);
	g = g.toString(16);
	b = b.toString(16);
  
	r = r.length === 1 ? "0" + r : r;
	g = g.length === 1 ? "0" + g : g;
	b = b.length === 1 ? "0" + b : b;

	return "#" + r + g + b;
}

Array.prototype.populate = function (x, y) {
	if(!Array.isArray(x) && !Array.isArray(y)){
		this.push({x: x, y: y});
	}
	else if (Array.isArray(x) && Array.isArray(y)){
		if(x.length !== y.length) 
			console.warn(`x and y array lengths are different! x is ${x.length}, and y is ${y.length}.`);
		for (let i = 0; i < x.length; i++) this.push({x: x[i], y: y[i]});
	} 
}