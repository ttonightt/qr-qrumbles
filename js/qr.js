
class CodewordArray extends Uint8ClampedArray {
	constructor (length) {
		super(length);
	}
}

class QRT {
	static ctx;

	static base = [];
	static _index;

	static autoAddition = true;
	static add (qrt, actualizeIndex) {
		this.base.push(qrt);
		if (actualizeIndex) this.index = this.base.length - 1;
	}

	static remove (i) {
		this.base.splice(i, 1);
	}

	static get current () {
		return this.base[this.index];
	}

	static palette = ["white", "black", "tomato", "red", "cyan", "blue", "violet", "purple"];

	static getMaskBit (mt, x, y) {
		x %= 6;
		y %= 6;

		switch (mt) {
			case 0:
				return (x + y) % 2 === 0;
			case 1:
				return y % 2 === 0;
			case 2:
				return x % 3 === 0;
			case 3:
				return (x + y) % 3 === 0;
			case 4:
				return (Math.floor(y / 2) + Math.floor(x / 3)) % 2 === 0;
			case 5:
				return ((x * y) % 2) + ((x * y) % 3) === 0;
			case 6:
				return (((x * y) % 2) + ((x * y) % 3)) % 2 === 0;
			case 7:
				return (((x + y) % 2) + ((x * y) % 3)) % 2 === 0;
			default:
				throw new Error("Inappropriate value of mask! Only 0 to 8 numbers are allowed. You've used \"" + mt + "\"")
		}
	}

	constructor (version, masktype, ecdepth, datatype) {

		this.info = new QRTable(version, ecdepth);

		this.version = version;
		this.ecdepth = ecdepth.toUpperCase();
		this.masktype = parseInt(masktype, 10);

		this.modules = 17 + (this.version * 4);
		this.format5 = 0x00000;

		switch (datatype) {
			case "A": case 2: case "2":
				this.datatype = 2;
				break;
			case "B": case 4: case "4":
				this.datatype = 4;
			// 	break;
			// case "U": case 7:
			// 	this.datatype = 7;
		}

		// this.encdata = this.encodeDataBits(this.data, 1);
		// console.log(this.encdata);

		this.matrix = new Int8Array(this.modules ** 2).x2convert(this.modules);

		// this.encodeECBits(this.encdata);

//		vvvvvvvv PREPARATIONS vvvvvvvv

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

		for (x = 6; x < this.modules; x += 28) {
			for (y = 6; y < this.modules; y += 28) {
				if (!(y === 6 && x === 6) && !(x === 6 && y === this.modules - 7) && !(x === this.modules - 7 && y === 6)) {
					applySmallBaseSquareOn(this.matrix, x, y);
				}
			}
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

		this.applyFormatOn(this.masktype, this.ecdepth);
		this.applyVersionOn();

//		vvvvvvvv DATA ENCODING AND APPLING vvvvvvvv

		this._ECStartPoint = this.applyDataOn("10100101010101011111");
		this.applyECDataOn("1010101001010000001110101011");

		if (QRT.autoAddition) {
			QRT.add(this, true);
		}

		this.decodeCodewords(this.scanDataFrom());


		// this.encodeDataCodewords("HELLO WORLDDDDDDDDDD");

		// return this;
	}

	// encoding - encoding - encoding - encoding - encoding - encoding - encoding - encoding

	encodeDataCodewords (data) {
		let cws = new CodewordArray(this.info.dataBytes);
		let buff = 0b0;

		switch (this.datatype) {
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

	updateCanvas (mx = this.matrix) {
		for (let y = 0; y < this.modules; y++) {
			for (let x = 0; x < this.modules; x++) {
				QRT.ctx.fillStyle = QRT.palette[mx.x2get(x, y) % 2];
				QRT.ctx.fillRect(x, y, 1, 1);
			}
		}

		return this;
	}

	updateCanvasX (mx = this.matrix) {
		for (let y = 0; y < this.modules; y++) {
			for (let x = 0; x < this.modules; x++) {
				QRT.ctx.fillStyle = QRT.palette[mx.x2get(x, y)];
				QRT.ctx.fillRect(x, y, 1, 1);
			}
		}

		return this;
	}

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

	applyRectOn (x0, y0, x, y, fc, sc) {
		for (x0; x0 < x; x0++) {
			for (y0; y0 < y; y0++) {
				if (x === 0) {

				}
			}
		}
	}

	drawLineOn (x0, y0, x, y, c, w = 1, wcomp = true, roundcap = true) {
		let dx = (x - x0), dy = (y - y0);
		if (dx === 0 && dy === 0) {
			this.drawPointOn(x0, y0, c);
			return;
		}

		if (wcomp && w > 1) {
			w = Math.floor(lineWidthCompensator(w, Math.atan((y - y0) / (x - x0))));
		}

		const _w = Math.floor(w / 2);
		QRT.ctx.fillStyle = QRT.palette[c];

		if (roundcap && w > 2) {
			this.drawEllipseOn(x0 - _w, y0 - _w, x0 + _w - 1, y0 + _w - 1, false, true, c);
			this.drawEllipseOn(x - _w, y - _w, x + _w - 1, y + _w - 1, false, true, c);
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
				const _x = Math.round(y * k) + x0, _y = y + y0;
				for (let i = -_w; i < w - _w; i++) {
					if (this.matrix.x2getD(_x + i, _y, 2) < 2) QRT.ctx.fillRect(_x + i, _y, 1, 1);
				}
			}
		} else if (Math.abs(dx) >= Math.abs(dy)) {
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
				const _x = x + x0, _y = Math.round(x * k) + y0;
				for (let i = -_w; i < w - _w; i++) {
					if (this.matrix.x2getD(_x, _y + i, 2) < 2) QRT.ctx.fillRect(_x, _y + i, 1, 1);
				}
			}
		}
	}

	applyLineOn (x0, y0, x, y, c, w = 1, wcomp = true, roundcap = true) {
		let dx = (x - x0), dy = (y - y0);
		if (dx === 0 && dy === 0) {
			this.applyPointOn(x0, y0, c);
			return;
		}

		if (wcomp && w > 1) {
			w = Math.floor(lineWidthCompensator(w, Math.atan((y - y0) / (x - x0))));
		}

		const _w = Math.floor(w / 2);

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
				const _x = Math.round(y * k) + x0, _y = y + y0;
				for (let i = -_w; i < w - _w; i++) {
					if (this.matrix.x2getD(_x + i, _y, 2) < 2) this.matrix.x2set(_x + i, _y, c);
				}
			}
		} else if (Math.abs(dx) >= Math.abs(dy)) {
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
				const _x = x + x0, _y = Math.round(x * k) + y0;
				for (let i = -_w; i < w - _w; i++) {
					if (this.matrix.x2getD(_x, _y + i, 2) < 2) this.matrix.x2set(_x, _y + i, c);
				}
			}
		}
	}

	drawEllipseOn (x0, y0, x, y, center = false, circle = false, c = 1) {
		let a = Math.abs(x - x0) + 1,
			b = Math.abs(y - y0) + 1;

		if (a === 1 && b === 1) {
			this.drawPointOn(x0, y0, c);
			return;
		}

		QRT.ctx.fillStyle = QRT.palette[c];

		let _x, _y;

		if (!center && a === 0 || b === 0) return;

		if (circle) {
			a = Math.max(a, b);
			b = a;
		}

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
	}

	applyEllipseOn (x0, y0, x, y, center = false, circle = false, c = 1) {
		let a = Math.abs(x - x0) + 1,
			b = Math.abs(y - y0) + 1;

		if (a === 1 && b === 1) {
			this.applyPointOn(x0, y0, c);
			return;
		}

		let _x, _y;

		if (!center && a === 0 || b === 0) return;

		if (circle) {
			a = Math.max(a, b);
			b = a;
		}

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

		this.format5 = bits;

		bits <<= 10;

		let _num = bits;
		
		for (let p = 0; Math.binlen(bits) > 10 && p < 100; p++) {
			bits ^= 0b10100110111 << (bits.toString(2).length - 11);
		}

		bits += _num;
		bits ^= 0b101010000010010;
		bits = bits.toString(2);
		bits = "0".repeat(15 - bits.length) + bits;

		this.format = bits;

		this.matrix.x2set(0, 8, parseInt(bits[0], 10) + 4);
		this.matrix.x2set(8, this.modules - 1, parseInt(bits[0], 10) + 4);

		this.matrix.x2set(1, 8, parseInt(bits[1], 10) + 4);
		this.matrix.x2set(8, this.modules - 2, parseInt(bits[1], 10) + 4);

		this.matrix.x2set(2, 8, parseInt(bits[2], 10) + 4);
		this.matrix.x2set(8, this.modules - 3, parseInt(bits[2], 10) + 4);

		this.matrix.x2set(3, 8, parseInt(bits[3], 10) + 4);
		this.matrix.x2set(8, this.modules - 4, parseInt(bits[3], 10) + 4);

		this.matrix.x2set(4, 8, parseInt(bits[4], 10) + 4);
		this.matrix.x2set(8, this.modules - 5, parseInt(bits[4], 10) + 4);

		this.matrix.x2set(5, 8, parseInt(bits[5], 10) + 4);
		this.matrix.x2set(8, this.modules - 6, parseInt(bits[5], 10) + 4);

		this.matrix.x2set(7, 8, parseInt(bits[6], 10) + 4);
		this.matrix.x2set(8, this.modules - 7, parseInt(bits[6], 10) + 4);

		this.matrix.x2set(8, 8, parseInt(bits[7], 10) + 4);
		this.matrix.x2set(this.modules - 8, 8, parseInt(bits[7], 10) + 4);

		this.matrix.x2set(8, 7, parseInt(bits[8], 10) + 4);
		this.matrix.x2set(this.modules - 7, 8, parseInt(bits[8], 10) + 4);

		this.matrix.x2set(8, 5, parseInt(bits[9], 10) + 4);
		this.matrix.x2set(this.modules - 6, 8, parseInt(bits[9], 10) + 4);

		this.matrix.x2set(8, 4, parseInt(bits[10, 10]) + 4);
		this.matrix.x2set(this.modules - 5, 8, parseInt(bits[10, 10]) + 4);

		this.matrix.x2set(8, 3, parseInt(bits[11, 10]) + 4);
		this.matrix.x2set(this.modules - 4, 8, parseInt(bits[11, 10]) + 4);

		this.matrix.x2set(8, 2, parseInt(bits[12, 10]) + 4);
		this.matrix.x2set(this.modules - 3, 8, parseInt(bits[12, 10]) + 4);

		this.matrix.x2set(8, 1, parseInt(bits[13, 10]) + 4);
		this.matrix.x2set(this.modules - 2, 8, parseInt(bits[13, 10]) + 4);

		this.matrix.x2set(8, 0, parseInt(bits[14, 10]) + 4);
		this.matrix.x2set(this.modules - 1, 8, parseInt(bits[14, 10]) + 4);
	}

	applyVersionOn () {
		let bits = this.version, gen = 0b1111100100101;
		bits <<= 12;
		for (let p = 0; Math.binlen(bits) > 12 && p < 100; p++) {
			bits ^= gen << Math.binlen(bits) - 13;
		}
		bits = (this.version << 12) + bits;
		bits = bits.toString(2);
		bits = "0".repeat(18 - bits.length) + bits;

		for (let i = 0; i < 6; i++) {
			this.matrix.x2set(this.modules -  9, 5 - i, parseInt(bits[i * 3], 10) + 2);
			this.matrix.x2set(this.modules - 10, 5 - i, parseInt(bits[(i * 3) + 1], 10) + 2);
			this.matrix.x2set(this.modules - 11, 5 - i, parseInt(bits[(i * 3) + 2], 10) + 2);

			this.matrix.x2set(5 - i, this.modules -  9, parseInt(bits[i * 3], 10) + 2);
			this.matrix.x2set(5 - i, this.modules - 10, parseInt(bits[(i * 3) + 1], 10) + 2);
			this.matrix.x2set(5 - i, this.modules - 11, parseInt(bits[(i * 3) + 2], 10) + 2);
		}
	}

	applyDataOn (data) {
		return this.goThroughDataModules((x, y, j) => {
			this.matrix.x2set(x, y, parseInt(data[j], 10));
		}, {
			maxb: this.info.dataBytes * 8
		});
	}

	applyECDataOn (ecdata) {
		let i = 0;
		this.goThroughDataModules((x, y) => {
			this.matrix.x2set(x, y, parseInt(ecdata[i++], 10) + 6);
		}, this._ECStartPoint);
	}

	scanDataFrom () {
		const cws = new CodewordArray(this.info.dataBytes);
		let byte = 0b0, i = 0;

		this.goThroughDataModules((x, y, j) => {
			byte <<= 1;
			byte += (this.matrix.x2get(x, y) % 2) ^ QRT.getMaskBit(this.masktype, x, y);

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

		switch (this.datatype) {
			case 2: // ALPHANUM
				let k = 15; // <<< СЮДИ ТРЕБА ЗНАЧЕННЯ З ТАБЛИЦІ
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
			maxb = interval.maxb;

		if (!maxb) {
			maxb = (this.info.dataBytes + this.info.ecBytes) * 8;
		} else {
			maxb = Math.min(maxb, (this.info.dataBytes + this.info.ecBytes) * 8);
		}

		for (let i = 0; j < maxb && i < 100000; i++) {
			//			^^^^^^^^
			if (x === 10 && y === this.modules) {
				y -= 9;
				x -= 2;
				v = -v;
			}

			if (x === 8 && y === 8) {
				x--;
			}

			if (x === this.modules - 9 && y === 6) {
				x -= 2;
				y -= 6;
				v = -v;
			}
			
			if (y < 0 || y >= this.modules || (y === 8 && (this.matrix.x2get(x, y) === 4 || this.matrix.x2get(x, y) === 5)) || (x <= 5 && y === this.modules - 11)) {
				y += v;
				x -= 2;
				v = -v;
				act(x, y, j++, v);
			} else switch (this.matrix.x2get(x, y)) {
				case 0: case 1: case 6: case 7:
					act(x, y, j++, v);
			}

			if (i % 2) {
				x++;
				y -= v;
			} else {
				x--;
			}
		}

		return {x, y, j, v};
	}
	
	// building - building - building - building - building - building - building

	buildTQRT () {
		let output = this.version.toString(8);
		if (output.length === 1) output = 0 + output;
		output += this.format5.toString(8);
		output += this.datatype.toString(8);

		console.log(output);
	}
}