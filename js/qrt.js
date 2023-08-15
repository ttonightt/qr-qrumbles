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

	static palette = ["white", "black", "tomato", "red", "violet", "purple", "cyan", "blue", "#0c4010", "#e35d7a"];

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

	constructor (settings, refmx) {
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
				throw new Error("One of argument's property has inappropriate value!");
		}

		Object.assign(this.info, new QRTable(this.info.version, this.info.ecdepth));

		this.datatype = settings.datatype;
		//	^^^^^^^^^ - sets info.datatype through the setter

		this.modules = 17 + (this.info.version * 4);

		if (refmx instanceof Uint8Array) {
			if (refmx.columns === refmx.rows && refmx.rows === this.modules) {
				this.matrix = new Uint8ArrayX2(refmx);

			} else throw new Error("..."); // <<<
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

		this.maskApplication = 2;
			//	^^^^^^^^^^^^^^^^ - sets info.maskApplication through the setter

		this.applyDataPrefix();

//		vvvvvvvv DATA ENCODING AND APPLING vvvvvvvv

		// this.applyDataOn(this.encodeDataCodewords("\u000f"));
		// let str = "";
		// for (let i = 0; i < 4600; i++) str += String.fromCharCode(Math.round(Math.random()) + 0x30);
		// this.applyECDataOn(str);

		// this.decodeCodewords(this.scanDataFrom());

		const _cws = new CodewordArray(this.info.dataBytes);

		for (let i = 0; i < _cws.length; i++) {
			_cws[i] = Math.round(Math.random() * 255);
		}

		this.applyECDataOn(this.encodeECCodewords(_cws));
	}

	getMaskBit;

	set masktype (value) {
		switch (parseInt(value, 10)) {
			case 0:
				this.info.masktype = value;
				this.getMaskBit = (x, y) => {
					x %= 6;
					y %= 6;
					return (x + y) % 2 === 0;
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

	set maskApplication (value) {
		switch (this.info.maskApplication) {
			case 1: // UNDONE !!!!!!!!!!!!!!!!!!!!!!
				
				break;
			case 0: case 2:
				for (let y = 0; y < this.matrix.rows; y++) {
					for (let x = 0; x < this.matrix.columns; x++) {
						this.matrix.x2set(x, y, this.matrix.x2get(x, y) ^ ((((this.matrix.x2get(x, y) & 2) >> 1) ^ 1) * this.getMaskBit(x, y))); // RETEST IT ON PERFOMANCE
					}
				}
		}

		switch (value) {
			case 1: // UNDONE !!!!!!!!!!!!!!!!!!!!!!
				// this.info.maskApplication = 1;

				// for (let y = 0; y < this.matrix.rows; y++) {
				// 	for (let x = 0; x < this.matrix.columns; x++) {
				// 		if (this.matrix.x2get(x, y) % 4 < 2) {
				// 				;
				// 			this.matrix.x2set(x, y, this.matrix.x2get(x, y) ^ this.getMaskBit(x, y));
				// 		}
				// 	}
				// }
				break;
			case 0: case 2:
				this.info.maskApplication = value;
		}
	}

	get maskApplication () {
		return this.info.maskApplication;
	}

	set datatype (value) {
		switch (value) {
			case "A": case "a": case 2: case "2":
				this.info.datatype = 2;
				this.info.counterLength = QRTable.__table[this.info.version].counterLength.A;
				this.info.charCapacity = Math.floor(((this.info.dataBytes * 8) - 4 - this.info.counterLength) / 11) * 2;
				if ((this.info.dataBytes * 8) - 4 - this.info.counterLength - (this.info.charCapacity * 11) >= 7) {
					this.info.charCapacity++;
				}
				break;
			case "B": case "b": case 4: case "4":
				this.info.datatype = 4;
				this.info.counterLength = QRTable.__table[this.info.version].counterLength.B;
				this.info.charCapacity = Math.floor(((this.info.dataBytes * 8) - 4 - this.info.counterLength) / 8);
				break;
			default:
				throw new Error("..."); // <<<
		}
	}

	// encoding - encoding - encoding - encoding - encoding - encoding - encoding - encoding

	encodeDataCodewords (str) {
		if (typeof str !== "string" || str.length < 1) throw new Error("..."); // <<<

		const cws = new CodewordArray(this.info.dataBytes);

		const g1 = this.info.g1Blocks, g2 = this.info.g2Blocks, g1cws = this.info.g1DataBytesPerBlock, g2cws = this.info.g2DataBytesPerBlock;

		let k = 4, c = 0;
		let buff = this.info.datatype;

		k += this.info.counterLength;
		buff <<= this.info.counterLength;
		buff += Math.floor(((this.info.dataBytes * 8) - 4 - this.info.counterLength) / 8);

		switch (Math.floor(k / 8) + 1) {
			case 3:
				k -= 8;
				cws[c++] = buff >> k;
				buff %= 1 << k;
			default:
				k -= 8;
				cws[c++] = buff >> k;
				buff %= 1 << k;
				cws[c] = buff;
		}

		switch (this.info.datatype) {
			case 2: // ALPHANUM // WAS NOT TESTED WHEN DATA COVERS ALL POSSIBLE CODEWORDS !!!!!!!!
				for (let i = 0; i < str.length - 1; i += 2) {
					k += 11;
					buff <<= 11;
					buff += (Alphanumerical.charCode(str[i]) * 45) + Alphanumerical.charCode(str[i + 1]);

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

				if (str.length % 2) {
					k += 6;
					buff <<= 6;
					buff += Alphanumerical.charCode(str[i]);

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
				k %= 8;

				if (k === 0) {
					for (let i = 0; i < str.length && c < cws.length; i++) {
						const code = str.charCodeAt(i);
						if (code < 256) {
							cws[c++] = code;
						} else throw new Error("..."); // <<<
					}
				} else {
					for (let i = 0; i < str.length && c < cws.length - 2; i++) { // WAS NOT TESTED ON ALL VERSIONS EXCEPT 34th
						const code = str.charCodeAt(i);

						if (code < 256) {
							buff <<= 8;
							buff += code;

							cws[c++] = buff >> k;

							buff %= 1 << k;
						} else throw new Error("..."); // <<<
					}

					cws[c] = buff << (8 - k);
				}
				break;
			// case 7:
			// 	// ...
		}

		const cws_ = new CodewordArray(cws.length);

		for (let i = 0; i < cws.length; i++) {
			const r = i % (g1 + g2);

			if (r < g1) {
				cws_[i] = cws[(g1cws * Math.min(r, g1)) + ((i - r) / (g1 + g2))];
			} else {
				cws_[i] = cws[(g1cws * (r, g1)) + (g2cws * (r - g1)) + ((i - r) / (g1 + g2))];
			}
		}

		// let rtr = "";

		// for (let i = 0; i < cws_.length; i++) {
		// 	rtr += cws_[i].toString(2).padStart(8, "0") + " ";
		// }

		// console.log(rtr);

		return cws_;
	}

	encodeECCodewords (datacws) {
		if (datacws instanceof CodewordArray && datacws.length === this.info.dataBytes) {
			const _eccws = new Uint8ArrayX2(this.info.g1Blocks + this.info.g2Blocks, this.info.ecBytesPerBlock);

			for (let k = 0; k < this.info.g1Blocks; k++) {
				const message = new Uint8Array(this.info.g1DataBytesPerBlock + this.info.ecBytesPerBlock);

				for (let j = 0; j < this.info.g1DataBytesPerBlock; j++) {
					message[j] = datacws[(k * this.info.g1DataBytesPerBlock) + j];
				}

				const _generator = new Uint8Array(message.length); // backup copy
				_generator.set(polyGens[this.info.ecBytesPerBlock], 0); // SUITABLE ONLY FOR 26, 28, 30 EC CODEWORDS PER BLOCK!!!

				let generator; // pows

				for (let i = 0; i < this.info.g1DataBytesPerBlock; i++) {
					const pow = GF256.ip(message[i]);

					generator = new Uint8Array(_generator);

					for (let j = 0; j <= this.info.ecBytesPerBlock; j++) {
						generator[j] = (generator[j] + pow) % 255;
						generator[j] = GF256.pi(generator[j]);
						message[j + i] ^= generator[j];
					}
				}

				_eccws.set(message.slice(this.info.g1DataBytesPerBlock), k * this.info.ecBytesPerBlock);
			}

			for (let k = 0; k < this.info.g2Blocks; k++) {
				const message = new Uint8Array(this.info.g2DataBytesPerBlock + this.info.ecBytesPerBlock);

				for (let j = 0; j < this.info.g2DataBytesPerBlock; j++) {
					message[j] = datacws[((this.info.g1Blocks + k) * this.info.g2DataBytesPerBlock) + j];
				}

				const _generator = new Uint8Array(message.length); // backup copy
				_generator.set(polyGens[this.info.ecBytesPerBlock], 0); // SUITABLE ONLY FOR 26, 28, 30 EC CODEWORDS PER BLOCK!!!

				let generator; // pows

				for (let i = 0; i < this.info.g2DataBytesPerBlock; i++) {
					const pow = GF256.ip(message[i]);

					generator = new Uint8Array(_generator);

					for (let j = 0; j <= this.info.ecBytesPerBlock; j++) {
						generator[j] = (generator[j] + pow) % 255;
						generator[j] = GF256.pi(generator[j]);
						message[j + i] ^= generator[j];
					}
				}

				_eccws.set(message.slice(this.info.g2DataBytesPerBlock), (this.info.g1Blocks + k) * this.info.ecBytesPerBlock);
			}

			// console.logAsTable(_eccws, 2, "\u00a0", ",\u00a0");

			const eccws = new CodewordArray(_eccws.length);

			for (let i = 0; i < eccws.length; i++) {
				eccws[i] = _eccws.x2get(Math.floor(i / _eccws.rows), i % _eccws.rows);
			}

			// console.logAsTable(eccws, 2, "\u00a0", ",\u00a0", _eccws.rows);

			return eccws;

		} else throw new Error("..."); // <<<
	}

	// updating - updating - updating - updating - updating - updating - updating - updating

	updateCanvas (rect8) {
		if (rect8 instanceof Rect8 && rect8[0] < this.modules && rect8[1] < this.modules) {
			if (rect8[2] >= this.modules) rect8[2] = this.modules;
			if (rect8[3] >= this.modules) rect8[3] = this.modules;

			if (rect8[2] - rect8[0] === 0) {
				for (let y = rect8[1]; y <= rect8[3]; y++) {
					QRT.ctx.fillStyle = QRT.palette[this.matrix.x2get(rect8[0], y) & 9];
					QRT.ctx.fillRect(rect8[0], y, 1, 1);
				}
			} else for (let y = rect8[1]; y <= rect8[3]; y++) {
				for (let x = rect8[0]; x <= rect8[2]; x++) {
					QRT.ctx.fillStyle = QRT.palette[this.matrix.x2get(x, y) & 9];
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
					QRT.ctx.fillStyle = QRT.palette[this.matrix.x2get(rect8[0], y)];
					QRT.ctx.fillRect(rect8[0], y, 1, 1);
				}
			} else for (let y = rect8[1]; y <= rect8[3]; y++) {
				for (let x = rect8[0]; x <= rect8[2]; x++) {
					QRT.ctx.fillStyle = QRT.palette[this.matrix.x2get(x, y)];
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
			this.matrix.x2set(x, y, c);
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
						this.matrix.x2set(i + x - brush.width2, j + y - brush.height2, c);
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
			for (y = 0; y <= dy; y++) {
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
			for (x = 0; x <= dx; x++) {
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
							this.matrix.x2set(x - brush.width2 + i, y - brush.height2 + j, c);
						}
					}
				}
			};
		} else {
			this.applyPointOn(x0, y0, c);

			if (dx === 0 && dy === 0) return rect;

			apply = (x, y) => {
				if (this.matrix.x2get(x, y) < 2) {
					this.matrix.x2set(x, y, c);
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
			for (y = 0; y <= dy; y++) {
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
			for (x = 0; x <= dx; x++) {
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
				this.matrix.x2set(x, _y, c);
			}

			if (this.matrix.x2getD(_x, _y, 2) < 2) {
				this.matrix.x2set(_x, _y, c);
			}
		}

		for (x = -a; x <= a; x++) {
			y = Math.sqrt((b ** 2) - ((b * x / a) ** 2));
			_y = -Math.round(y - db) + y0;
			y = Math.round(y + db) + y0;
			_x = x + da + x0;

			if (this.matrix.x2getD(_x, y, 2) < 2) {
				this.matrix.x2set(_x, y, c);
			}

			if (this.matrix.x2getD(_x, _y, 2) < 2) {
				this.matrix.x2set(_x, _y, c);
			}
		}

		return rect;
	}

	// data application - data application - data application - data application - data application

	applyDataPrefix () {
		const databit = (((1 << 4) + (this.info.datatype)) << this.info.counterLength) + this.info.charCapacity;

		let i = 0;

		this.goThroughDataModules((x, y, j) => {
			if (j % ((this.info.g1Blocks + this.info.g2Blocks) * 8) < 8) {
				this.matrix.x2set(x, y, ((databit >> (4 + this.info.counterLength - 1 - i++)) % 2) + 4); //  ^ this.getMaskBit(x, y))
			}
		}, {
			maxb: ((((this.info.g1Blocks + this.info.g2Blocks) * 2) + 1) * 8) - 4
		});
	}

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

	applyDataOn (cws) {
		if (cws instanceof CodewordArray) {

			return this.goThroughDataModules((x, y, j) => {
				this.matrix.x2set(x, y, ((cws[Math.floor(j / 8)] >> (7 - (j % 8))) % 2) ^ this.getMaskBit(x, y));
			}, {
				maxb: this.info.dataBytes * 8
			});
		} else throw new Error("Data must be given!");
	}

	applyECDataOn (cws) {
		if (cws instanceof CodewordArray && cws.length === this.info.ecBytesPerBlock * (this.info.g1Blocks + this.info.g2Blocks)) {

			return this.goThroughDataModules((x, y, j) => {
				this.matrix.x2set(x, y, (((cws[Math.floor((j - this.info.firstECModuleParams.j) / 8)] >> (7 - ((j - this.info.firstECModuleParams.j) % 8))) % 2) ^ ((this.maskApplication === 0) * this.getMaskBit(x, y))) + 4);
			}, this.info.firstECModuleParams);

		} else throw new Error("Data must be given!");
	}

	scanDataFrom () {
		const cws = new CodewordArray(this.info.dataBytes);
		let byte = 0b0, i = 0;

		this.goThroughDataModules((x, y, j) => {
			byte <<= 1;
			byte += (this.matrix.x2get(x, y) % 2) ^ ((this.maskApplication === 0) * this.getMaskBit(x, y));

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

		let c = 0;

		for (let i = 0; i < g1 + g2; i++) { // interleaving
			for (let j = 0; j < this.info.g1DataBytesPerBlock; j++) {
				ncws[c++] = cws[(j * (g1 + g2)) + i];
			}

			if (i >= g1) {
				ncws[c++] = cws[(this.info.g1DataBytesPerBlock * (g1 + g2)) + i - g1];
			}
		}

		let _str = "";

		for (let i = 0; i < ncws.length; i++) {
			_str += ncws[i].toString(2).padStart(8, "0").replaceAll("0", ".") + ",";
		}

		console.log(_str);

		let chars = "";

		let k, i;
		let buff = 0b0;

		switch (this.info.datatype) {
			case 2: // ALPHANUM
				k = 17; // <<< СЮДИ ТРЕБА ЗНАЧЕННЯ З ТАБЛИЦІ
				i = Math.floor(k / 8);

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
				k = this.info.counterLength + 4;
				i = Math.floor(k / 8);
				k %= 8;

				if (k === 0) {
					for (i; i < ncws.length; i++) {
						chars += String.fromCharCode(ncws[i]);
					}
				} else {
					for (i; i < ncws.length - 2; i++) {
						buff = ncws[i] % (1 << (8 - k));
						buff <<= (8 - k);
						buff += ncws[i + 1] >> k;
						chars += String.fromCharCode(buff);
					}
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

		console.log(chars.length);
		// console.log(chars);

		let str = "";

		for (let i = 0; i < chars.length; i++) {
			str += chars.charCodeAt(i).toString(2).padStart(8, "0").replaceAll("0", ".") + ",";
		}

		console.log(str);

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
			if ((this.matrix.x2get(x, y) % 4) < 2) {
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

		for (let y = 0; y < this.modules; y++) {
			for (let x = 0; x < this.modules; x++) {
				if (mod < 3) {
					num = (this.matrix.x2get(x, y) ^ ((this.maskApplication === 0) * this.getMaskBit(x, y))) % 8;
					mod = 3 - mod;
					byte += num >> mod;
	
					bstr += String.fromCharCode(byte);
	
					byte = num % (1 << mod);
					mod = 7 - mod;
					byte <<= mod;
	
					continue;
				}
	
				num = this.matrix.x2get(x, y) % 8;
				mod -= 3;
				byte += num << mod;
			}
		}

		// let str = "";

		// for (let k = 0; k < bstr.length; k++) {
		// 	str += bstr[k].charCodeAt(0).toString(2).padStart(7, "0") + " , ";
		// }

		// console.log(str);

		return new File([bstr], name + ".tqrt", {type: "image/tqrt"});
	}

	static readTQRT = (tqrt) => new Promise ((resolve, reject) => {
		const reader = new FileReader();
		const indata = {
			name: tqrt.name.slice(0, -5)
		};

		reader.readAsArrayBuffer(tqrt);

		reader.onload = () => {
			const arrbuff = reader.result;
			const arr = new Uint8Array(arrbuff); // НЕОБХІДНА ПЕРЕВІРКА НА ПРАВИЛЬНІСТЬ ДОВЖИНИ ВСІХ ДАНИХ

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
			indata.datatype <<= 1;
			indata.datatype += indata.matrix.x2get(modules - 2, modules - 1) % 2;
			indata.datatype <<= 1;
			indata.datatype += indata.matrix.x2get(modules - 1, modules - 2) % 2;
			indata.datatype <<= 1;
			indata.datatype += indata.matrix.x2get(modules - 2, modules - 2) % 2;

			switch (indata.datatype) {
				case 2: case 4:
					resolve(indata);
					break;
				default:
					throw new Error("..."); // <<<
			}
		};
	});
}