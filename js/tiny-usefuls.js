import React from "react";

// BINARY 0101001001 BINARY 01010101001 BINARY

console.logb = function (bnum, maxlen = 0) {
	bnum = bnum.toString(2);

	if (maxlen > bnum.length) {
		bnum = bnum.padStart(maxlen, "0");
	}

	console.log(bnum);
}

export const Bath = {

	binlen (bx) {
		if (bx === 0) return 0;
		return Math.floor(Math.log2(bx)) + 1;
	},

	hammingDistance (a, b) {
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
	}
}

export const isFunction = func => {
	return !!(func && func.constructor && func.call && func.apply);
};

// ARRAYS [..., [..., ...]] ARRAYS [..., [..., ...]] ARRAYS

export class Uint8ArrayX2 extends Uint8Array {
	static frame (arr, x0, y0, w, h) { // HASN'T USED ANYWARE YET
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

export class Uint16ArrayX2 extends Uint16Array { // 16bit INT ARRAYS HAVE DIFFERENT METHODS WITH 8bit ONES NOW

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

console.logAsTable = (arr, cols, celllen, padchar, separator) => {
	let str = "";

	if (typeof cols === "number" && cols > 0) {
		for (let i = 0; i < arr.length; i++) {
			str += arr[i].toString(10).padStart(celllen, padchar) + separator;
			if ((i + 1) % cols === 0) str += "\n\n";
		}
	} else {
		for (let i = 0; i < arr.length; i++) {
			str += arr[i].toString(10).padStart(celllen, padchar) + separator;
		}
	}

	return console.log(str);
};

export class Rect8 extends Uint8ClampedArray {
	constructor (x0, y0, x, y, outset = 0) {
		if (typeof x0 === "number" && typeof y0 === "number" && typeof x === "number" && typeof y === "number" && typeof outset === "number") {

			super(4);

			if (x0 > x) {
				this[0] = x - outset;
				this[2] = x0 + outset;
			} else {
				this[0] = x0 - outset;
				this[2] = x + outset;
			}

			if (y0 > y) {
				this[1] = y - outset;
				this[3] = y0 + outset;
			} else {
				this[1] = y0 - outset;
				this[3] = y + outset;
			}
		} else return false;
	}
}

export const fitAndConvertLocales = operator => {

	switch (operator) {
		case "uk_UA":
			return "ukr";
		default:
			return "eng";
	}
};

export const LanguageContext = React.createContext(fitAndConvertLocales(Intl.DateTimeFormat().resolvedOptions().locale));