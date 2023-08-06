"use strict";

class CodewordArray extends Uint8ClampedArray {
	constructor (length) {
		super(length);
	}
}

class Rect8 extends Uint8ClampedArray {
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

class BrushSprite {
	constructor (sprite, fastsprite) {
		if (sprite instanceof Uint8ArrayX2) {
			this.sprite = sprite;
			this.width = sprite.columns;
			this.height = sprite.rows;
			this.width2 = Math.floor(sprite.columns / 2);
			this.height2 = Math.floor(sprite.rows / 2);
		} else throw new Error("..."); // <<<

		if (fastsprite instanceof Uint8ArrayX2) {
			if (fastsprite.columns === sprite.columns && fastsprite.rows === sprite.rows) {
				this.fastsprite = fastsprite;
			} else throw new Error("Uint8ArrayX2 given to constructor as fastsprite has a different size than given sprite! They must be the same size");
		} else {
			this.fastsprite = sprite;
		}
	}
}

class QRT {
	static ctx;

	static init (ctx) {
		if (ctx instanceof CanvasRenderingContext2D) {
			this.ctx = ctx;
			this.canvas = this.ctx.canvas;
		} else if (ctx instanceof HTMLCanvasElement) {
			this.canvas = ctx;
			this.ctx = ctx.getContext("2d");
		} else {
			throw new Error("..."); // <<<
		}
	}

	static palette = ["white", "black", "tomato", "red", "violet", "purple", "cyan", "blue", "#99e550", "#954242"];

	static sprites = {
		circles: {
			2: new BrushSprite(
				new Uint8ArrayX2([
					1,1,
					1,1,
				], 2)
			),

			3: new BrushSprite(
				new Uint8ArrayX2([
					0,1,0,
					1,1,1,
					0,1,0
				], 3)
			),

			4: new BrushSprite(
				new Uint8ArrayX2([
					0,1,1,0,
					1,1,1,1,
					1,1,1,1,
					0,1,1,0
				], 4)
			),

			5: new BrushSprite(
				new Uint8ArrayX2([
					0,1,1,1,0,
					1,1,1,1,1,
					1,1,1,1,1,
					1,1,1,1,1,
					0,1,1,1,0
				], 5),

				new Uint8ArrayX2([
					0,1,1,1,0,
					1,1,0,1,1,
					1,0,0,0,1,
					1,1,0,1,1,
					0,1,1,1,0
				], 5)
			),

			6: new BrushSprite(
				new Uint8ArrayX2([
					0,1,1,1,1,0,
					1,1,1,1,1,1,
					1,1,1,1,1,1,
					1,1,1,1,1,1,
					1,1,1,1,1,1,
					0,1,1,1,1,0
				], 6),
				
				new Uint8ArrayX2([
					0,1,1,1,1,0,
					1,1,0,0,1,1,
					1,0,0,0,0,1,
					1,0,0,0,0,1,
					1,1,0,0,1,1,
					0,1,1,1,1,0
				], 6)
			),

			7: new BrushSprite(
				new Uint8ArrayX2([
					0,0,1,1,1,0,0,
					0,1,1,1,1,1,0,
					1,1,1,1,1,1,1,
					1,1,1,1,1,1,1,
					1,1,1,1,1,1,1,
					0,1,1,1,1,1,0,
					0,0,1,1,1,0,0
				], 7),
				
				new Uint8ArrayX2([
					0,0,1,1,1,0,0,
					0,1,1,0,1,1,0,
					1,1,0,0,0,1,1,
					1,0,0,0,0,0,1,
					1,1,0,0,0,1,1,
					0,1,1,0,1,1,0,
					0,0,1,1,1,0,0
				], 7)
			),

			8: new BrushSprite(
				new Uint8ArrayX2([
					0,0,1,1,1,1,0,0,
					0,1,1,1,1,1,1,0,
					1,1,1,1,1,1,1,1,
					1,1,1,1,1,1,1,1,
					1,1,1,1,1,1,1,1,
					1,1,1,1,1,1,1,1,
					0,1,1,1,1,1,1,0,
					0,0,1,1,1,1,0,0
				], 8),
				
				new Uint8ArrayX2([
					0,0,1,1,1,1,0,0,
					0,1,1,0,0,1,1,0,
					1,1,0,0,0,0,1,1,
					1,0,0,0,0,0,0,1,
					1,0,0,0,0,0,0,1,
					1,1,0,0,0,0,1,1,
					0,1,1,0,0,1,1,0,
					0,0,1,1,1,1,0,0
				], 8)
			),

			9: new BrushSprite(
				new Uint8ArrayX2([
					0,0,0,1,1,1,0,0,0,
					0,1,1,1,1,1,1,1,0,
					0,1,1,1,1,1,1,1,0,
					1,1,1,1,1,1,1,1,1,
					1,1,1,1,1,1,1,1,1,
					1,1,1,1,1,1,1,1,1,
					0,1,1,1,1,1,1,1,0,
					0,1,1,1,1,1,1,1,0,
					0,0,0,1,1,1,0,0,0
				], 9),
				
				new Uint8ArrayX2([
					0,0,0,1,1,1,0,0,0,
					0,1,1,1,0,1,1,1,0,
					0,1,0,0,0,0,0,1,0,
					1,1,0,0,0,0,0,1,1,
					1,0,0,0,0,0,0,0,1,
					1,1,0,0,0,0,0,1,1,
					0,1,0,0,0,0,0,1,0,
					0,1,1,1,0,1,1,1,0,
					0,0,0,1,1,1,0,0,0
				], 9)
			),

			10: new BrushSprite(
				new Uint8ArrayX2([
					0,0,0,1,1,1,1,0,0,0,
					0,0,1,1,1,1,1,1,0,0,
					0,1,1,1,1,1,1,1,1,0,
					1,1,1,1,1,1,1,1,1,1,
					1,1,1,1,1,1,1,1,1,1,
					1,1,1,1,1,1,1,1,1,1,
					1,1,1,1,1,1,1,1,1,1,
					0,1,1,1,1,1,1,1,1,0,
					0,0,1,1,1,1,1,1,0,0,
					0,0,0,1,1,1,1,0,0,0
				], 10),
				
				new Uint8ArrayX2([
					0,0,0,1,1,1,1,0,0,0,
					0,0,1,1,0,0,1,1,0,0,
					0,1,1,0,0,0,0,1,1,0,
					1,1,0,0,0,0,0,0,1,1,
					1,0,0,0,0,0,0,0,0,1,
					1,0,0,0,0,0,0,0,0,1,
					1,1,0,0,0,0,0,0,1,1,
					0,1,1,0,0,0,0,1,1,0,
					0,0,1,1,0,0,1,1,0,0,
					0,0,0,1,1,1,1,0,0,0
				], 10)
			)
		}
	};

	constructor (settings) {
		this.info = {};

		if (settings && 0 < settings.version && settings.version <= 40) {

			this.info.version = parseInt(settings.version, 10);

		} else throw new Error("An argument was lost or its property has inappropriate value!");

		if (settings.masktype && 0 <= settings.masktype && settings.masktype < 8) {

			this.masktype = parseInt(settings.masktype, 10);
			//	^^^^^^^^^ - sets info.masktype through the setter
		} else throw new Error("An argument was lost or its property has inappropriate value!");

		switch (settings.ecdepth) {
			case "L": case "l": case 1: case "1":
				this.info.ecdepth = "L";
				break;
			case "M": case "m": case 0: case "0":
				this.info.ecdepth = "M";
				break;
			case "Q": case "q": case 3: case "3":
				this.info.ecdepth = "Q";
				break;
			case "H": case "h": case 2: case "2":
				this.info.ecdepth = "H";
				break;
			default:
				throw new Error("An argument was lost or its property has inappropriate value!");
		}

		if (settings.datatype && (settings.datatype == 2 || settings.datatype == 4)) {

			this.info.datatype = parseInt(settings.datatype, 10);

		} else throw new Error("An argument was lost or its property has inappropriate value!");

		if (settings.maskApplication && 0 <= settings.maskApplication && settings.maskApplication <= 2) {

			this.maskApplication = parseInt(settings.maskApplication, 10);
			//	^^^^^^^^^^^^^^^^ - sets info.maskApplication through the setter
		} else throw new Error("An argument was lost or its property has inappropriate value!");

		Object.assign(this.info, new QRTable(this.info.version, this.info.ecdepth));

		this.modules = 17 + (this.info.version * 4);

		if (settings.matrix instanceof Uint8Array && settings.matrix.columns === settings.matrix.rows && settings.matrix.rows === this.modules) {

			this.matrix = settings.matrix;

		} else {

			this.matrix = new Uint8ArrayX2(this.modules, this.modules);

			function applySmallBaseSquareOn (mx, x0, y0, c0 = 2, c1 = 3) {
				mx.x2set(x0 - 2, y0 - 2, c1);
				mx.x2set(x0 - 1, y0 - 2, c1);
				mx.x2set(x0, y0 - 2, c1);
				mx.x2set(x0 + 1, y0 - 2, c1);
				mx.x2set(x0 + 2, y0 - 2, c1);
				mx.x2set(x0 + 2, y0 - 1, c1);
				mx.x2set(x0 + 2, y0, c1);
				mx.x2set(x0 + 2, y0 + 1, c1);
				mx.x2set(x0 + 2, y0 + 2, c1);
				mx.x2set(x0 + 1, y0 + 2, c1);
				mx.x2set(x0, y0 + 2, c1);
				mx.x2set(x0 - 1, y0 + 2, c1);
				mx.x2set(x0 - 2, y0 + 2, c1);
				mx.x2set(x0 - 2, y0 + 1, c1);
				mx.x2set(x0 - 2, y0, c1);
				mx.x2set(x0 - 2, y0 - 1, c1);

				mx.x2set(x0 - 1, y0 - 1, c0);
				mx.x2set(x0, y0 - 1, c0);
				mx.x2set(x0 + 1, y0 - 1, c0);
				mx.x2set(x0 + 1, y0, c0);
				mx.x2set(x0 + 1, y0 + 1, c0);
				mx.x2set(x0, y0 + 1, c0);
				mx.x2set(x0 - 1, y0 + 1, c0);
				mx.x2set(x0 - 1, y0, c0);

				mx.x2set(x0, y0, c1);
			}

			function applyBigBaseSquareOn (mx, x0, y0, c0 = 2, c1 = 3) {
				mx.x2set(x0 - 3, y0 - 3, c1);
				mx.x2set(x0 - 2, y0 - 3, c1);
				mx.x2set(x0 - 1, y0 - 3, c1);
				mx.x2set(x0, y0 - 3, c1);
				mx.x2set(x0 + 1, y0 - 3, c1);
				mx.x2set(x0 + 2, y0 - 3, c1);
				mx.x2set(x0 + 3, y0 - 3, c1);
				mx.x2set(x0 + 3, y0 - 2, c1);
				mx.x2set(x0 + 3, y0 - 1, c1);
				mx.x2set(x0 + 3, y0, c1);
				mx.x2set(x0 + 3, y0 + 1, c1);
				mx.x2set(x0 + 3, y0 + 2, c1);
				mx.x2set(x0 + 3, y0 + 3, c1);
				mx.x2set(x0 + 2, y0 + 3, c1);
				mx.x2set(x0 + 1, y0 + 3, c1);
				mx.x2set(x0, y0 + 3, c1);
				mx.x2set(x0 - 1, y0 + 3, c1);
				mx.x2set(x0 - 2, y0 + 3, c1);
				mx.x2set(x0 - 3, y0 + 3, c1);
				mx.x2set(x0 - 3, y0 + 2, c1);
				mx.x2set(x0 - 3, y0 + 1, c1);
				mx.x2set(x0 - 3, y0, c1);
				mx.x2set(x0 - 3, y0 - 1, c1);
				mx.x2set(x0 - 3, y0 - 2, c1);

				mx.x2set(x0 - 2, y0 - 2, c0);
				mx.x2set(x0 - 1, y0 - 2, c0);
				mx.x2set(x0, y0 - 2, c0);
				mx.x2set(x0 + 1, y0 - 2, c0);
				mx.x2set(x0 + 2, y0 - 2, c0);
				mx.x2set(x0 + 2, y0 - 1, c0);
				mx.x2set(x0 + 2, y0, c0);
				mx.x2set(x0 + 2, y0 + 1, c0);
				mx.x2set(x0 + 2, y0 + 2, c0);
				mx.x2set(x0 + 1, y0 + 2, c0);
				mx.x2set(x0, y0 + 2, c0);
				mx.x2set(x0 - 1, y0 + 2, c0);
				mx.x2set(x0 - 2, y0 + 2, c0);
				mx.x2set(x0 - 2, y0 + 1, c0);
				mx.x2set(x0 - 2, y0, c0);
				mx.x2set(x0 - 2, y0 - 1, c0);

				mx.x2set(x0 - 1, y0 - 1, c1);
				mx.x2set(x0, y0, c1);
				mx.x2set(x0 + 1, y0 + 1, c1);
				mx.x2set(x0 + 1, y0 - 1, c1);
				mx.x2set(x0 - 1, y0 + 1, c1);
				mx.x2set(x0 + 1, y0, c1);
				mx.x2set(x0 - 1, y0, c1);
				mx.x2set(x0, y0 + 1, c1);
				mx.x2set(x0, y0 - 1, c1);
			}

			let x, y;

			for (x = 7; x < this.modules - 7; x += 2) {
				this.matrix.x2set(x + 1, 6, 3);
				this.matrix.x2set(x, 6, 2);
			}

			for (y = 7; y < this.modules - 7; y += 2) {
				this.matrix.x2set(6, y + 1, 3);
				this.matrix.x2set(6, y, 2);
			}

			let i = 0;

			const sbss = new Uint8Array(Math.floor(this.info.version / 7) + 1);
			const inter = (this.modules - 13) / sbss.length;

			if (inter === Math.floor(inter / 2) * 2) {
				for (i = 0; i < sbss.length; i++) {
					sbss[i] = inter;
				}
			} else {
				let inter0 = inter;
				sbss[1] = Math.ceil(Math.round(inter) / 2) * 2;

				for (i = 1; i < sbss.length; i++) {
					sbss[i] = sbss[1];
					inter0 -= (sbss[1] - inter);
				}

				sbss[0] = Math.round(inter0);
			}

			let j = 0;

			i = 0;

			for (y = 6; y < this.modules; y += sbss[j++]) {
				const maxx = this.modules - ((y === 6) * 7);

				if ((y % (this.modules - 13)) === 6) {
					x = 6 + sbss[i++];
				} else {
					x = 6;
				}

				for (x; x < maxx; x += sbss[i++]) {
					applySmallBaseSquareOn(this.matrix, x, y);
				}

				i = 0;
			}

			applyBigBaseSquareOn(this.matrix, 3, 3);
			applyBigBaseSquareOn(this.matrix, this.modules - 4, 3);
			applyBigBaseSquareOn(this.matrix, 3, this.modules - 4);

			this.matrix.x2set(7, 0, 2);
			this.matrix.x2set(7, 1, 2);
			this.matrix.x2set(7, 2, 2);
			this.matrix.x2set(7, 3, 2);
			this.matrix.x2set(7, 4, 2);
			this.matrix.x2set(7, 5, 2);

			this.matrix.x2set(0, 7, 2);
			this.matrix.x2set(1, 7, 2);
			this.matrix.x2set(2, 7, 2);
			this.matrix.x2set(3, 7, 2);
			this.matrix.x2set(4, 7, 2);
			this.matrix.x2set(5, 7, 2);

			this.matrix.x2set(7, 7, 2);

			this.matrix.x2set(7, this.modules - 1, 2);
			this.matrix.x2set(7, this.modules - 2, 2);
			this.matrix.x2set(7, this.modules - 3, 2);
			this.matrix.x2set(7, this.modules - 4, 2);
			this.matrix.x2set(7, this.modules - 5, 2);
			this.matrix.x2set(7, this.modules - 6, 2);
			this.matrix.x2set(7, this.modules - 7, 2);
			this.matrix.x2set(7, this.modules - 8, 2);

			this.matrix.x2set(0, this.modules - 8, 2);
			this.matrix.x2set(1, this.modules - 8, 2);
			this.matrix.x2set(2, this.modules - 8, 2);
			this.matrix.x2set(3, this.modules - 8, 2);
			this.matrix.x2set(4, this.modules - 8, 2);
			this.matrix.x2set(5, this.modules - 8, 2);

			this.matrix.x2set(8, this.modules - 8, 3);

			this.matrix.x2set(this.modules - 8, 0, 2);
			this.matrix.x2set(this.modules - 8, 1, 2);
			this.matrix.x2set(this.modules - 8, 2, 2);
			this.matrix.x2set(this.modules - 8, 3, 2);
			this.matrix.x2set(this.modules - 8, 4, 2);
			this.matrix.x2set(this.modules - 8, 5, 2);

			this.matrix.x2set(this.modules - 1, 7, 2);
			this.matrix.x2set(this.modules - 2, 7, 2);
			this.matrix.x2set(this.modules - 3, 7, 2);
			this.matrix.x2set(this.modules - 4, 7, 2);
			this.matrix.x2set(this.modules - 5, 7, 2);
			this.matrix.x2set(this.modules - 6, 7, 2);
			this.matrix.x2set(this.modules - 7, 7, 2);
			this.matrix.x2set(this.modules - 8, 7, 2);

			this.applyFormatOn(this.info.masktype, this.info.ecdepth);

			let vbits = this.info.version << 12,
				gen = 0b1111100100101;

			for (let p = 0; Math.binlen(vbits) > 12 && p < 100; p++) {
				vbits ^= gen << Math.binlen(vbits) - 13;
			}

			vbits = (this.info.version << 12) + vbits;
			vbits = vbits.toString(2);
			vbits = "0".repeat(18 - vbits.length) + vbits;

			for (let i = 0; i < 6; i++) {
				this.matrix.x2set(this.modules -  9, 5 - i, parseInt(vbits[i * 3], 10) + 2);
				this.matrix.x2set(this.modules - 10, 5 - i, parseInt(vbits[(i * 3) + 1], 10) + 2);
				this.matrix.x2set(this.modules - 11, 5 - i, parseInt(vbits[(i * 3) + 2], 10) + 2);

				this.matrix.x2set(5 - i, this.modules -  9, parseInt(vbits[i * 3], 10) + 2);
				this.matrix.x2set(5 - i, this.modules - 10, parseInt(vbits[(i * 3) + 1], 10) + 2);
				this.matrix.x2set(5 - i, this.modules - 11, parseInt(vbits[(i * 3) + 2], 10) + 2);
			}
		}

//		vvvvvvvv DATA ENCODING AND APPLING vvvvvvvv

		// this.encdata = this.encodeDataBits(this.data, 1);
		// console.log(this.encdata);

		// this.encodeECBits(this.encdata);

		this.__ECStartPoint = this.applyDataOn("1".repeat(3000));
		let str = "";
		for (let i = 0; i < 4000; i++) str += String.fromCharCode(Math.round(Math.random()) + 0x30);
		this.applyECDataOn(str);

		// vvvvv PROBLEMS MAY APPEARS WHILE IMPORTING QRT vvvvv
		for (let i = 0; i < this.modules; i++) {
			for (let j = 0; j < this.modules; j++) {
				if (this.matrix.x2get(i, j) % 4 < 2) {
					this.matrix.x2set(i, j, this.matrix.x2get(i, j) ^ this.getMaskBit(i, j));
				}
			}
		}

		// console.log(this.decodeCodewords(this.scanDataFrom()));

		// this.encodeDataCodewords("HELLO WORLDDDDDDDDDD");
	}

	getMaskBit;

	set masktype (value) {
		switch (parseInt(value, 10)) {
			case 0:
				this.info.masktype = value;
				this.getMaskBit = (x, y) => {
					x %= 6;
					y %= 6;
					return (x + y) % 2 === 0
				};
				break;
			case 1:
				this.info.masktype = value;
				this.getMaskBit = (x, y) => {
					x %= 6;
					y %= 6;
					return y % 2 === 0;
				};
				break;
			case 2:
				this.info.masktype = value;
				this.getMaskBit = (x, y) => {
					x %= 6;
					y %= 6;
					return x % 3 === 0;
				};
				break;
			case 3:
				this.info.masktype = value;
				this.getMaskBit = (x, y) => {
					x %= 6;
					y %= 6;
					return (x + y) % 3 === 0;
				};
				break;
			case 4:
				this.info.masktype = value;
				this.getMaskBit = (x, y) => {
					x %= 6;
					y %= 6;
					return (Math.floor(y / 2) + Math.floor(x / 3)) % 2 === 0;
				};
				break;
			case 5:
				this.info.masktype = value;
				this.getMaskBit = (x, y) => {
					x %= 6;
					y %= 6;
					return ((x * y) % 2) + ((x * y) % 3) === 0;
				};
				break;
			case 6:
				this.info.masktype = value;
				this.getMaskBit = (x, y) => {
					x %= 6;
					y %= 6;
					return (((x * y) % 2) + ((x * y) % 3)) % 2 === 0;
				};
				break;
			case 7:
				this.info.masktype = value;
				this.getMaskBit = (x, y) => {
					x %= 6;
					y %= 6;
					return (((x + y) % 2) + ((x * y) % 3)) % 2 === 0;
				};
				break;
			default:
				throw new Error("Inappropriate value of mask! Only 0 to 8 numbers are allowed. You've used \"" + value + "\"")
		}
	}

	get masktype () {
		return this.info.masktype;
	}

	getBitColor;

	set maskApplication (value) {
		switch (value) {
			case 0:
				this.info.maskApplication = 0;
				this.getBitColor = (x, y) => {
					return this.matrix.x2get(x, y);
				};
				break;
			case 1:
				this.info.maskApplication = 1;
				this.getBitColor = (x, y) => {
					const bit = this.matrix.x2get(x, y);

					if ((bit % 4) < 2 && this.getMaskBit(x, y)) {
						return ((bit % 2) ^ 1) + 8;
					} else {
						return bit;
					}
				};
				break;
			case 2:
				this.info.maskApplication = 2;
				this.getBitColor = (x, y) => {
					const bit = this.matrix.x2get(x, y);

					if (bit % 4 < 2) {
						return bit ^ this.getMaskBit(x, y);
					} else {
						return bit;
					}
				};
		}
	}

	get maskApplication () {
		return this.info.maskApplication;
	}

	// encoding - encoding - encoding - encoding - encoding - encoding - encoding - encoding

	encodeDataCodewords (data) {
		let cws = new CodewordArray(this.info.dataBytes);
		let buff = 0b0;

		switch (this.info.datatype) {
			case 2: // ALPHANUM // WAS NOT TESTED WHEN DATA COVERS ALL POSSIBLE CODEWORDS !!!!!!!!
				let i, k = 4, c = 0;

				function distribute () {
					if (k >= 16) {
						k = (k % 8) + 8;
						cws[c++] = buff >> k;
						buff %= 1 << k;
					}

					if (k >= 8) {
						k %= 8;
						cws[c++] = buff >> k;
						buff %= 1 << k;
					}
				}

				buff += 2;
				buff <<= 13;
				buff += 0b1111111111111;
				k += 13;

				distribute();

				for (i = 0; i < data.length - 1; i += 2) {
					k += 11;
					buff <<= 11;
					buff += (Alphanumerical.charCode(data[i]) * 45) + Alphanumerical.charCode(data[i + 1]);

					distribute();
				}

				if (data.length % 2) {
					k += 6;
					buff <<= 6;
					buff += Alphanumerical.charCode(data[i]);

					distribute();
				}

				buff <<= 4;
				k += 4;

				if (k > 8) {
					k %= 8;
					cws[c++] = buff >> k;
				} else {
					cws[c] = buff << (8 - k);
				}

				if (c !== cws.length - 1) {
					throw new Error("In this app it is necessary to cover all data codewords");
				}

				break;
			case 4:
				if (/^[\x00-\xff]+$/.test(data)) {

				} else {
					throw new Error("There is non-ASCII char in the given data");
				}
			// 	break;
			// case 7:
			// 	// ...
		}

		// if (dbits.length < 16 * 8) {
		// 	const dbiteslen = dbits.length / 8;
		// 	for (let i = 0; i < 16 - dbiteslen; i++) {
		// 		if (i % 2) {
		// 			dbits += "00010001";
		// 		} else {
		// 			dbits += "11101100";
		// 		}
		// 	}
		// }

		return cws;
	}

/* >>> UPGRADES ARE NEEDED */ encodeECBits (data) {
		let message = new Uint8Array(10 + (data.length / 8)); // ints

		for (let i = 0; i < message.length; i++) {
			message[i] = parseInt(data.slice(i * 8, (i + 1) * 8), 2);
		}

		let _generator = (new Uint16Array(message.length)).inject(0, polynomialsGens[10]),
			generator; // pows

		let j;
		for (let i = 0; i < 16; i++) {
			const pow = GF256.ip(message[0]);
			generator = structuredClone(_generator);
			for (j = 0; j <= 10; j++) {
				generator[j] += pow;
				generator[j] %= 255;
				generator[j] = GF256.pi(generator[j]);
			}
			for (j = 0; j < message.length; j++) {
				message[j] ^= generator[j];
			}
			message = message.slice(1, message.length);
		}
		console.log(message.join(", "));
	}

	// updating - updating - updating - updating - updating - updating - updating - updating

	updateCanvas (rect8) {
		if (rect8 instanceof Rect8 && rect8[0] < this.modules && rect8[1] < this.modules) {
			if (rect8[2] >= this.modules) rect8[2] = this.modules;
			if (rect8[3] >= this.modules) rect8[3] = this.modules;

			if (rect8[2] - rect8[0] === 0) {
				for (let y = rect8[1]; y <= rect8[3]; y++) {
					QRT.ctx.fillStyle = QRT.palette[this.getBitColor(rect8[0], y) & 9];
					QRT.ctx.fillRect(rect8[0], y, 1, 1);
				}
			} else for (let y = rect8[1]; y <= rect8[3]; y++) {
				for (let x = rect8[0]; x <= rect8[2]; x++) {
					QRT.ctx.fillStyle = QRT.palette[this.getBitColor(x, y) & 9];
					QRT.ctx.fillRect(x, y, 1, 1);
				}
			}
		}
	}

	updateCanvasX (rect8) {
		if (rect8 instanceof Rect8 && rect8[0] < this.modules && rect8[1] < this.modules) {
			if (rect8[2] >= this.modules) rect8[2] = this.modules;
			if (rect8[3] >= this.modules) rect8[3] = this.modules;

			if (rect8[2] - rect8[0] === 0) {
				for (let y = rect8[1]; y <= rect8[3]; y++) {
					QRT.ctx.fillStyle = QRT.palette[this.getBitColor(rect8[0], y)];
					QRT.ctx.fillRect(rect8[0], y, 1, 1);
				}
			} else for (let y = rect8[1]; y <= rect8[3]; y++) {
				for (let x = rect8[0]; x <= rect8[2]; x++) {
					QRT.ctx.fillStyle = QRT.palette[this.getBitColor(x, y)];
					QRT.ctx.fillRect(x, y, 1, 1);
				}
			}
		}
	}

	// getMatrixRect (rect8) {
	// 	if (rect8 instanceof Rect8 && rect8[0] < this.modules && rect8[1] < this.modules) {
	// 		if (rect8[2] >= this.modules) rect8[2] = this.modules;
	// 		if (rect8[3] >= this.modules) rect8[3] = this.modules;

	// 		if (rect8[2] - rect8[0] === 0) {
	// 			const narr = new Uint8Array(rect8[3] - rect8[1]);
				
	// 			for (let i = 0; i <= rect8[3] - rect8[1]; i++) {
	// 				narr[i] = this.matrix.x2get(rect8[0], i + rect8[1]);
	// 			}
				
	// 			return narr; 
	// 		}

	// 		const narr = new Uint8ArrayX2(rect8[2] - rect8[0], rect8[3] - rect8[1]);

	// 		for (let y = 0; y <= rect8[3] - rect8[1]; y++) {
	// 			for (let x = 0; x <= rect8[2] - rect8[0]; x++) {
	// 				narr.x2set(x, y, this.matrix.x2get(x + rect8[0], y + rect8[1]));
	// 			}
	// 		}

	// 		return narr;
	// 	}
	// }

	// drawing - drawing - drawing - drawing - drawing - drawing - drawing - drawing - drawing

	applyPointOn (x, y, c = 1) {
		if (this.matrix.x2get(x, y) < 2) {
			this.matrix.x2set(x, y, c ^ ((QRT.maskApplication !== 0) * this.getMaskBit(x, y)));
		}
	}

	drawPointOn (x, y, c = 1) {
		if (this.matrix.x2get(x, y) < 2) {
			QRT.ctx.fillStyle = QRT.palette[c];
			QRT.ctx.fillRect(x, y, 1, 1);
		}
	}

	drawSpriteOn (x, y, brush, c) { // DONE
		if (brush instanceof BrushSprite) {
			QRT.ctx.fillStyle = QRT.palette[c];

			for (let i = 0; i < brush.width; i++) {
				for (let j = 0; j < brush.height; j++) {
					if (brush.sprite.x2get(i, j) === 1 && this.matrix.x2get(i + x - brush.width2, y + j - brush.height2) < 2) {
						QRT.ctx.fillRect(i + x - brush.width2, j + y - brush.height2, 1, 1);
					}
				}
			}

			return new Rect8(x - brush.width2, y - brush.height2, x + brush.width - brush.width2, y + brush.height - brush.height2);

		} else throw new Error("..."); // <<<
	}

	applySpriteOn (x, y, brush, c) {
		if (brush instanceof BrushSprite) {
			for (let i = 0; i < brush.width; i++) {
				for (let j = 0; j < brush.height; j++) {
					if (brush.sprite.x2get(i, j) === 1 && this.matrix.x2get(i + x - brush.width2, y + j - brush.height2) < 2) {
						this.matrix.x2set(i + x - brush.width2, j + y - brush.height2, c ^ ((QRT.maskApplication !== 0) * this.getMaskBit(x + i - brush.width2, y + j - brush.height2)));
					}
				}
			}
		} else throw new Error("..."); // <<<
	}

	drawLineOn (x0, y0, x, y, c, brush) { // DONE
		let dx = (x - x0), dy = (y - y0);

		QRT.ctx.fillStyle = QRT.palette[c];

		const rect = new Rect8(x0, y0, x, y);

		let apply;

		if (brush instanceof BrushSprite) {
			this.drawSpriteOn(x0, y0, brush, c);

			rect[0] -= brush.width2;
			rect[1] -= brush.height2;
			rect[2] += brush.width2 - ((brush.width % 2) ^ 1);
			rect[3] += brush.height2 - ((brush.height % 2) ^ 1);

			if (dx === 0 && dy === 0) return rect;

			const _bw = Math.abs(((dy || 1) / dx) * brush.height);
			const _bh = Math.abs(brush.width / ((dy || 1) / dx));

			let bw, bh, bx, by;

			if (_bw / brush.width < _bh / brush.height) {
				if (dx > 0) {
					bw = brush.width;
					bx = Math.floor((brush.width - _bw) / 2);
				} else {
					bw = Math.ceil((brush.width + _bw) / 2);
					bx = 0;
				}

				bh = brush.height;
				by = 0;
			} else {
				if (dy > 0) {
					bh = brush.height;
					by = Math.floor((brush.height - _bh) / 2);
				} else {
					bh = Math.ceil((brush.height + _bh) / 2);
					by = 0;
				}

				bw = brush.width;
				bx = 0;
			}

			apply = (x, y) => {
				for (let i = bx; i < bw; i++) {
					for (let j = by; j < bh; j++) {
						if (brush.fastsprite.x2get(i, j) === 1 &&
							this.matrix.x2getD(x - brush.width2 + i, y - brush.height2 + j, 2) < 2
						) {
							QRT.ctx.fillRect(x - brush.width2 + i, y - brush.height2 + j, 1, 1);
						}
					}
				}
			};
		} else {
			this.drawPointOn(x0, y0, c);

			if (dx === 0 && dy === 0) return rect;

			apply = (x, y) => {
				if (this.matrix.x2get(x, y) < 2) {
					QRT.ctx.fillRect(x, y, 1, 1);
				}
			};
		}

		if (Math.abs(dx) < Math.abs(dy)) {
			if (dy < 0) {
				x = -dx;
				y = -dy;
				x0 += dx;
				y0 += dy;
				dx = -dx;
				dy = -dy;
			}

			const k = dx / dy;
			for (y = 1; y <= dy; y++) {
				apply(Math.round(y * k) + x0, y + y0);
			}
		} else {
			if (dx < 0) {
				x = -dx;
				y = -dy;
				x0 += dx;
				y0 += dy;
				dx = -dx;
				dy = -dy;
			}

			const k = dy / dx;
			for (x = 1; x <= dx; x++) {
				apply(x + x0, Math.round(x * k) + y0);
			}
		}

		return rect;
	}

	applyLineOn (x0, y0, x, y, c, brush) {
		let dx = (x - x0), dy = (y - y0);

		const rect = new Rect8(x0, y0, x, y);

		let apply;

		if (brush instanceof BrushSprite) {
			this.applySpriteOn(x0, y0, brush, c);

			rect[0] -= brush.width2;
			rect[1] -= brush.height2;
			rect[2] += brush.width2 - ((brush.width % 2) ^ 1);
			rect[3] += brush.height2 - ((brush.height % 2) ^ 1);

			if (dx === 0 && dy === 0) return rect;

			const _bw = Math.abs(((dy || 1) / dx) * brush.height);
			const _bh = Math.abs(brush.width / ((dy || 1) / dx));

			let bw, bh, bx, by;

			if (_bw / brush.width < _bh / brush.height) {
				if (dx > 0) {
					bw = brush.width;
					bx = Math.floor((brush.width - _bw) / 2);
				} else {
					bw = Math.ceil((brush.width + _bw) / 2);
					bx = 0;
				}

				bh = brush.height;
				by = 0;
			} else {
				if (dy > 0) {
					bh = brush.height;
					by = Math.floor((brush.height - _bh) / 2);
				} else {
					bh = Math.ceil((brush.height + _bh) / 2);
					by = 0;
				}

				bw = brush.width;
				bx = 0;
			}

			apply = (x, y) => {
				for (let i = bx; i < bw; i++) {
					for (let j = by; j < bh; j++) {
						if (brush.fastsprite.x2get(i, j) === 1 &&
							this.matrix.x2getD(x - brush.width2 + i, y - brush.height2 + j, 2) < 2
						) {
							this.matrix.x2set(x - brush.width2 + i, y - brush.height2 + j, c ^ ((QRT.maskApplication !== 0) * this.getMaskBit(x - brush.width2 + i, y - brush.height2 + j)));
						}
					}
				}
			};
		} else {
			this.applyPointOn(x0, y0, c);

			if (dx === 0 && dy === 0) return rect;

			apply = (x, y) => {
				if (this.matrix.x2get(x, y) < 2) {
					this.matrix.x2set(x, y, c ^ ((QRT.maskApplication !== 0) * this.getMaskBit(x, y)));
				}
			};
		}

		if (Math.abs(dx) < Math.abs(dy)) {
			if (dy < 0) {
				x = -dx;
				y = -dy;
				x0 += dx;
				y0 += dy;
				dx = -dx;
				dy = -dy;
			}

			const k = dx / dy;
			for (y = 1; y <= dy; y++) {
				apply(Math.round(y * k) + x0, y + y0);
			}
		} else {
			if (dx < 0) {
				x = -dx;
				y = -dy;
				x0 += dx;
				y0 += dy;
				dx = -dx;
				dy = -dy;
			}

			const k = dy / dx;
			for (x = 1; x <= dx; x++) {
				apply(x + x0, Math.round(x * k) + y0);
			}
		}

		return rect;
	}

	drawEllipseOn (x0, y0, x, y, center = false, circle = false, c = 1) {
		let a = Math.abs(x - x0) + 1,
			b = Math.abs(y - y0) + 1;

		QRT.ctx.fillStyle = QRT.palette[c];

		const rect = center ? new Rect8(x0 - a, y0 - b, x0 + a, y0 + b) : new Rect8(x0, y0, x, y);

		if (circle) {
			a = Math.max(a, b);
			b = a;
		} else {
			if (a % (3 - center) === a) {
				QRT.ctx.fillRect(rect[0] + center, rect[1], a % 3, (b * (1 + center)) + center);
				return rect;
			} else if (b % (3 - center) === b) {
				QRT.ctx.fillRect(rect[0], rect[1] + center, (a * (1 + center)) + center, b % 3);
				return rect;
			}
		}

		let _x, _y;

		let da = 0,
			db = 0;

		if (!center) {
			if (x0 > x) {
				x0 -= a;
				x = x0 + a;
				x0++;
				x++;
			}

			if (y0 > y) {
				y0 -= b;
				y = y0 + b;
				y0++;
				y++;
			}

			a = (a - 1) / 2;
			b = (b - 1) / 2;
			da = -(a % 1);
			db = -(b % 1);
			x0 += a - da;
			y0 += b - db;
		}

		rect[0] = x0 - a + da;
		rect[1] = y0 - b + db;
		rect[2] = x0 + a + da;
		rect[3] = y0 + b + db;

		for (y = -b; y <= b; y++) {
			x = Math.sqrt((a ** 2) - ((a * y / b) ** 2));
			_x = -Math.round(x - da) + x0;
			x = Math.round(x + da) + x0;
			_y = y + db + y0;

			if (this.matrix.x2getD(x, _y, 2) < 2) {
				QRT.ctx.fillRect(x, _y, 1, 1);
			}

			if (this.matrix.x2getD(_x, _y, 2) < 2) {
				QRT.ctx.fillRect(_x, _y, 1, 1);
			}
		}

		for (x = -a; x <= a; x++) {
			y = Math.sqrt((b ** 2) - ((b * x / a) ** 2));
			_y = -Math.round(y - db) + y0;
			y = Math.round(y + db) + y0;
			_x = x + da + x0;

			if (this.matrix.x2getD(_x, y, 2) < 2) {
				QRT.ctx.fillRect(_x, y, 1, 1);
			}

			if (this.matrix.x2getD(_x, _y, 2) < 2) {
				QRT.ctx.fillRect(_x, _y, 1, 1);
			}
		}

		return rect;
	}

	applyEllipseOn (x0, y0, x, y, center = false, circle = false, c = 1) {
		let a = Math.abs(x - x0) + 1,
			b = Math.abs(y - y0) + 1;

		const rect = center ? new Rect8(x0 - a, y0 - b, x0 + a, y0 + b) : new Rect8(x0, y0, x, y);

		if (circle) {
			a = Math.max(a, b);
			b = a;
		} else {
			if (a % (3 - center) === a) {
				QRT.ctx.fillRect(rect[0] + center, rect[1], a % 3, (b * (1 + center)) + center);
				return rect;
			} else if (b % (3 - center) === b) {
				QRT.ctx.fillRect(rect[0], rect[1] + center, (a * (1 + center)) + center, b % 3);
				return rect;
			}
		}

		let _x, _y;

		let da = 0,
			db = 0;

		if (!center) {
			if (x0 > x) {
				x0 -= a;
				x = x0 + a;
				x0++;
				x++;
			}

			if (y0 > y) {
				y0 -= b;
				y = y0 + b;
				y0++;
				y++;
			}

			a = (a - 1) / 2;
			b = (b - 1) / 2;
			da = -(a % 1);
			db = -(b % 1);
			x0 += a - da;
			y0 += b - db;
		}

		rect[0] = x0 - a + da;
		rect[1] = y0 - b + db;
		rect[2] = x0 + a + da;
		rect[3] = y0 + b + db;

		for (y = -b; y <= b; y++) {
			x = Math.sqrt((a ** 2) - ((a * y / b) ** 2));
			_x = -Math.round(x - da) + x0;
			x = Math.round(x + da) + x0;
			_y = y + db + y0;

			if (this.matrix.x2getD(x, _y, 2) < 2) {
				this.matrix.x2set(x, _y, c ^ ((QRT.maskApplication !== 2) * this.getMaskBit(x, _y)));
			}

			if (this.matrix.x2getD(_x, _y, 2) < 2) {
				this.matrix.x2set(_x, _y, c ^ ((QRT.maskApplication !== 2) * this.getMaskBit(_x, _y)));
			}
		}

		for (x = -a; x <= a; x++) {
			y = Math.sqrt((b ** 2) - ((b * x / a) ** 2));
			_y = -Math.round(y - db) + y0;
			y = Math.round(y + db) + y0;
			_x = x + da + x0;

			if (this.matrix.x2getD(_x, y, 2) < 2) {
				this.matrix.x2set(_x, y, c ^ ((QRT.maskApplication !== 2) * this.getMaskBit(_x, y)));
			}

			if (this.matrix.x2getD(_x, _y, 2) < 2) {
				this.matrix.x2set(_x, _y, c ^ ((QRT.maskApplication !== 2) * this.getMaskBit(_x, _y)));
			}
		}

		return rect;
	}

	// data application - data application - data application - data application - data application

	applyFormatOn (nmask, necdepth) {
		switch (necdepth) {
			case "L":
				necdepth = 1;
				break;
			case "M":
				necdepth = 0;
				break;
			case "Q":
				necdepth = 3;
				break;
			case "H":
				necdepth = 2;
				break;
			default:
				throw new Error("Inapropriate error correction type was put as an argument into QRt instance: " + necdepth + " (only L, M, Q, H in any case are allowed)")
		}

		necdepth <<= 3;
		nmask = parseInt(nmask);

		let bits = necdepth + nmask;

		this.format5u = bits;

		bits <<= 10;

		let _num = bits;

		for (let p = 0; Math.binlen(bits) > 10 && p < 100; p++) {
			bits ^= 0b10100110111 << (bits.toString(2).length - 11);
		}

		bits += _num;
		bits ^= 0b101010000010010;
		bits = bits.toString(2);
		bits = bits.padStart(15, "0");

		this.format = bits;

		this.matrix.x2set(0, 8, parseInt(bits[0], 10) + 6);
		this.matrix.x2set(8, this.modules - 1, parseInt(bits[0], 10) + 6);

		this.matrix.x2set(1, 8, parseInt(bits[1], 10) + 6);
		this.matrix.x2set(8, this.modules - 2, parseInt(bits[1], 10) + 6);

		this.matrix.x2set(2, 8, parseInt(bits[2], 10) + 6);
		this.matrix.x2set(8, this.modules - 3, parseInt(bits[2], 10) + 6);

		this.matrix.x2set(3, 8, parseInt(bits[3], 10) + 6);
		this.matrix.x2set(8, this.modules - 4, parseInt(bits[3], 10) + 6);

		this.matrix.x2set(4, 8, parseInt(bits[4], 10) + 6);
		this.matrix.x2set(8, this.modules - 5, parseInt(bits[4], 10) + 6);

		this.matrix.x2set(5, 8, parseInt(bits[5], 10) + 6);
		this.matrix.x2set(8, this.modules - 6, parseInt(bits[5], 10) + 6);

		this.matrix.x2set(7, 8, parseInt(bits[6], 10) + 6);
		this.matrix.x2set(8, this.modules - 7, parseInt(bits[6], 10) + 6);

		this.matrix.x2set(8, 8, parseInt(bits[7], 10) + 6);
		this.matrix.x2set(this.modules - 8, 8, parseInt(bits[7], 10) + 6);

		this.matrix.x2set(8, 7, parseInt(bits[8], 10) + 6);
		this.matrix.x2set(this.modules - 7, 8, parseInt(bits[8], 10) + 6);

		this.matrix.x2set(8, 5, parseInt(bits[9], 10) + 6);
		this.matrix.x2set(this.modules - 6, 8, parseInt(bits[9], 10) + 6);

		this.matrix.x2set(8, 4, parseInt(bits[10], 10) + 6);
		this.matrix.x2set(this.modules - 5, 8, parseInt(bits[10], 10) + 6);

		this.matrix.x2set(8, 3, parseInt(bits[11], 10) + 6);
		this.matrix.x2set(this.modules - 4, 8, parseInt(bits[11], 10) + 6);

		this.matrix.x2set(8, 2, parseInt(bits[12], 10) + 6);
		this.matrix.x2set(this.modules - 3, 8, parseInt(bits[12], 10) + 6);

		this.matrix.x2set(8, 1, parseInt(bits[13], 10) + 6);
		this.matrix.x2set(this.modules - 2, 8, parseInt(bits[13], 10) + 6);

		this.matrix.x2set(8, 0, parseInt(bits[14], 10) + 6);
		this.matrix.x2set(this.modules - 1, 8, parseInt(bits[14], 10) + 6);
	}

	applyDataOn (data) {
		if (typeof data !== "string" || data.length <= 0) throw new Error("Data must be given!");

		return this.goThroughDataModules((x, y, j) => {
			this.matrix.x2set(x, y, parseInt(data[j], 10));
		}, {
			maxb: this.info.dataBytes * 8
		});
	}

	applyECDataOn (ecdata) {
		this.goThroughDataModules((x, y, j) => {
			this.matrix.x2set(x, y, parseInt(ecdata[j - this.__ECStartPoint.j], 10) + 4);
		}, this.__ECStartPoint);
	}

	scanDataFrom () {
		const cws = new CodewordArray(this.info.dataBytes);
		let byte = 0b0, i = 0;

		this.goThroughDataModules((x, y, j) => {
			byte <<= 1;
			byte += (this.matrix.x2get(x, y) % 2) ^ this.getMaskBit(this.masktype, x, y);

			if (j % 8 === 7) {
				cws[i++] = byte;
				byte = 0;
			}
		}, {
			maxb: this.info.dataBytes * 8
		});

		return cws;
	}

	decodeCodewords (cws) {
		const ncws = new CodewordArray(cws.length);
		const g1 = this.info.g1Blocks, g2 = this.info.g2Blocks;

		let k = 0;

		for (let i = 0; i < g1 + g2; i++) {
			for (let j = 0; j < this.info.g1DataBytesPerBlock; j++) {
				ncws[k++] = cws[(j * (g1 + g2)) + i];
			}

			if (i >= g1) {
				ncws[k++] = cws[(this.info.g1DataBytesPerBlock * (g1 + g2)) + i - g1];
			}
		}

		let chars = "";
		let buff = 0b0;

		switch (this.info.datatype) {
			case 2: // ALPHANUM
				let k = 17; // <<< СЮДИ ТРЕБА ЗНАЧЕННЯ З ТАБЛИЦІ
				let i = Math.floor(k / 8);

				k = 8 - (k % 8);

				buff = ncws[i] % (1 << k);

				const pair = new Uint16Array(2);

				for (i = i + 1; i < ncws.length; i++) {
					buff <<= 8;
					buff += ncws[i];
					k += 8;

					if (k >= 11) {
						k %= 11;

						pair[0] = buff >> k;

						if (pair[0] > 0b11111101000) { // ENCODING CORRECTION BLOCK
							const corrections = [];

							for (let p = 1; p < pair[0]; p <<= 1) {
								if ((pair[0] ^ p) <= 0b11111101000) {
									corrections.push(pair[0] ^ p);
									// console.logb(pair[0] ^ p, 11);
								}
							}
						}

						pair[1] = pair[0] % 45;
						pair[0] = (pair[0] - pair[1]) / 45;

						chars += Alphanumerical.fromCharCode(pair[0]) + Alphanumerical.fromCharCode(pair[1]);
						buff &= (1 << k) - 1;
					}
				}

				if (k >= 7) {
					pair[0] = buff >> (k % 7);

					if (pair[0] > 44) {
						throw new Error("An attempt to get an alphanum char by too big code was detected!");
					}

					chars += Alphanumerical.fromCharCode(pair[0]);
				}

				break;
			case 4: // BYTE
				//       vvvvv СЮДИ ТРЕБА ЗНАЧЕННЯ З ТАБЛИЦІ (ДОВЖИНА ЛІЧИЛЬНИКА + 4)
				for (let i = 0; i < ncws.length; i++) {
					chars += String.fromCharCode(ncws[i]);
				}
				break;
			case 7: // UNICODE // IS UNUSED NOW
				let trig = 0;
				//       vvvvv СЮДИ ТРЕБА ЗНАЧЕННЯ З ТАБЛИЦІ (ДОВЖИНА ЛІЧИЛЬНИКА + 4)
				for (let i = 0; i < ncws.length; i++) {
					if (ncws[i] >= 0b11110000) {
						throw new Error("Bytes that greater or equal than 0b11110000 are not allowed in UTF16 encoding. Current byte: 0b" + ncws[i].toString(2).padStart(8, "0") + " (" + ncws[i] + ")");
					}

					if (ncws[i] >= 0b11100000) { 		// 1110xxxx
						buff += ncws[i] % 16;
						trig = 2;
						i++;
					} else if (ncws[i] >= 0b11000000) { // 110xxxxx
						buff += ncws[i] % 32;
						trig = 1;
						i++;
					}

					if (ncws[i] >= 0b10000000) { 		// 10xxxxxx
						if (trig--) {
							buff <<= 6;
							buff += ncws[i] % 128;
						} else throw new Error("0b" + ncws[i].toString(2) + " byte is preceded by neither 0b110xxxxx nor 0b1110xxxx bytes!");

					} else { 							// 0xxxxxxx
						buff = ncws[i];
					}

					if (trig === 0) {
						chars += String.fromCharCode(buff);
						buff = 0;
					}
				}
		}

		return chars;
	}

	goThroughDataModules (act, interval = {}) {
		if (!act) throw new Error("Inappropriate value of act arg. was put into goThroughDataModules method!");

		let x = interval.x || this.modules - 1,
			y = interval.y || this.modules - 1,
			v = interval.v || 1,
			j = interval.j || 0,
			maxb;

		if (interval.maxb) {
			maxb = Math.min(interval.maxb, (this.info.dataBytes + this.info.ecBytes) * 8);
		} else {
			maxb = (this.info.dataBytes + this.info.ecBytes) * 8;
		}

		for (let i = x % 2; j < maxb && i < 100000; i++) {
			if (this.matrix.x2get(x, y) < 2) {
				act(x, y, j++, v);
			}

			if (i % 2) {
				y -= v;
				x++;

				if (y === -1 || y === this.modules) {
					x -= 2;
					v = -v;
					y -= v;
				}
			} else {
				x--;
			}

			if (x === 6) x = 5;
		}

		return {x, y, j, v};
	}

	// goThroughDataModules Alternative: : : : : : :

	// let i = 0; // Bit index into the data
	// // Do the funny zigzag scan
	// for (let right = this.size - 1; right >= 1; right -= 2) { // Index of right column in each column pair
	// 	if (right == 6)
	// 		right = 5;
	// 	for (let vert = 0; vert < this.size; vert++) { // Vertical counter
	// 		for (let j = 0; j < 2; j++) {
	// 			const x = right - j; // Actual x coordinate
	// 			const upward = ((right + 1) & 2) == 0;
	// 			const y = upward ? this.size - 1 - vert : vert; // Actual y coordinate
	// 			if (!this.isFunction[y][x] && i < data.length * 8) {
	// 				this.modules[y][x] = getBit(data[i >>> 3], 7 - (i & 7));
	// 				i++;
	// 			}
	// 			// If this QR Code has any remainder bits (0 to 7), they were assigned as
	// 			// 0/false/light by the constructor and are left unchanged by this method
	// 		}
	// 	}
	// }

	// building - building - building - building - building - building - building

	buildTQRT (name) {
		const olen = this.matrix.length;
		let bstr = "";

		bstr += String.fromCharCode(this.info.version);
		bstr += String.fromCharCode(this.format5u);

		let mod = 7, num = 0o0, byte = 0b0;

		for (let i = 0; i < olen; i) {

			if (mod < 3) {
				num = this.matrix[i++] % 8;
				mod = 3 - mod;
				byte += num >> mod;

				bstr += String.fromCharCode(byte);

				byte = num % (1 << mod);
				mod = 7 - mod;
				byte <<= mod;
			}

			num = this.matrix[i++] % 8;
			mod -= 3;
			byte += num << mod;
		}

		// let str = "";

		// for (let k = 0; k < bstr.length; k++) {
		// 	str += bstr[k].charCodeAt(0).toString(2).padStart(7, "0") + " , ";
		// }

		// console.log(str);

		return new File([bstr], name + ".beta.tqrt", {type: "image/tqrt"});
	}

	static readTQRT = (tqrt) => new Promise ((resolve, reject) => {
		const reader = new FileReader();
		const indata = {};

		reader.readAsArrayBuffer(tqrt);

		reader.onload = () => {
			const arrbuff = reader.result;
			const arr = new Uint8Array(arrbuff);

			indata.version = arr[0];

			const format = arr[1];

			if (0 <= format && format < 32) {
				indata.ecdepth = format >> 3;

				switch (indata.ecdepth) {
					case 1:
						indata.ecdepth = "L";
						break;
					case 0:
						indata.ecdepth = "M";
						break;
					case 3:
						indata.ecdepth = "Q";
						break;
					case 2:
						indata.ecdepth = "H";
				}

				indata.masktype = format % 4;

			} else throw new Error("Recieved file is corrupted! Inappropriate format bits of qrt was detected");

			let mod = 7, j = 2;

			const modules = ((indata.version * 4) + 17);
			indata.matrix = new Uint8ArrayX2(modules, modules);

			for (let i = 0; i < indata.matrix.length; i++) {
				if (mod < 3) {
					indata.matrix[i] = arr[j++] % (1 << mod);
					mod = 3 - mod;
					indata.matrix[i] <<= mod;
					mod = 7 - mod;
					indata.matrix[i] += arr[j] >> mod;
				} else {
					mod -= 3;
					indata.matrix[i] = (arr[j] >> mod) % 8;
				}
			}

			indata.datatype = indata.matrix.x2get(modules - 1, modules - 1) % 2;
			indata.datatype += (indata.matrix.x2get(modules - 2, modules - 1) % 2) << 1;
			indata.datatype += (indata.matrix.x2get(modules - 1, modules - 2) % 2) << 2;
			indata.datatype += (indata.matrix.x2get(modules - 2, modules - 2) % 2) << 3;

			resolve(indata);
		};
	});
}