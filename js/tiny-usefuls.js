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

const Alphanumerical = {

	fromCharCode (code) {
		switch (code) {
			case 0:
				return "0";
			case 1:
				return "1";
			case 2:
				return "2";
			case 3:
				return "3";
			case 4:
				return "4";
			case 5:
				return "5";
			case 6:
				return "6";
			case 7:
				return "7";
			case 8:
				return "8";
			case 9:
				return "9";
			case 10:
				return "A";
			case 11:
				return "B";
			case 12:
				return "C";
			case 13:
				return "D";
			case 14:
				return "E";
			case 15:
				return "F";
			case 16:
				return "G";
			case 17:
				return "H";
			case 18:
				return "I";
			case 19:
				return "J";
			case 20:
				return "K";
			case 21:
				return "L";
			case 22:
				return "M";
			case 23:
				return "N";
			case 24:
				return "O";
			case 25:
				return "P";
			case 26:
				return "Q";
			case 27:
				return "R";
			case 28:
				return "S";
			case 29:
				return "T";
			case 30:
				return "U";
			case 31:
				return "V";
			case 32:
				return "W";
			case 33:
				return "X";
			case 34:
				return "Y";
			case 35:
				return "Z";
			case 36:
				return " ";
			case 37:
				return "$";
			case 38:
				return "%";
			case 39:
				return "*";
			case 40:
				return "+";
			case 41:
				return "-";
			case 42:
				return ".";
			case 43:
				return "/";
			case 44:
				return ":";
			default:
				throw new Error("Code of alphanumerical char cannot be greater that 44");
		}
	},

	charCode (char) {
		switch (char[0]) {
			case "0":
				return 0;
			case "1":
				return 1;
			case "2":
				return 2;
			case "3":
				return 3;
			case "4":
				return 4;
			case "5":
				return 5;
			case "6":
				return 6;
			case "7":
				return 7;
			case "8":
				return 8;
			case "9":
				return 9;
			case "A":
				return 10;
			case "B":
				return 11;
			case "C":
				return 12;
			case "D":
				return 13;
			case "E":
				return 14;
			case "F":
				return 15;
			case "G":
				return 16;
			case "H":
				return 17;
			case "I":
				return 18;
			case "J":
				return 19;
			case "K":
				return 20;
			case "L":
				return 21;
			case "M":
				return 22;
			case "N":
				return 23;
			case "O":
				return 24;
			case "P":
				return 25;
			case "Q":
				return 26;
			case "R":
				return 27;
			case "S":
				return 28;
			case "T":
				return 29;
			case "U":
				return 30;
			case "V":
				return 31;
			case "W":
				return 32;
			case "X":
				return 33;
			case "Y":
				return 34;
			case "Z":
				return 35;
			case " ":
				return 36;
			case "$":
				return 37;
			case "%":
				return 38;
			case "*":
				return 39;
			case "+":
				return 40;
			case "-":
				return 41;
			case ".":
				return 42;
			case "/":
				return 43;
			case ":":
				return 44;
			default:
				throw new Error("Only following chars can be converted into code: \"0-9A-Z $%*+-./:\"");
		}
	}
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

function lineWidthCompensator (w, angle) {
	return w * (1 + Math.abs(0.33 * Math.sin(angle * 2)));
}