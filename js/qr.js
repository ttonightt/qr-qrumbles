
BASE = {
	ctx: 0,
	arts: [],
	eci: 0,
	current: () => {
		return BASE.arts[BASE.eci];
	},
	add: (qrt, changeECI) => {
		BASE.arts.push(qrt);
		if (changeECI) BASE.eci = BASE.arts.length - 1;
	}
};

class QRT {
	static palette = ["white", "black", "tomato", "red", "cyan", "blue", "violet", "purple"];

	static getMaskBit (mt, x, y) {
		x %= 6;
		y %= 6;
		
		switch (mt) {
			case 0:
				return ;
			case 1:
				return ;
			case 2:
				return ;
			case 3:
				return ;
			case 4:
				return ;
			case 5:
				return ;
			case 6:
				return ;
			case 7:
				return ;
			default:
				throw new Error("Inappropriate value of mask! Only 0 to 8 numbers are allowed. You've used \"" + mt + "\"")
		}
	}

	constructor (version, masktype, ecdepth, datatype, data = "hello world") {
		switch (version) {
			case 20: case 27: case 34: case 40:
				break;
			default:
				throw new Error("Inappropriate version value was detected in the argument of QRT constructor (only 20, 27, 34, 40 are allowed)");
		}

		this.ctx = BASE.ctx;
		this.version = version;
		this.modules = 17 + (this.version * 4);

		this.ecdepth = ecdepth.toUpperCase();
		this.masktype = masktype;
		this.format5 = 0x00000;

		this.datatype = parseInt(datatype, 10);

		this.data = data;
		this.encdata = this.encodeDataBits(this.data, 1);
		console.log(this.encdata);

		this.counter = 0; // 10-26: 12/11/16, 27-40: 14/13/16
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
				if (!(y == 6 && x == 6) && !(x == 6 && y == this.modules - 7) && !(x == this.modules - 7 && y == 6)) {
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

		this._forECDataOn = this.applyDataOn("10100101010101011111");
		// this.applyECDataOn("1010101001010000001110101011");

//		vvvvvvvv SETTING UP THE DECODED DATA vvvvvvvv

		this.decodeDataFrom();

		return this;
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

		this.matrix.x2set(0, 8, +bits[0] + 4);
		this.matrix.x2set(8, this.modules - 1, +bits[0] + 4);

		this.matrix.x2set(1, 8, +bits[1] + 4);
		this.matrix.x2set(8, this.modules - 2, +bits[1] + 4);

		this.matrix.x2set(2, 8, +bits[2] + 4);
		this.matrix.x2set(8, this.modules - 3, +bits[2] + 4);

		this.matrix.x2set(3, 8, +bits[3] + 4);
		this.matrix.x2set(8, this.modules - 4, +bits[3] + 4);

		this.matrix.x2set(4, 8, +bits[4] + 4);
		this.matrix.x2set(8, this.modules - 5, +bits[4] + 4);

		this.matrix.x2set(5, 8, +bits[5] + 4);
		this.matrix.x2set(8, this.modules - 6, +bits[5] + 4);

		this.matrix.x2set(7, 8, +bits[6] + 4);
		this.matrix.x2set(8, this.modules - 7, +bits[6] + 4);

		this.matrix.x2set(8, 8, +bits[7] + 4);
		this.matrix.x2set(this.modules - 8, 8, +bits[7] + 4);

		this.matrix.x2set(8, 7, +bits[8] + 4);
		this.matrix.x2set(this.modules - 7, 8, +bits[8] + 4);

		this.matrix.x2set(8, 5, +bits[9] + 4);
		this.matrix.x2set(this.modules - 6, 8, +bits[9] + 4);

		this.matrix.x2set(8, 4, +bits[10] + 4);
		this.matrix.x2set(this.modules - 5, 8, +bits[10] + 4);

		this.matrix.x2set(8, 3, +bits[11] + 4);
		this.matrix.x2set(this.modules - 4, 8, +bits[11] + 4);

		this.matrix.x2set(8, 2, +bits[12] + 4);
		this.matrix.x2set(this.modules - 3, 8, +bits[12] + 4);

		this.matrix.x2set(8, 1, +bits[13] + 4);
		this.matrix.x2set(this.modules - 2, 8, +bits[13] + 4);

		this.matrix.x2set(8, 0, +bits[14] + 4);
		this.matrix.x2set(this.modules - 1, 8, +bits[14] + 4);
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
			this.matrix.x2set(this.modules -  9, 5 - i, +bits[(i * 3)] + 2);
			this.matrix.x2set(this.modules - 10, 5 - i, +bits[(i * 3) + 1] + 2);
			this.matrix.x2set(this.modules - 11, 5 - i, +bits[(i * 3) + 2] + 2);

			this.matrix.x2set(5 - i, this.modules -  9, +bits[(i * 3)] + 2);
			this.matrix.x2set(5 - i, this.modules - 10, +bits[(i * 3) + 1] + 2);
			this.matrix.x2set(5 - i, this.modules - 11, +bits[(i * 3) + 2] + 2);
		}
	}

	// encoding - encoding - encoding - encoding - encoding - encoding - encoding - encoding

	encodeDataBits (data, dtype) {
		dtype = 1 << dtype;

		const dlen = data.length;

		let dbits = "";

		switch (dtype) {
			case 0b0010:
				if (/^[a-z0-9\s%*+-/:.$]{1,}$/i.test(data)) {
					const dbitslen2 = data.length.toString(2);
					dbits = "0010" + ("0".repeat(8 - dbitslen2.length + 1) + dbitslen2);
					dbits += data.decodeAsAN2();

					if ((13 * 8) - dbits.length < 4) { // ОЦЕ ТРЕБА ВИРІЗАТИ Й ВИНЕСТИ ЗА СВІЧ-КЕЙС
						dbits += "0".repeat((13 * 8) - dbits.length);
					} else {
						dbits += "0000";
						dbits += "0".repeat(8 - (dbits.length % 8));
					}

					// for (let i = 0; i < dbits.length; i += 11) {
					// 	console.log(dbits.slice(i, i + 11) + "\n");
					// }
					// console.log("\n");
					// for (let i = 0; i < dbits.length; i += 8) {
					// 	console.log(dbits.slice(i, i + 8) + "\n");
					// }
				} else {
					alert("Given data has anappropriate format (Non-Alphanumerical char)");
				}
				break;

			case 0b0100:
				if (/^[\x00-\xff]{1,}$/.test(data)) {
					dbits = data.decodeAsASCII2();
//						 vvvvvvv СТАРА ВЕРСІЯ QRtable, та й це приклад для одиничного випадку
					if ((QRtable.L20.databytes * 8) - dbits.length > 0) { // ОЦЕ ТРЕБА ВИРІЗАТИ Й ВИНЕСТИ ЗА СВІЧ-КЕЙС
						dbits += "00000000";
					}
				} else {
					alert("Given data has anappropriate format (Non-ASCII char)");
				}
				break;
		}

		if (dbits.length < 16 * 8) {
			const dbiteslen = dbits.length / 8;
			for (let i = 0; i < 16 - dbiteslen; i++) {
				if (i % 2) {
					dbits += "00010001";
				} else {
					dbits += "11101100";
				}
			}
		}
		return dbits;
	}

	encodeECBits (data) {
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

	// matrix n canvas - matrix n canvas - matrix n canvas - matrix n canvas - matrix n canvas

	updateCanvas (mx = this.matrix) {
		for (let y = 0; y < this.modules; y++) {
			for (let x = 0; x < this.modules; x++) {
				this.ctx.fillStyle = QRT.palette[mx.x2get(x, y) % 2];
				this.ctx.fillRect(x, y, 1, 1);
			}
		}

		return this;
	}

	updateCanvasX (mx = this.matrix) {
		for (let y = 0; y < this.modules; y++) {
			for (let x = 0; x < this.modules; x++) {
				this.ctx.fillStyle = QRT.palette[mx.x2get(x, y)];
				this.ctx.fillRect(x, y, 1, 1);
			}
		}

		return this;
	}

	applyPointOn (x, y, c = 1) {
		if (this.matrix.x2get(x, y) < 2) {
			this.matrix.x2set(x, y, c);
		}
	}

	drawPointOn (x, y, c = 1) {
		if (this.matrix.x2get(x, y) < 2) {
			this.ctx.fillStyle = QRT.palette[c];
			this.ctx.fillRect(x, y, 1, 1);
		}
	}

	applyRectOn (x0, y0, x, y, fc, sc) {
		for (x0; x0 < x; x0++) {
			for (y0; y0 < y; y0++) {
				if (x == 0) {

				}
			}
		}
	}

	drawLineOn (x0, y0, x, y, c, w = 1, wcomp = true, roundcap = true) {
		if (wcomp && w > 1) {
			w = Math.floor(lineWidthCompensator(w, Math.atan((y - y0) / (x - x0))));
		}

		const _w = Math.floor(w / 2);
		this.ctx.fillStyle = QRT.palette[c];

		if (roundcap && w > 2) {
			this.drawEllipseOn(x0 - _w, y0 - _w, x0 + _w - 1, y0 + _w - 1, false, true, c);
			this.drawEllipseOn(x - _w, y - _w, x + _w - 1, y + _w - 1, false, true, c);
		}

		let dx = (x - x0), dy = (y - y0);

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
					if (this.matrix.x2getD(_x + i, _y, 2) < 2) this.ctx.fillRect(_x + i, _y, 1, 1);
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
					if (this.matrix.x2getD(_x, _y + i, 2) < 2) this.ctx.fillRect(_x, _y + i, 1, 1);
				}
			}
		}
	}

	applyLineOn (x0, y0, x, y, c, w = 1, wcomp = true, roundcap = true) {
		if (wcomp && w > 1) {
			w = Math.floor(lineWidthCompensator(w, Math.atan((y - y0) / (x - x0))));
		}

		const _w = Math.floor(w / 2);
		let dx = (x - x0), dy = (y - y0);

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
		this.ctx.fillStyle = QRT.palette[c];

		let _x, _y;
		let a = Math.abs(x - x0) + 1,
			b = Math.abs(y - y0) + 1;

		if (!center && a == 0 || b == 0) return;

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
				this.ctx.fillRect(x, _y, 1, 1);
			}

			if (this.matrix.x2getD(_x, _y, 2) < 2) {
				this.ctx.fillRect(_x, _y, 1, 1);
			}
		}

		for (x = -a; x <= a; x++) {
			y = Math.sqrt((b ** 2) - ((b * x / a) ** 2));
			_y = -Math.round(y - db) + y0;
			y = Math.round(y + db) + y0;
			_x = x + da + x0;

			if (this.matrix.x2getD(_x, y, 2) < 2) {
				this.ctx.fillRect(_x, y, 1, 1);
			}

			if (this.matrix.x2getD(_x, _y, 2) < 2) {
				this.ctx.fillRect(_x, _y, 1, 1);
			}
		}
	}

	applyEllipseOn (x0, y0, x, y, center = false, circle = false, c = 1) {
		let _x, _y;

		let a = Math.abs(x - x0) + 1,
			b = Math.abs(y - y0) + 1;

		if (!center && a == 0 || b == 0) return;

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

	applyDataOn (data) {
		return this.goThroughDataModules((x, y, j) => {
			this.matrix.x2set(x, y, +data[j]);
		}, {
			maxb: QRtable[this.version][this.ecdepth].dataBytes * 8
		});
	}

	applyECDataOn (ecdata) {
		let i = 0;
		this.goThroughDataModules((x, y) => {
			this.matrix.x2set(x, y, +ecdata[i++] + 6);
		}, this._forECDataOn);
	}

	decodeDataFrom () {
		let str = "";
		this.goThroughDataModules((x, y) => {
			str += this.matrix.x2get(x, y);
		});
		console.log(str);
	}

	goThroughDataModules (act, interval = {}) {
		if (!act) throw new Error("Inappropriate value of act arg. was put into goThroughDataModules method!");

		let x = interval.x || this.modules - 1,
			y = interval.y || this.modules - 1,
			v = interval.v || 1,
			j = interval.j || 0,
			maxb = interval.maxb;

		if (!maxb) {
			maxb = (QRtable[this.version][this.ecdepth].dataBytes + QRtable[this.version][this.ecdepth].ecBytes) * 8;
		} else {
			maxb = Math.min(maxb, (QRtable[this.version][this.ecdepth].dataBytes + QRtable[this.version][this.ecdepth].ecBytes) * 8);
		}

		for (let i = 0; j < maxb && i < 100000; i++) {
			//			^^^^^^^^
			if (x == 10 && y == this.modules) {
				y -= 9;
				x -= 2;
				v = -v;
			}

			if (x == 8 && y == 8) {
				x--;
			}

			if (x == this.modules - 9 && y == 6) {
				x -= 2;
				y -= 6;
				v = -v;
			}
			
			if (y < 0 || y >= this.modules || (y == 8 && (this.matrix.x2get(x, y) == 4 || this.matrix.x2get(x, y) == 5)) || (x <= 5 && y == this.modules - 11)) {
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
		if (output.length == 1) output = 0 + output;
		output += this.format5.toString(8);
		output += this.datatype.toString(8);

		console.log(output);
	}
}