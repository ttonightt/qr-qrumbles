"use strict";

import {Uint8ArrayX2, Bath, isFunction, Rect8} from "../tiny-usefuls.js";

import QR from "./qr.js";

class BrushSprite {

	static XOR (mx, dx = 0, dy = 0) {



		if (Math.abs(dx) >= mx.w || Math.abs(dy) >= mx.h || !dx || !dy)
			return new Uint8ArrayX2(mx);

		const xmx = new Uint8ArrayX2(tmx.rows + 1, tmx.columns + 1);

		let x, y;

		for (x = 0; x < mx.w; x++) {
			for (y = 0; y < mx.h; y++) {

				const c = mx.x2get(x, y) ^ (mx.x2get(x + dx, y + dy) ?? 0);

				xmx.x2set(x + 1, 0, c);
				xmx.x2set(0, y + 1, c);
				xmx.x2set(x + 1, y + 1, c);
			}
		}

		for (x = 1; xmx.x2get(x, 0) === 0; x++);
		for (y = 1; xmx.x2get(0, y) === 0; y++);
		
		const x_ = x, y_ = y;

		for (x = xmx.columns - 1; xmx.x2get(x, 0) === 0; x--);
		for (y = xmx.rows - 1; xmx.x2get(0, y) === 0; y--);

		const mx_ = new Uint8ArrayX2(x - x_ + 1, y - y_ + 1);

		mx_.dx = x_;
		mx_.dy = y_;

		for (x = 0; x < mx_.columns; x++) {
			for (y = 0; y < mx_.rows; y++) {

				mx_.x2set(x, y, xmx.x2get(x + x_, y + y_));
			}
		}

		return mx_;
	}

	constructor (type, mx) {

		this[0] = new Uint8ArrayX2(mx);
		this.type = type;

		this.w = sprite.columns;
		this.h = sprite.rows;
		this.w2 = Math.floor(sprite.columns / 2);
		this.h2 = Math.floor(sprite.rows / 2);

		this[8] = BrushSprite.XOR(mx, -1,  0);
		this[7] = BrushSprite.XOR(mx, -1,  1);
		this[6] = BrushSprite.XOR(mx,  0,  1);
		this[5] = BrushSprite.XOR(mx,  1,  1);
		this[4] = BrushSprite.XOR(mx,  1,  0);
	}
}

export default class QRMX {

	static sprites = {
		circles: {
			2: new BrushSprite(
				new Uint8ArrayX2([
					1,1,
					1,1,
				], 2),
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
				], 10)
			)
		}
	};

	static __applySmallBaseSquareOn (mx, x0, y0, c0 = 2, c1 = 3) {
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

	static __applyBigBaseSquareOn (mx, x0, y0, c0 = 2, c1 = 3) {
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

	static generateDefaultMatrix (version, modules, apintervals) {

		const mx = new Uint8ArrayX2(modules, modules);

		let x, y;

		for (x = 7; x < modules - 7; x += 2) {
			mx.x2set(x + 1, 6, 3);
			mx.x2set(x, 6, 2);
		}

		for (y = 7; y < modules - 7; y += 2) {
			mx.x2set(6, y + 1, 3);
			mx.x2set(6, y, 2);
		}

		let i = 0, j = 0;

		for (y = 6; y < modules; y += apintervals[j++]) {
			const maxx = modules - ((y === 6) * 7);

			if ((y % (modules - 13)) === 6) {
				x = 6 + apintervals[i++];
			} else {
				x = 6;
			}

			for (x; x < maxx; x += apintervals[i++]) {
				this.__applySmallBaseSquareOn(mx, x, y);
			}

			i = 0;
		}

		this.__applyBigBaseSquareOn(mx, 3, 3);
		this.__applyBigBaseSquareOn(mx, modules - 4, 3);
		this.__applyBigBaseSquareOn(mx, 3, modules - 4);

		mx.x2set(7, 0, 2);
		mx.x2set(7, 1, 2);
		mx.x2set(7, 2, 2);
		mx.x2set(7, 3, 2);
		mx.x2set(7, 4, 2);
		mx.x2set(7, 5, 2);

		mx.x2set(0, 7, 2);
		mx.x2set(1, 7, 2);
		mx.x2set(2, 7, 2);
		mx.x2set(3, 7, 2);
		mx.x2set(4, 7, 2);
		mx.x2set(5, 7, 2);

		mx.x2set(7, 7, 2);

		mx.x2set(7, modules - 1, 2);
		mx.x2set(7, modules - 2, 2);
		mx.x2set(7, modules - 3, 2);
		mx.x2set(7, modules - 4, 2);
		mx.x2set(7, modules - 5, 2);
		mx.x2set(7, modules - 6, 2);
		mx.x2set(7, modules - 7, 2);
		mx.x2set(7, modules - 8, 2);

		mx.x2set(0, modules - 8, 2);
		mx.x2set(1, modules - 8, 2);
		mx.x2set(2, modules - 8, 2);
		mx.x2set(3, modules - 8, 2);
		mx.x2set(4, modules - 8, 2);
		mx.x2set(5, modules - 8, 2);

		mx.x2set(8, modules - 8, 3);

		mx.x2set(modules - 8, 0, 2);
		mx.x2set(modules - 8, 1, 2);
		mx.x2set(modules - 8, 2, 2);
		mx.x2set(modules - 8, 3, 2);
		mx.x2set(modules - 8, 4, 2);
		mx.x2set(modules - 8, 5, 2);

		mx.x2set(modules - 1, 7, 2);
		mx.x2set(modules - 2, 7, 2);
		mx.x2set(modules - 3, 7, 2);
		mx.x2set(modules - 4, 7, 2);
		mx.x2set(modules - 5, 7, 2);
		mx.x2set(modules - 6, 7, 2);
		mx.x2set(modules - 7, 7, 2);
		mx.x2set(modules - 8, 7, 2);

		let vbits = version << 12,
			gen = 0b1111100100101;

		for (let p = 0; Bath.binlen(vbits) > 12 && p < 100; p++) {
			vbits ^= gen << Bath.binlen(vbits) - 13;
		}

		vbits = (version << 12) + vbits;
		vbits = vbits.toString(2);
		vbits = "0".repeat(18 - vbits.length) + vbits;

		for (let i = 0; i < 6; i++) {
			mx.x2set(modules -  9, 5 - i, parseInt(vbits[i * 3], 10) + 2);
			mx.x2set(modules - 10, 5 - i, parseInt(vbits[(i * 3) + 1], 10) + 2);
			mx.x2set(modules - 11, 5 - i, parseInt(vbits[(i * 3) + 2], 10) + 2);

			mx.x2set(5 - i, modules -  9, parseInt(vbits[i * 3], 10) + 2);
			mx.x2set(5 - i, modules - 10, parseInt(vbits[(i * 3) + 1], 10) + 2);
			mx.x2set(5 - i, modules - 11, parseInt(vbits[(i * 3) + 2], 10) + 2);
		}

		return mx;
	}

	constructor (info, {maskPattern}, matrix) {

		this.info = info;

		// MATRIX SET UP

		this.xSkipped = new Uint16Array(123);

		if (matrix instanceof Uint8ArrayX2 && matrix.rows === matrix.columns && matrix.rows === this.modules) {

			this.matrix = matrix;
		} else
			this.matrix = QRMX.generateDefaultMatrix(this.info.version, this.info.modules, this.info.alignmentPatternIntervals);

		this.missedModulesOfColumns = [];

		let column = 0, summary = 0;

		this.__goThroughDataModules(({x, y, f, c}) => {

			if (y === f && x % 2) {

				this.missedModulesOfColumns[i + 1] = summary;

				summary += column;
				column = 0;
			}

			this.matrix.x2set(x, y, (++column << 2) + c);
		});

		this.skippedModulesOfColumns = new Uint16Array(this.skippedModulesOfColumns);
		this.coordsOfCodewordsColumns = new Uint8Array(this.qrInfo.g1Blocks + this.qrInfo.g2Blocks);

		// MASK PATTERN

		if (0 <= maskPattern && maskPattern < 8) {

			this.setMaskPattern(parseInt(maskPattern, 10));
		}
	}

	exportToImageData (imageData, {x, y, width, height}) {

		if (imageData.width !== this.modules || imageData.height !== this.modules)
			throw new Error("..."); // <<<

		width += x; height += y;

		for (x; x < width; x++) {
			for (y; y < height; y++) {

				const i = x + (y * imageData.width);
				const c = 255 * ((this.matrix[i] % 2) ^ 1);

				imageData.data[i * 4] = c;
				imageData.data[(i * 4) + 1] = c;
				imageData.data[(i * 4) + 2] = c;
			}
		}
	}

	getCell (x, y) {

		this.matrix[x + ((y + 1) * this.modules)] = ;
	}

	setCell () {

	}

	getMaskBit = () => { // IS SET BY THE METHOD BELOW
		throw new Error("..."); // <<<
	}

	setMaskPattern (value) { // SEPARATE
		switch (parseInt(value, 10)) {
			case 0:
				this.getMaskBit = (x, y) => {
					x %= 6;
					y %= 6;
					return (x + y) % 2 === 0;
				};
				break;
			case 1:
				this.getMaskBit = (x, y) => {
					x %= 6;
					y %= 6;
					return y % 2 === 0;
				};
				break;
			case 2:
				this.getMaskBit = (x, y) => {
					x %= 6;
					y %= 6;
					return x % 3 === 0;
				};
				break;
			case 3:
				this.getMaskBit = (x, y) => {
					x %= 6;
					y %= 6;
					return (x + y) % 3 === 0;
				};
				break;
			case 4:
				this.getMaskBit = (x, y) => {
					x %= 6;
					y %= 6;
					return (Math.floor(y / 2) + Math.floor(x / 3)) % 2 === 0;
				};
				break;
			case 5:
				this.getMaskBit = (x, y) => {
					x %= 6;
					y %= 6;
					return ((x * y) % 2) + ((x * y) % 3) === 0;
				};
				break;
			case 6:
				this.getMaskBit = (x, y) => {
					x %= 6;
					y %= 6;
					return (((x * y) % 2) + ((x * y) % 3)) % 2 === 0;
				};
				break;
			case 7:
				this.getMaskBit = (x, y) => {
					x %= 6;
					y %= 6;
					return (((x + y) % 2) + ((x * y) % 3)) % 2 === 0;
				};
				break;
			default:
				throw new Error("Inappropriate value of mask! Only 0 to 8 numbers are allowed. You've used \"" + value + "\"")
		}

		this.maskPattern = value;
		this.__applyFormatOn(QR.encodeFormatBits(this.maskPettern, this.errorCorrectionDepth));
	}

	__applyFormatOn (bits) {

		this.matrix.x2set(8, 0, ((bits <<= 1) % 2) + 2);
		this.matrix.x2set(this.modules - 1, 8, (bits % 2) + 2);

		this.matrix.x2set(8, 1, ((bits <<= 1) % 2) + 2);
		this.matrix.x2set(this.modules - 2, 8, (bits % 2) + 2);

		this.matrix.x2set(8, 2, ((bits <<= 1) % 2) + 2);
		this.matrix.x2set(this.modules - 3, 8, (bits % 2) + 2);

		this.matrix.x2set(8, 3, ((bits <<= 1) % 2) + 2);
		this.matrix.x2set(this.modules - 4, 8, (bits % 2) + 2);

		this.matrix.x2set(8, 4, ((bits <<= 1) % 2) + 2);
		this.matrix.x2set(this.modules - 5, 8, (bits % 2) + 2);

		this.matrix.x2set(8, 5, ((bits <<= 1) % 2) + 2);
		this.matrix.x2set(this.modules - 6, 8, (bits % 2) + 2);

		this.matrix.x2set(8, 7, ((bits <<= 1) % 2) + 2);
		this.matrix.x2set(this.modules - 7, 8, (bits % 2) + 2);

		this.matrix.x2set(8, 8, ((bits <<= 1) % 2) + 2);
		this.matrix.x2set(this.modules - 8, 8, (bits % 2) + 2);

		this.matrix.x2set(7, 8, ((bits <<= 1) % 2) + 2);
		this.matrix.x2set(8, this.modules - 7, (bits % 2) + 2);

		this.matrix.x2set(5, 8, ((bits <<= 1) % 2) + 2);
		this.matrix.x2set(8, this.modules - 6, (bits % 2) + 2);

		this.matrix.x2set(4, 8, ((bits <<= 1) % 2) + 2);
		this.matrix.x2set(8, this.modules - 5, (bits % 2) + 2);

		this.matrix.x2set(3, 8, ((bits <<= 1) % 2) + 2);
		this.matrix.x2set(8, this.modules - 4, (bits % 2) + 2);

		this.matrix.x2set(2, 8, ((bits <<= 1) % 2) + 2);
		this.matrix.x2set(8, this.modules - 3, (bits % 2) + 2);

		this.matrix.x2set(1, 8, ((bits <<= 1) % 2) + 2);
		this.matrix.x2set(8, this.modules - 2, (bits % 2) + 2);

		this.matrix.x2set(0, 8, ((bits <<= 1) % 2) + 2);
		this.matrix.x2set(8, this.modules - 1, (bits % 2) + 2);
	}

	drawMatrixOn (canvas, rect8) {
		if (rect8 instanceof Rect8 && rect8[0] < this.modules && rect8[1] < this.modules) {
			if (rect8[2] >= this.modules) rect8[2] = this.modules;
			if (rect8[3] >= this.modules) rect8[3] = this.modules;

			if (rect8[2] - rect8[0] === 0) {
				for (let y = rect8[1]; y <= rect8[3]; y++) {
					QR.ctx.fillStyle = QR.palette[this.matrix.x2get(rect8[0], y) & 9];
					QR.ctx.fillRect(rect8[0], y, 1, 1);
				}
			} else for (let y = rect8[1]; y <= rect8[3]; y++) {
				for (let x = rect8[0]; x <= rect8[2]; x++) {
					QR.ctx.fillStyle = QR.palette[this.matrix.x2get(x, y) & 9];
					QR.ctx.fillRect(x, y, 1, 1);
				}
			}
		}
	}

	DEV_drawMatrixOn (canvas, rect8) {
		if (rect8 instanceof Rect8 && rect8[0] < this.modules && rect8[1] < this.modules) {
			if (rect8[2] >= this.modules) rect8[2] = this.modules;
			if (rect8[3] >= this.modules) rect8[3] = this.modules;

			if (rect8[2] - rect8[0] === 0) {
				for (let y = rect8[1]; y <= rect8[3]; y++) {
					QR.ctx.fillStyle = QR.palette[this.matrix.x2get(rect8[0], y)];
					QR.ctx.fillRect(rect8[0], y, 1, 1);
				}
			} else for (let y = rect8[1]; y <= rect8[3]; y++) {
				for (let x = rect8[0]; x <= rect8[2]; x++) {
					QR.ctx.fillStyle = QR.palette[this.matrix.x2get(x, y)];
					QR.ctx.fillRect(x, y, 1, 1);
				}
			}
		}
	}

	// drawing - drawing - drawing - drawing - drawing - drawing - drawing - drawing - drawing

	applyPointOn (x, y, c = 1) {
		if (this.matrix.x2get(x, y) < 2) {
			this.matrix.x2set(x, y, c);
		}
	}

	drawPointOn (canvas, x, y, c = 1) {
		if (this.matrix.x2get(x, y) < 2) {
			QR.ctx.fillStyle = QR.palette[c];
			QR.ctx.fillRect(x, y, 1, 1);
		}
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

	drawSpriteOn (canvas, x, y, brush, c) { // DONE
		if (brush instanceof BrushSprite) {
			QR.ctx.fillStyle = QR.palette[c];

			for (let i = 0; i < brush.width; i++) {
				for (let j = 0; j < brush.height; j++) {
					if (brush.sprite.x2get(i, j) === 1 && this.matrix.x2get(i + x - brush.width2, y + j - brush.height2) < 2) {
						QR.ctx.fillRect(i + x - brush.width2, j + y - brush.height2, 1, 1);
					}
				}
			}

			return new Rect8(x - brush.width2, y - brush.height2, x + brush.width - brush.width2, y + brush.height - brush.height2);

		} else throw new Error("..."); // <<<
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

	drawLineOn (canvas, x0, y0, x, y, c, brush) { // DONE
		let dx = (x - x0), dy = (y - y0);

		QR.ctx.fillStyle = QR.palette[c];

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
							QR.ctx.fillRect(x - brush.width2 + i, y - brush.height2 + j, 1, 1);
						}
					}
				}
			};
		} else {
			this.drawPointOn(x0, y0, c);

			if (dx === 0 && dy === 0) return rect;

			apply = (x, y) => {
				if (this.matrix.x2get(x, y) < 2) {
					QR.ctx.fillRect(x, y, 1, 1);
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

	applyEllipseOn (x0, y0, x, y, center = false, circle = false, c = 1) {
		let a = Math.abs(x - x0) + 1,
			b = Math.abs(y - y0) + 1;

		const rect = center ? new Rect8(x0 - a, y0 - b, x0 + a, y0 + b) : new Rect8(x0, y0, x, y);

		if (circle) {
			a = Math.max(a, b);
			b = a;
		} else {
			if (a % (3 - center) === a) {
				QR.ctx.fillRect(rect[0] + center, rect[1], a % 3, (b * (1 + center)) + center);
				return rect;
			} else if (b % (3 - center) === b) {
				QR.ctx.fillRect(rect[0], rect[1] + center, (a * (1 + center)) + center, b % 3);
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

	drawEllipseOn (canvas, x0, y0, x, y, center = false, circle = false, c = 1) {
		let a = Math.abs(x - x0) + 1,
			b = Math.abs(y - y0) + 1;

		QR.ctx.fillStyle = QR.palette[c];

		const rect = center ? new Rect8(x0 - a, y0 - b, x0 + a, y0 + b) : new Rect8(x0, y0, x, y);

		if (circle) {
			a = Math.max(a, b);
			b = a;
		} else {
			if (a % (3 - center) === a) {
				QR.ctx.fillRect(rect[0] + center, rect[1], a % 3, ((rect[3] - rect[1]) * (1 + center)) + center);
				return rect;
			} else if (b % (3 - center) === b) {
				QR.ctx.fillRect(rect[0], rect[1] + center, ((rect[2] - rect[0]) * (1 + center)) + center, b % 3);
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
				QR.ctx.fillRect(x, _y, 1, 1);
			}

			if (this.matrix.x2getD(_x, _y, 2) < 2) {
				QR.ctx.fillRect(_x, _y, 1, 1);
			}
		}

		for (x = -a; x <= a; x++) {
			y = Math.sqrt((b ** 2) - ((b * x / a) ** 2));
			_y = -Math.round(y - db) + y0;
			y = Math.round(y + db) + y0;
			_x = x + da + x0;

			if (this.matrix.x2getD(_x, y, 2) < 2) {
				QR.ctx.fillRect(_x, y, 1, 1);
			}

			if (this.matrix.x2getD(_x, _y, 2) < 2) {
				QR.ctx.fillRect(_x, _y, 1, 1);
			}
		}

		return rect;
	}

	// data application - data application - data application - data application - data application

	dataBitOffsetByCoords (x, y) {
		if (this.modules <= x && x < 0 && this.modules <= y && y < 0)
			throw new Error("..."); // <<<

		const col = Math.floor((this.modules - x - 1) / 2);

	}

	applyDataOn (cws) {
		if (cws instanceof CodewordArray) {

			return this.__goThroughDataModules((x, y, j, c) => { // МАЛЮЄ ЧОРНОБІЛИМ ПО ЧБ ТА ФІОЛЕТОВИМИ ПО ФІОЛЕТОВОМУ
				this.matrix.x2set(x, y, (((cws[Math.floor(j / 8)] >> (7 - (j % 8))) % 2) ^ this.getMaskBit(x, y)) + (c & 6));
			}, {
				maxb: this.info.dataBytes * 8
			});
		} else throw new Error("Data must be given!");
	}

	applyECDataOn (cws) {
		if (cws instanceof CodewordArray) {

			return this.__goThroughDataModules((x, y, j) => {
				this.matrix.x2set(x, y, (((cws[Math.floor((j - this.info.firstECModuleParams.j) / 8)] >> (7 - ((j - this.info.firstECModuleParams.j) % 8))) % 2) ^ this.getMaskBit(x, y)) + 4);
			}, this.info.firstECModuleParams);

		} else throw new Error("Data must be given!");
	}

	// scanDataFrom () {
	// 	const cws = new Uint8ClampedArray(this.dataBytes);
	// 	let byte = 0b0, i = 0;

	// 	this.__goThroughDataModules((x, y, j) => {
	// 		byte <<= 1;
	// 		byte += (this.matrix.x2get(x, y) % 2) ^ this.getMaskBit(x, y);

	// 		if (j % 8 === 7) {
	// 			cws[i++] = byte;
	// 			byte = 0;
	// 		}
	// 	}, {
	// 		maxb: this.dataBytes * 8
	// 	});

	// 	return cws;
	// }

	scanDataFrom (rect8) {

		for (let i = rect8.x; i < ) {

		}
	}

	__goThroughDataModules (j, maxj, act) {
		if (!isFunction(act)) throw new Error("Inappropriate value of act arg. was put into goThroughDataModules method!"); // ???

		let x = interval.x || this.modules - 1,
			y = interval.y || this.modules - 1,
			v = ((Math.floor(x / 2) % 2) * 2) - 1,
			maxb, f = 0;

		if (interval.maxb) {
			maxb = Math.min(interval.maxb, (this.info.dataBytes + this.info.ecBytes) * 8);
		} else {
			maxb = (this.info.dataBytes + this.info.ecBytes) * 8;
		}

		while (j < maxb) {

			const c = this.matrix.x2get(x, y);

			if (c % 4 < 2)
				act({x, y, j: j++, c, v, f});

			if (x % 2) {
				y -= v;
				x++;

				if (y === -1 || y === this.modules) {
					x -= 2;
					v = -v;
					f = y + v;
					y -= v;
				}
			} else {
				x--;
			}

			// if (x === 6) x = 5; IS USED BY ERROR CORRECTION CODEWORDS ONLY!!!! THE SEPARATE METHOD MUST BE ADDED!!!
		}
	}
}