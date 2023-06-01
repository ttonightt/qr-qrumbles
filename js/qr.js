
BASE = {
	ctx: 0,
	arts: [0, 0]
};

let mxcolors = ["white", "black", "tomato", "red", "cyan", "blue"];

class QRT {
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

		this.formatb = new Int8Array(15);
		this.data = data;
		this.encdata = this.encodeDataBits(this.data, 1);
		console.log(this.encdata);

		this.counter = 0; // 10-26: 12/11/16, 27-40: 14/13/16
		this.matrix = [];
		this.value = "";

		this.fillMatrix();
		this.applyFormatOn(this.masktype, this.ecdepth);
		this.applyVersionOn();
		this.encodeECBits(this.encdata);
		// this.applyDataTypeOn(datatype);

		// this.matrix[100][100] = 1;
		// this.matrix[99][101] = 1;
		// this.matrix[99][100] = 1;
		// this.matrix[99][99] = 1;
		// this.matrix[98][101] = 1;
		// this.matrix[98][100] = 1;
		// this.matrix[98][99] = 1;
		// this.matrix[99][98] = 1;
		// this.matrix[97][99] = 1;

		let mx = "";

		for (let i = 0; i < 500; i++) {
			mx += Math.round(Math.random());
		}

		this.applyDataOn();

		// this.fillMatrixWithData(mx);

		return this;
	}

	// preparations - preparations - preparations - preparations - preparations - preparations

	fillMatrix () {

		for (let i = 0; i < this.modules; i++) {
			this.matrix[i] = [];
			for (let j = 0; j < this.modules; j++) {
				this.matrix[i][j] = 0;
			}
		}

		let x, y;

		for (x = 7; x < this.modules - 7; x += 2) {
			this.matrix[6][x + 1] = 3;
			this.matrix[6][x] = 2;
		}

		for (y = 7; y < this.modules - 7; y += 2) {
			this.matrix[y + 1][6] = 3;
			this.matrix[y][6] = 2;
		}

		for (x = 6; x < this.modules; x += 28) {
			for (y = 6; y < this.modules; y += 28) {
				if (!(y == 6 && x == 6) && !(x == 6 && y == this.modules - 7) && !(x == this.modules - 7 && y == 6)) {
					this.applySmallBaseSquareOn(x, y);
				}
			}
		}

		this.applyBigBaseSquareOn(3, 3);
		this.applyBigBaseSquareOn(this.modules - 4, 3);
		this.applyBigBaseSquareOn(3, this.modules - 4);

		this.matrix[0][7] = 2;
		this.matrix[1][7] = 2;
		this.matrix[2][7] = 2;
		this.matrix[3][7] = 2;
		this.matrix[4][7] = 2;
		this.matrix[5][7] = 2;

		this.matrix[7][0] = 2;
		this.matrix[7][1] = 2;
		this.matrix[7][2] = 2;
		this.matrix[7][3] = 2;
		this.matrix[7][4] = 2;
		this.matrix[7][5] = 2;

		this.matrix[7][7] = 2;

		this.matrix[this.modules - 1][7] = 2;
		this.matrix[this.modules - 2][7] = 2;
		this.matrix[this.modules - 3][7] = 2;
		this.matrix[this.modules - 4][7] = 2;
		this.matrix[this.modules - 5][7] = 2;
		this.matrix[this.modules - 6][7] = 2;
		this.matrix[this.modules - 7][7] = 2;
		this.matrix[this.modules - 8][7] = 2;

		this.matrix[this.modules - 8][0] = 2;
		this.matrix[this.modules - 8][1] = 2;
		this.matrix[this.modules - 8][2] = 2;
		this.matrix[this.modules - 8][3] = 2;
		this.matrix[this.modules - 8][4] = 2;
		this.matrix[this.modules - 8][5] = 2;

		this.matrix[this.modules - 8][8] = 3;

		this.matrix[0][this.modules - 8] = 2;
		this.matrix[1][this.modules - 8] = 2;
		this.matrix[2][this.modules - 8] = 2;
		this.matrix[3][this.modules - 8] = 2;
		this.matrix[4][this.modules - 8] = 2;
		this.matrix[5][this.modules - 8] = 2;

		this.matrix[7][this.modules - 1] = 2;
		this.matrix[7][this.modules - 2] = 2;
		this.matrix[7][this.modules - 3] = 2;
		this.matrix[7][this.modules - 4] = 2;
		this.matrix[7][this.modules - 5] = 2;
		this.matrix[7][this.modules - 6] = 2;
		this.matrix[7][this.modules - 7] = 2;
		this.matrix[7][this.modules - 8] = 2;
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
		bits <<= 10;

		let _num = bits;
		
		for (let p = 0; Math.binlen(bits) > 10 && p < 100; p++) {
			bits ^= 0b10100110111 << (bits.toString(2).length - 11);
		}

		bits += _num;
		bits ^= 0b101010000010010;
		bits = bits.toString(2);
		bits = "0".repeat(15 - bits.length) + bits;

		this.matrix[8][0] = +bits[0] + 4;
		this.matrix[this.modules - 1][8] = +bits[0] + 4;

		this.matrix[8][1] = +bits[1] + 4;
		this.matrix[this.modules - 2][8] = +bits[1] + 4;

		this.matrix[8][2] = +bits[2] + 4;
		this.matrix[this.modules - 3][8] = +bits[2] + 4;

		this.matrix[8][3] = +bits[3] + 4;
		this.matrix[this.modules - 4][8] = +bits[3] + 4;

		this.matrix[8][4] = +bits[4] + 4;
		this.matrix[this.modules - 5][8] = +bits[4] + 4;

		this.matrix[8][5] = +bits[5] + 4;
		this.matrix[this.modules - 6][8] = +bits[5] + 4;

		this.matrix[8][7] = +bits[6] + 4;
		this.matrix[this.modules - 7][8] = +bits[6] + 4;

		this.matrix[8][8] = +bits[7] + 4;
		this.matrix[8][this.modules - 8] = +bits[7] + 4;

		this.matrix[7][8] = +bits[8] + 4;
		this.matrix[8][this.modules - 7] = +bits[8] + 4;

		this.matrix[5][8] = +bits[9] + 4;
		this.matrix[8][this.modules - 6] = +bits[9] + 4;

		this.matrix[4][8] = +bits[10] + 4;
		this.matrix[8][this.modules - 5] = +bits[10] + 4;

		this.matrix[3][8] = +bits[11] + 4;
		this.matrix[8][this.modules - 4] = +bits[11] + 4;

		this.matrix[2][8] = +bits[12] + 4;
		this.matrix[8][this.modules - 3] = +bits[12] + 4;

		this.matrix[1][8] = +bits[13] + 4;
		this.matrix[8][this.modules - 2] = +bits[13] + 4;

		this.matrix[0][8] = +bits[14] + 4;
		this.matrix[8][this.modules - 1] = +bits[14] + 4;
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
			this.matrix[5 - i][this.modules -  9] = +bits[(i * 3)] + 2;
			this.matrix[5 - i][this.modules - 10] = +bits[(i * 3) + 1] + 2;
			this.matrix[5 - i][this.modules - 11] = +bits[(i * 3) + 2] + 2;

			this.matrix[this.modules -  9][5 - i] = +bits[(i * 3)] + 2;
			this.matrix[this.modules - 10][5 - i] = +bits[(i * 3) + 1] + 2;
			this.matrix[this.modules - 11][5 - i] = +bits[(i * 3) + 2] + 2;
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
		for (let i = 0; i < mx.length; i++) {
			for (let j = 0; j < mx[i].length; j++) {
				this.ctx.fillStyle = mxcolors[mx[i][j] % 2];
				this.ctx.fillRect(j, i, 1, 1);
			}
		}

		return this;
	}

	updateCanvasX (mx = this.matrix) {
		for (let i = 0; i < mx.length; i++) {
			for (let j = 0; j < mx[i].length; j++) {
				this.ctx.fillStyle = mxcolors[mx[i][j]];
				this.ctx.fillRect(j, i, 1, 1);
			}
		}

		return this;
	}

	applyPointOn (x, y, c = 1) {
		if (this.matrix[y][x] < 2) {
			this.matrix[y][x] = c;
		}
	}

	drawPointOn (x, y, c = 1) {
		if (this.matrix[y][x] < 2) {
			this.ctx.fillStyle = mxcolors[c];
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

	applyLineOn (x0, y0, x, y, c1 = 1) {
		if (x - x0 == 0) {
			const dy = y - y0;
			for (y = 0; Math.abs(y) < Math.abs(dy); y++) {
				this.matrix[-y + y0][x] = c1;
			}
			return;
		}

		x0 = Math.fitinter(0, x0, this.modules);
		y0 = Math.fitinter(0, y0, this.modules);
		x = Math.fitinter(0, x, this.modules);
		y = Math.fitinter(0, y, this.modules);

		if (y - y0 > x - x0) {
			const k = (x - x0) / (y - y0), b = ((x0 * y) - (y0 * x)) / (y - y0);
			const dy = y - y0;
			for (y = 0; y < dy; y++) {
				x = Math.round((k * y) + b);
				this.matrix[y + y0][x + x0] = c1;
			}
		} else {
			const k = (y - y0) / (x - x0), b = ((y0 * x) - (x0 * y)) / (x - x0);
			const dx = x - x0;
			for (x = 0; x < dx; x++) {
				y = Math.round((k * x) + b);
				this.matrix[y][x + x0] = c1;
			}
		}
	}

	applyCircleOn (x0, y0, r, c = 1) {
		
	}

	applySmallBaseSquareOn (x0, y0, c0 = 2, c1 = 3) {
		this.matrix[y0 - 2][x0 - 2] = c1;
		this.matrix[y0 - 2][x0 - 1] = c1;
		this.matrix[y0 - 2][x0] = c1;
		this.matrix[y0 - 2][x0 + 1] = c1;
		this.matrix[y0 - 2][x0 + 2] = c1;
		this.matrix[y0 - 1][x0 + 2] = c1;
		this.matrix[y0][x0 + 2] = c1;
		this.matrix[y0 + 1][x0 + 2] = c1;
		this.matrix[y0 + 2][x0 + 2] = c1;
		this.matrix[y0 + 2][x0 + 1] = c1;
		this.matrix[y0 + 2][x0] = c1;
		this.matrix[y0 + 2][x0 - 1] = c1;
		this.matrix[y0 + 2][x0 - 2] = c1;
		this.matrix[y0 + 1][x0 - 2] = c1;
		this.matrix[y0][x0 - 2] = c1;
		this.matrix[y0 - 1][x0 - 2] = c1;

		this.matrix[y0 - 1][x0 - 1] = c0;
		this.matrix[y0 - 1][x0] = c0;
		this.matrix[y0 - 1][x0 + 1] = c0;
		this.matrix[y0][x0 + 1] = c0;
		this.matrix[y0 + 1][x0 + 1] = c0;
		this.matrix[y0 + 1][x0] = c0;
		this.matrix[y0 + 1][x0 - 1] = c0;
		this.matrix[y0][x0 - 1] = c0;

		this.matrix[y0][x0] = c1;
	}

	applyBigBaseSquareOn (x0, y0, c0 = 2, c1 = 3) {
		this.matrix[y0 - 3][x0 - 3] = c1;
		this.matrix[y0 - 3][x0 - 2] = c1;
		this.matrix[y0 - 3][x0 - 1] = c1;
		this.matrix[y0 - 3][x0] = c1;
		this.matrix[y0 - 3][x0 + 1] = c1;
		this.matrix[y0 - 3][x0 + 2] = c1;
		this.matrix[y0 - 3][x0 + 3] = c1;
		this.matrix[y0 - 2][x0 + 3] = c1;
		this.matrix[y0 - 1][x0 + 3] = c1;
		this.matrix[y0][x0 + 3] = c1;
		this.matrix[y0 + 1][x0 + 3] = c1;
		this.matrix[y0 + 2][x0 + 3] = c1;
		this.matrix[y0 + 3][x0 + 3] = c1;
		this.matrix[y0 + 3][x0 + 2] = c1;
		this.matrix[y0 + 3][x0 + 1] = c1;
		this.matrix[y0 + 3][x0] = c1;
		this.matrix[y0 + 3][x0 - 1] = c1;
		this.matrix[y0 + 3][x0 - 2] = c1;
		this.matrix[y0 + 3][x0 - 3] = c1;
		this.matrix[y0 + 2][x0 - 3] = c1;
		this.matrix[y0 + 1][x0 - 3] = c1;
		this.matrix[y0][x0 - 3] = c1;
		this.matrix[y0 - 1][x0 - 3] = c1;
		this.matrix[y0 - 2][x0 - 3] = c1;

		this.matrix[y0 - 2][x0 - 2] = c0;
		this.matrix[y0 - 2][x0 - 1] = c0;
		this.matrix[y0 - 2][x0] = c0;
		this.matrix[y0 - 2][x0 + 1] = c0;
		this.matrix[y0 - 2][x0 + 2] = c0;
		this.matrix[y0 - 1][x0 + 2] = c0;
		this.matrix[y0][x0 + 2] = c0;
		this.matrix[y0 + 1][x0 + 2] = c0;
		this.matrix[y0 + 2][x0 + 2] = c0;
		this.matrix[y0 + 2][x0 + 1] = c0;
		this.matrix[y0 + 2][x0] = c0;
		this.matrix[y0 + 2][x0 - 1] = c0;
		this.matrix[y0 + 2][x0 - 2] = c0;
		this.matrix[y0 + 1][x0 - 2] = c0;
		this.matrix[y0][x0 - 2] = c0;
		this.matrix[y0 - 1][x0 - 2] = c0;

		this.matrix[y0 - 1][x0 - 1] = c1;
		this.matrix[y0][x0] = c1;
		this.matrix[y0 + 1][x0 + 1] = c1;
		this.matrix[y0 - 1][x0 + 1] = c1;
		this.matrix[y0 + 1][x0 - 1] = c1;
		this.matrix[y0][x0 + 1] = c1;
		this.matrix[y0][x0 - 1] = c1;
		this.matrix[y0 + 1][x0] = c1;
		this.matrix[y0 - 1][x0] = c1;
	}



	applyDataOn (data = "101010010111101010101111", start = 0) {
		let x = this.modules - 1, y = this.modules - 1, v = 1;
		this.matrix[y][x--] = parseInt(data[0]);
		// const maxlen = QRtable[this.version]["L"].dataBytes * 8;
		const maxlen = (QRtable[this.version]["L"].dataBytes + (QRtable[this.version]["L"].ecBytes * (QRtable[this.version]["L"].g1Blocks + QRtable[this.version]["L"].g2Blocks))) * 8;
		for (let i = 1, j = 0; j < data.length && j < maxlen; i++) {
			if (x == 10 && y == this.modules) {
				console.log("jump3");
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
			
			if (y < 0 || y >= this.modules || (y == 8 && (this.matrix[y][x] == 4 || this.matrix[y][x] == 5)) || (x <= 5 && y == this.modules - 11)) {
				y += v;
				x -= 2;
				v = -v;
				this.matrix[y][x] = parseInt(data[j++]);
			} else if (this.matrix[y][x] == 0 || this.matrix[y][x] == 1) {
				this.matrix[y][x] = parseInt(data[j++]);
			}
			if (i % 2) {
				x++;
				y -= v;
			} else {
				x--;
			}
		}
	}

	applyDataTypeOn (n, c = 5) {
		n = parseInt(n);
		this.matrix[this.modules - 2][this.modules - 2] = c - 1;
		this.matrix[this.modules - 2][this.modules - 1] = c - 1;
		this.matrix[this.modules - 1][this.modules - 1] = c - 1;
		this.matrix[this.modules - 1][this.modules - 2] = c - 1;
		this.matrix[(this.modules - 2) + Math.floor(n / 2)][(this.modules - 2) + (n % 2)] = c;

		return this;
	}
	
	// building - building - building - building - building - building - building

	buildTQRT () {
		let nbin = "";

		for (let i = 0; i < 2; i++) {
			for (let j = 0; j < 17; j++) {
				nbin += this.matrix[i][j] % 2;
			}
		}

		return nbin;
	}
}