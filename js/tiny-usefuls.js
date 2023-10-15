console.logb = function (bnum, pad = 0) {
	bnum = bnum.toString(2);

	if (pad > bnum.length) {
		bnum = bnum.padStart(pad, "0");
	}

	console.log(bnum);
};

Math.hammingDistance = (a, b) => {
	if (a === b) return 0;

	a ^= b;
	b = 0;

	while (a > 0) {
		if (a % 2) {
			b++;
		}

		a >>= 1;
	}

	return b;
};

Math.fitinter = function (min, x, max) {
	return Math.max(Math.min(x, max), min);
}

Math.binlen = function (bx) {
	if (bx === 0) return 0;
	return Math.floor(Math.log2(bx)) + 1;
}

String.fromCharCodeS = function (code) {
	if ((0 <= code && code <= 0x1f) || (0x7f <= code && code <= 0x9f)) {
		code = 0xfffd;
	}
	return String.fromCharCode(code);
}

String.prototype.decodeAsAN2 = function () { // MUST BE INTAGRATED INTO QR CLASS !!!!!!!!!!!
	let res = 0n, _res = "";
	let leadingZeroes = 0;

	for (let i = 0; i < this.length - (this.length % 2); i += 2) {
		res += BigInt((45 * charToInt45(this[i])) + charToInt45(this[i + 1] || 0));
		res <<= 11n;

		if (i ==0) {
			leadingZeroes = 11 - (res.toString(2).length % 11);
		}
	}

	if (this.length % 2) {
		_res += "0".repeat(leadingZeroes);

		res >>= 5n;
		res += BigInt(charToInt45(this[this.length - 1] || 0));
	} else {
		res >>= 11n;
	}

	_res += res.toString(2);

	return _res;
}

String.prototype.decodeAsASCII2 = function () { // MUST BE INTAGRATED INTO QR CLASS !!!!!!!!!!!
	let _res, res = "";

	for (let i = 0; i < this.length; i++) {
		_res = this[i].charCodeAt(0).toString(2);
		res += ("0".repeat(8 - (_res.length % 8))) + _res;
	}

	return res;
}

String.sjoin = (arr, func) => {
	let str = "";

	for (let i = 0; i < arr.length; i++) {
		str += func(arr[i]);
	}

	return str;
};

isFunction = func => {
	return !!(func && func.constructor && func.call && func.apply);
};

// DATATYPES vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv



// ARRAYS vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

Object.defineProperty(Array.prototype, "last", {
	configurable: true,

	get () {
		return this[this.length - 1];
	},

	set (data) {
		this[this.length - 1] = data;
	}
});

class Uint8ArrayX2 extends Uint8Array {
	static frame (arr, x0, y0, w, h) {
		if (
		// vvvv ARE GOOD FOR LIB NOT FOR PERSONAL PROJECT vvvv
			// arr instanceof Uint8ArrayX2 &&
			// typeof x0 === "number" &&
			// x0 >= 0 &&
			// x0 < arr.columns &&
			// typeof y0 === "number" &&
			// y0 >= 0 &&
			// y0 < arr.rows &&
			typeof w === "number" &&
			w > 0 &&
			typeof h === "number" &&
			h > 0
		) {
			if (x0 + w >= arr.columns) w = arr.columns - x0;
			if (y0 + h >= arr.rows) h = arr.rows - y0;

			if (w === 0) {
				const narr = new Uint8ArrayX2(h, 1);

				for (let i = 0; i <= h; i++) {
					narr[i] = arr.x2get(x0, i + x0);
				}

				return narr; 
			}

			const narr = new Uint8ArrayX2(h, w);

			for (let y = 0; y <= h; y++) {
				for (let x = 0; x <= w; x++) {
					narr.x2set(x, y, arr.x2get(x + x0, y + y0));
				}
			}

			return narr;
			// let str = "";
			// for (let i = 0; i < narr.length; i++) {
			// 	switch (narr[i]) {
			// 		case 0:
			// 			str += ". ";
			// 			break;
			// 		case 1:
			// 			str += "# ";
			// 			break;
			// 		case 2:
			// 			str += ", ";
			// 			break;
			// 		case 3:
			// 			str += "& ";
			// 			break;
			// 		case 4:
			// 			str += "' ";
			// 			break;
			// 		case 5:
			// 			str += "8 ";
			// 			break;
			// 		case 6:
			// 			str += "` ";
			// 			break;
			// 		case 7:
			// 			str += "S ";
			// 			break;
			// 	}

			// 	if ((i + 1) % narr.columns === 0) {
			// 		str += "\n";
			// 	}
			// }
			// console.log(str);
		} else throw new Error("..."); // <<<
	}

	static paste (orig, modf, x, y) {
		if (orig instanceof Uint8ArrayX2 && modf instanceof Uint8ArrayX2 && typeof x === "number" && x < orig.columns && typeof y === "number" && y < orig.rows) {
			if (x < 0) x = 0;
			if (y < 0) y = 0;

			const w = ((x + modf.columns) > orig.columns) ? modf.columns - x : modf.columns;
			const h = ((y + modf.rows) > orig.rows) ? modf.rows - x : modf.rows;

			for (let i = 0; i < w; i++) {
				for (let j = 0; j < h; j++) {
					orig.x2set(i + x, j + y, modf.x2get(i, j));
				}
			}
		} else throw new Error("..."); // <<<
	}

	static log (arr) {
		if (arr instanceof Uint8ArrayX2) {
			let str = "";

			for (let y = 0; y < arr.rows; y += 2) {
				for (let x = 0; x < arr.columns; x++) {
					if (arr.x2get(x, y)) {
						if (arr.x2getD(x, y + 1, 0)) {
							str += "\u2588";
						} else {
							str += "\u2580";
						}
					} else {
						if (arr.x2getD(x, y + 1, 0)) {
							str += "\u2584";
						} else {
							str += "\u00a0";
						}
					}
				}
				str += "\n";
			}

			console.log(str);
		}
	}

	static reflectByDiagonal (arr) {
		if (arr instanceof Uint8ArrayX2) {
			const narr = new Uint8ArrayX2(arr.columns, arr.rows);

			for (let x = 0; x < arr.columns; x++) {
				for (let y = 0; y < arr.rows; y++) {
					narr.x2set(y, x, arr.x2get(x, y));
				}
			}
		} else throw new Error("..."); // <<<
	}

	constructor (arrOrows, columns) {
		if (!columns) {
			if (arrOrows instanceof Uint8ArrayX2) {
				super(arrOrows.rows * arrOrows.columns);
				this.rows = arrOrows.rows;
				this.columns = arrOrows.columns;

				for (let i = 0; i < arrOrows.length; i++) {
					this[i] = arrOrows[i];
				}
			}
		} else if (typeof columns === "number" && columns > 0) {

			if (typeof arrOrows === "number" && 0 < arrOrows) {
				super(arrOrows * columns);
				this.rows = arrOrows;
				this.columns = columns;

			} else if (
				// arrOrows.length > columns &&
				(arrOrows instanceof Array ||
				arrOrows instanceof Uint8ArrayX2 ||
				arrOrows instanceof Int8Array ||
				arrOrows instanceof Uint8Array ||
				arrOrows instanceof Uint8ClampedArray)
				) {
				super(Math.ceil(arrOrows.length / columns) * columns);
				this.rows = Math.ceil(arrOrows.length / columns);
				this.columns = columns;
				for (let i = 0; i < arrOrows.length; i++) {
					this[i] = arrOrows[i];
				}
			} else throw new Error("First argument is invalid or was lost!");

		} else throw new Error("..."); // <<<
	}

	x2get (x = 0, y = 0) {
		return this[(y * this.columns) + x];
	}

	x2getD (x = 0, y = 0, wrong) {
		if (0 <= x && x < this.columns && 0 <= y && y < this.rows) {
			return this[(y * this.columns) + x];
		} else {
			return wrong;
		}
	}

	x2set (x = 0, y = 0, int) {
		this[(y * this.columns) + x] = int;
	}

	x2setD (x = 0, y = 0, int) {
		if (0 <= x && x < this.columns && 0 <= y && y < this.rows) {
			this[(y * this.columns) + x] = int;
		}
	}
}

class Uint16ArrayX2 extends Uint16Array {

	constructor (arrOrows, columns) {
		if (!columns) {
			if (arrOrows instanceof Uint16ArrayX2) {
				super(arrOrows.rows * arrOrows.columns);
				this.rows = arrOrows.rows;
				this.columns = arrOrows.columns;

				for (let i = 0; i < arrOrows.length; i++) {
					this[i] = arrOrows[i];
				}
			}
		} else if (typeof columns === "number" && columns > 0) {

			if (typeof arrOrows === "number" && 0 < arrOrows) {
				super(arrOrows * columns);
				this.rows = arrOrows;
				this.columns = columns;

			} else if (
				// arrOrows.length > columns &&
				(arrOrows instanceof Array ||
				arrOrows instanceof Uint16ArrayX2 ||
				arrOrows instanceof Int16Array ||
				arrOrows instanceof Uint16Array ||
				arrOrows instanceof Uint16ClampedArray)
				) {
				super(Math.ceil(arrOrows.length / columns) * columns);
				this.rows = Math.ceil(arrOrows.length / columns);
				this.columns = columns;
				for (let i = 0; i < arrOrows.length; i++) {
					this[i] = arrOrows[i];
				}
			} else throw new Error("First argument is invalid or was lost!");

		} else throw new Error("..."); // <<<
	}

	x2get (x = 0, y = 0) {
		return this[(y * this.columns) + x];
	}

	x2getD (x = 0, y = 0, wrong) {
		if (0 <= x && x < this.columns && 0 <= y && y < this.rows) {
			return this[(y * this.columns) + x];
		} else {
			return wrong;
		}
	}

	x2set (x = 0, y = 0, int) {
		this[(y * this.columns) + x] = int;
	}

	x2setD (x = 0, y = 0, int) {
		if (0 <= x && x < this.columns && 0 <= y && y < this.rows) {
			this[(y * this.columns) + x] = int;
		}
	}
}

console.logAsTable = (arr, cellen, padchar, separator, cols) => {
	let str = "";

	if (typeof cols === "number" && cols > 0) {
		for (let i = 0; i < arr.length; i++) {
			str += arr[i].toString(10).padStart(cellen, padchar) + separator;
			if ((i + 1) % cols === 0) str += "\n\n";
		}
	} else {
		for (let i = 0; i < arr.length; i++) {
			str += arr[i].toString(10).padStart(cellen, padchar) + separator;
		}
	}

	return console.log(str);
};

Uint16Array.prototype.inject = function (_i, arr) {
	for (let i = 0; i < arr.length; i++) {
		this[_i + i] = arr[i];
	}
	return this;
}

function setCSSvar (name, value) { // ???????????????????????????????????????
	console.log("setting");
	document.documentElement.style.setProperty(name, value);
}

function getCSSvar (name) { // ???????????????????????????????????
	return document.documentElement.style.getPropertyValue(name);
}

SVGPolygonElement.create = (points) => {
	const elem = document.createElementNS("http://www.w3.org/2000/svg", "polygon");

	let str = "";
	for (let i = 0; i < points.length; i += 2) {
		str += points[i] + "," + points[i + 1] + " ";
	}

	elem.setAttribute("points", str);

	return elem;
};