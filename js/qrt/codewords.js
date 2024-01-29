"use strict";

const Alphanumerical = {
	__ref: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ\u0020$%*+-./:",

	charByCode (code) {
		return Alphanumerical.__ref[code];
	},

	codeByChar (char) {
		return Alphanumerical.__ref.indexOf(char);
	}
};

const Latin2 = {
	__ref: "\u0000\u0001\u0002\u0003\u0004\u0005\u0006\u0007\u0008\u0009\u000a\u000b\u000c\u000d\u000e\u000f\u0010\u0011\u0012\u0013\u0014\u0015\u0016\u0017\u0018\u0019\u001a\u001b\u001c\u001d\u001e\u001f\u0020\u0021\u0022\u0023\u0024\u0025\u0026\u0027\u0028\u0029\u002a\u002b\u002c\u002d\u002e\u002f\u0030\u0031\u0032\u0033\u0034\u0035\u0036\u0037\u0038\u0039\u003a\u003b\u003c\u003d\u003e\u003f\u0040\u0041\u0042\u0043\u0044\u0045\u0046\u0047\u0048\u0049\u004a\u004b\u004c\u004d\u004e\u004f\u0050\u0051\u0052\u0053\u0054\u0055\u0056\u0057\u0058\u0059\u005a\u005b\u005c\u005d\u005e\u005f\u0060\u0061\u0062\u0063\u0064\u0065\u0066\u0067\u0068\u0069\u006a\u006b\u006c\u006d\u006e\u006f\u0070\u0071\u0072\u0073\u0074\u0075\u0076\u0077\u0078\u0079\u007a\u007b\u007c\u007d\u007e\u007f\u0080\u0081\u0082\u0083\u0084\u0085\u0086\u0087\u0088\u0089\u008a\u008b\u008c\u008d\u008e\u008f\u0090\u0091\u0092\u0093\u0094\u0095\u0096\u0097\u0098\u0099\u009a\u009b\u009c\u009d\u009e\u009f\u00a0\u0104\u02D8\u0141\u00a4\u013D\u015A\u00a7\u00a8\u0160\u015E\u0164\u0179\u00ad\u017D\u017B\u00b0\u0105\u02DB\u0142\u00b4\u013E\u015B\u02C7\u00b8\u0161\u015F\u0165\u017A\u02DD\u017E\u017C\u0154\u00c1\u00c2\u0102\u00c4\u0139\u0106\u00c7\u010C\u00c9\u0118\u00cb\u011A\u00cd\u00ce\u010E\u0110\u0143\u0147\u00d3\u00d4\u0150\u00d6\u00d7\u0158\u016E\u00da\u0170\u00dc\u00dd\u0162\u00df\u0155\u00e1\u00e2\u0103\u00e4\u013A\u0107\u00e7\u010D\u00e9\u0119\u00eb\u011B\u00ed\u00ee\u010F\u0111\u0144\u0148\u00f3\u00f4\u0151\u00f6\u00f7\u0159\u016F\u00fa\u0171\u00fc\u00fd\u0163\u02D9",

	charByCode (code) {
		return Latin2.__ref[code];
	},

	codeByChar (char) {
		return Latin2.__ref.indexOf(char);
	}
};

const Windows1251 = {
	__ref: "\u0000\u0001\u0002\u0003\u0004\u0005\u0006\u0007\u0008\u0009\u000a\u000b\u000c\u000d\u000e\u000f\u0010\u0011\u0012\u0013\u0014\u0015\u0016\u0017\u0018\u0019\u001a\u001b\u001c\u001d\u001e\u001f\u0020\u0021\u0022\u0023\u0024\u0025\u0026\u0027\u0028\u0029\u002a\u002b\u002c\u002d\u002e\u002f\u0030\u0031\u0032\u0033\u0034\u0035\u0036\u0037\u0038\u0039\u003a\u003b\u003c\u003d\u003e\u003f\u0040\u0041\u0042\u0043\u0044\u0045\u0046\u0047\u0048\u0049\u004a\u004b\u004c\u004d\u004e\u004f\u0050\u0051\u0052\u0053\u0054\u0055\u0056\u0057\u0058\u0059\u005a\u005b\u005c\u005d\u005e\u005f\u0060\u0061\u0062\u0063\u0064\u0065\u0066\u0067\u0068\u0069\u006a\u006b\u006c\u006d\u006e\u006f\u0070\u0071\u0072\u0073\u0074\u0075\u0076\u0077\u0078\u0079\u007a\u007b\u007c\u007d\u007e\u007f\u0402\u0403\u201a\u0453\u201e\u2026\u2020\u2021\u20ac\u2030\u0409\u2039\u040a\u040c\u040b\u040f\u0452\u2018\u2019\u201c\u201d\u2022\u2013\u2014\u0098\u2122\u0459\u203a\u045a\u045c\u045b\u045f\u00a0\u040e\u045e\u0408\u00a4\u0490\u00a6\u00a7\u0401\u00a9\u0404\u00ab\u00ac\u00ad\u00ae\u0407\u00b0\u00b1\u0406\u0456\u0491\u00b5\u00b6\u00b7\u0451\u2116\u0454\u00bb\u0458\u0405\u0455\u0457\u0410\u0411\u0412\u0413\u0414\u0415\u0416\u0417\u0418\u0419\u041a\u041b\u041c\u041d\u041e\u041f\u0420\u0421\u0422\u0423\u0424\u0425\u0426\u0427\u0428\u0429\u042a\u042b\u042c\u042d\u042e\u042f\u0430\u0431\u0432\u0433\u0434\u0435\u0436\u0437\u0438\u0439\u043a\u043b\u043c\u043d\u043e\u043f\u0440\u0441\u0442\u0443\u0444\u0445\u0446\u0447\u0448\u0449\u044a\u044b\u044c\u044d\u044e\u044f",

	charByCode (code) {
		return Windows1251.__ref[code];
	},

	codeByChar (char) {
		return Windows1251.__ref.indexOf(char);
	}
};

const Windows1250 = {
	__ref: "\u0000\u0001\u0002\u0003\u0004\u0005\u0006\u0007\u0008\u0009\u000a\u000b\u000c\u000d\u000e\u000f\u0010\u0011\u0012\u0013\u0014\u0015\u0016\u0017\u0018\u0019\u001a\u001b\u001c\u001d\u001e\u001f\u0020\u0021\u0022\u0023\u0024\u0025\u0026\u0027\u0028\u0029\u002a\u002b\u002c\u002d\u002e\u002f\u0030\u0031\u0032\u0033\u0034\u0035\u0036\u0037\u0038\u0039\u003a\u003b\u003c\u003d\u003e\u003f\u0040\u0041\u0042\u0043\u0044\u0045\u0046\u0047\u0048\u0049\u004a\u004b\u004c\u004d\u004e\u004f\u0050\u0051\u0052\u0053\u0054\u0055\u0056\u0057\u0058\u0059\u005a\u005b\u005c\u005d\u005e\u005f\u0060\u0061\u0062\u0063\u0064\u0065\u0066\u0067\u0068\u0069\u006a\u006b\u006c\u006d\u006e\u006f\u0070\u0071\u0072\u0073\u0074\u0075\u0076\u0077\u0078\u0079\u007a\u007b\u007c\u007d\u007e\u007f\u20ac\u0081\u201a\u0083\u201e\u2026\u2020\u2021\u0088\u2030\u0160\u2039\u015a\u0164\u017d\u0179\u0090\u2018\u2019\u201c\u201d\u2022\u2013\u2014\u0098\u2122\u0161\u203a\u015b\u0165\u017e\u017a\u00a0\u02c7\u02d8\u0141\u00a4\u0104\u00a6\u00a7\u00a8\u00a9\u015e\u00ab\u00ac\u00ad\u00ae\u017b\u00b0\u00b1\u02db\u0142\u00b4\u00b5\u00b6\u00b7\u00b8\u0105\u015f\u00bb\u013d\u02dd\u013e\u017c\u0154\u00c1\u00c2\u0102\u00c4\u0139\u0106\u00c7\u010c\u00c9\u0118\u00cb\u011a\u00cd\u00ce\u010e\u0110\u0143\u0147\u00d3\u00d4\u0150\u00d6\u00d7\u0158\u016e\u00da\u0170\u00dc\u00dd\u0162\u00df\u0155\u00e1\u00e2\u0103\u00e4\u013a\u0107\u00e7\u010d\u00e9\u0119\u00eb\u011b\u00ed\u00ee\u010f\u0111\u0144\u0148\u00f3\u00f4\u0151\u00f6\u00f7\u0159\u016f\u00fa\u0171\u00fc\u00fd\u0163\u02d9",

	charByCode (code) {
		return Windows1250.__ref[code];
	},

	codeByChar (char) {
		return Windows1250.__ref.indexOf(char);
	}
};

export default class CodewordArray extends Uint8ClampedArray {

	static logb (cw) {
		if (cw instanceof CodewordArray) {
			let str = "";

			for (let i = 0; i < cw.length; i++) {
				str += cw[i].toString(2).padStart(8, "0") + " ";
			}

			console.log("length: " + cw.length + "\n" + str);
		}
	}

	static encode (cws, datarr, counterref, offsetBit, offsetByte) {
		/*
			DATARR - array of blocks of chars to encode into binary by means of different tables: [
				{
					encoding: latin1/byte/numerical/alphanumerical/latin2/windows1250/windows1251,
					chars: "..."
				},
				{
					encoding: ...,
					chars: ...
				},
				...
			]

			COUNTEREF - object of lengths of different types counter blocks: {
				N: 10/12/14, *counter bits for number encoding*
				A: 9/11/13, *counter bits for alphanumerical encoding*
				B: 8/16/16 *counter bits for byte encoding*
			}
		*/
		if (!(cws instanceof CodewordArray)) throw new Error("..."); // <<<

		let k = (offsetBit || 0) % 8,
			c = offsetByte || 0;

		if (k < 0 || c >= cws.length) throw new Error("..."); // <<<

		let space = ((cws.length - c) * 8) + k,
			buff = this[c] >> (8 - k),
			charcap;

		let i, j;

		for (i = 0; i < datarr.length; i++) {
			const chars = datarr[i].chars || "";

			if (datarr[i].encoding !== "end" && chars === "") throw new Error("You've tried to encode nothing!");

			switch (datarr[i].encoding) { // ADDING ECI INDICATOR AND ECI CODE
				case "latin1":
					buff = (buff << 4) + 0b0111;
					buff = (buff << 8) + 3;
					k += 12;
					space -= 12;
					break;
				case "latin2":
					buff = (buff << 4) + 0b0111;
					buff = (buff << 8) + 4;
					k += 12;
					space -= 12;
					break;
				case "windows1251":
					buff = (buff << 4) + 0b0111;
					buff = (buff << 8) + 22;
					k += 12;
					space -= 12;
					break;
				case "windows1250":
					buff = (buff << 4) + 0b0111;
					buff = (buff << 8) + 21;
					k += 12;
					space -= 12;
					break;
			}

			if (k >= 8) {
				k -= 8;
				cws[c++] = buff >> k;
				buff %= 1 << k;
			}

			if (k >= 8) {
				k -= 8;
				cws[c++] = buff >> k;
				buff %= 1 << k;
			}

			switch (datarr[i].encoding) { // ADD BASIC ENCODING INDICATOR AND CHAR COUNTER
				case "latin1": case "latin2": case "windows1250": case "windows1251": case "byte":

					buff = (buff << 4) + 0b0100;

					k += 4 + counterref.B;
					space -= 4 + counterref.B;

					charcap = Math.floor(space / 8);
					buff = buff << counterref.B;

					break;
				case "alphanumerical":

					buff = (buff << 4) + 0b0010;

					k += 4 + counterref.A;
					space -= 4 + counterref.A;

					charcap = Math.floor(space / 11) * 2;
					buff = buff << counterref.A;

					if (space % 11 >= 6) charcap++;

					break;
				case "numerical":

					buff = (buff << 4) + 0b0001;

					k += 4 + counterref.N;
					space -= 4 + counterref.N;

					charcap = Math.floor(space / 10) * 3;
					buff = buff << counterref.N;

					if (space % 10 >= 7) {
						charcap += 2;
					} else if (space % 10 >= 4) {
						charcap++;
					}
					break;
				case "binary":

					charcap = space;
					break;
				case "end":
					buff <<= 4;
					k += 4;
					space -= 4;
					charcap = Math.floor(space / 8);
					break;
			}

			if (datarr[i].encoding !== "end") { // ТРЕБА ПЕРЕРОБИТИ ОЦЕЙ ВЕСЬ БЛОК
				if (charcap < chars.length) { // CHECK

					console.warn("You tried to encode more characters than such a codeword can contain. Only fitted data was encoded!");
					if (charcap < 1) return; // ?????????

				} else {
					charcap = chars.length;
				}

				if (datarr[i].encoding !== "binary") {
					buff += charcap;
				}
			}

			if (k >= 8) {
				k -= 8;
				cws[c++] = buff >> k;
				buff %= 1 << k;
			}

			if (k >= 8) {
				k -= 8;
				cws[c++] = buff >> k;
				buff %= 1 << k;
			}

			switch (datarr[i].encoding) { // ENCODING AND DISTRIBUTION OF CHARACTERS
				case "latin1": case "byte": // ------------------------------------- LATIN-1 ------------ 8

					for (j = 0; j < charcap; j++) {
						buff = (buff << 8) + chars.charCodeAt(j);
						cws[c++] = buff >> k;
						buff %= 1 << k;
						space -= 8;
					}
					break;
				case "latin2": // -------------------------------------------------- LATIN-2 ------------ 8

					for (j = 0; j < charcap; j++) {
						buff = (buff << 8) + Latin2.codeByChar(chars[j]);
						cws[c++] = buff >> k;
						buff %= 1 << k;
						space -= 8;
					}
					break;
				case "windows1251": // --------------------------------------------- WINDOWS-1251 ------- 8

					for (j = 0; j < charcap; j++) {
						buff = (buff << 8) + Windows1251.codeByChar(chars[j]);
						cws[c++] = buff >> k;
						buff %= 1 << k;
						space -= 8;
					}
					break;
				case "windows1250": // --------------------------------------------- WINDOWS-1250 ------- 8

					for (j = 0; j < charcap; j++) {
						buff = (buff << 8) + Windows1250.codeByChar(chars[j]);
						cws[c++] = buff >> k;
						buff %= 1 << k;
						space -= 8;
					}
					break;
				case "alphanumerical": // ------------------------------------------ ALPHANUM ----------- 11 / 6

					for (j = 0; j < charcap - 1; j += 2) {
						buff = (buff << 11) + (45 * Alphanumerical.codeByChar(chars[j])) + Alphanumerical.codeByChar(chars[j + 1]);
						k += 11;
						space -= 11;

						if (k >= 16) {
							k -= 8;
							cws[c++] = buff >> k;
							buff %= 1 << k;
						}

						k -= 8;
						cws[c++] = buff >> k;
						buff %= 1 << k;
					}

					if (charcap % 2) {
						buff = (buff << 6) + Alphanumerical.codeByChar(chars[j]);
						k += 6;
						space -= 6;
					}
					break;
				case "numerical": // ----------------------------------------------- NUMERICAL ---------- 10 / 7 / 4

					for (j = 0; j < charcap - 2; j += 3) {
						buff = (buff << 10) + parseInt(chars[j] + chars[j + 1] + chars[j + 2]);
						k += 10;
						space -= 10;

						if (k >= 16) {
							k -= 8;
							cws[c++] = buff >> k;
							buff %= 1 << k;
						}

						k -= 8;
						cws[c++] = buff >> k;
						buff %= 1 << k;
					}

					switch (charcap % 3) {
						case 1:
							buff = (buff << 4) + parseInt(chars[j]);
							k += 4;
							space -= 4;
							break;
						case 2:
							buff = (buff << 7) + parseInt(chars[j] + chars[j + 1]);
							k += 7;
							space -= 7;
							break;
					}
					break;
				case "binary":

					for (j = 0; j < charcap; j++) {
						buff = (buff << 1) + parseInt(chars[j], 2);
						k++;
						space--;

						if (k === 8) {
							cws[c++] = buff;
							buff = 0;
							k -= 8;
						}
					}
					break;
				case "end":

					cws[c++] = buff << (space % 8);
					space -= space % 8;

					for (j = 0; j < charcap - 1; j += 2) {
						cws[c++] = 0b11101100;
						cws[c++] = 0b00010001;
					}

					if (charcap % 2) {
						cws[c] = 0b11101100;
					}

					return cws;
			}

			if (k >= 8) { // may be true only after encoding alphanum or num only
				k -= 8;
				cws[c++] = buff >> k;
				buff %= 1 << k;
			}
		}

		cws[c] += (buff << (8 - (k % 8)));

		return cws;
	}

	constructor (length) {
		super(length);
	}

	static interleave (cws, g1rows, g2rows, g1cols) {
		if (cws instanceof CodewordArray && cws.length === (g1rows * g1cols) + (g2rows * (g1cols + 1))) {

			const ncws = new CodewordArray(cws.length);

			for (let y = 0; y < g1rows; y++) {
				for (let x = 0; x < g1cols; x++) {
					ncws[(x * (g1rows + g2rows)) + y] = cws[(y * g1cols) + x];
				}
			}

			for (let y = 0; y < g2rows; y++) {
				for (let x = 0; x < g1cols; x++) {
					ncws[(x * (g1rows + g2rows)) + y + g1rows] = cws[(g1rows * g1cols) + (y * (g1cols + 1)) + x];
				}

				ncws[ncws.length - g2rows + y] = cws[(g1rows * g1cols) + ((y + 1) * (g1cols + 1)) - 1];
			}

			return ncws;
		} else throw new Error("Codeword length doesn't match the required!\n" + cws.length + " !== " + parseInt((g1rows * g1cols) + (g2rows * (g1cols + 1))) + " (" + g1rows + " * " + g1cols + " + " + g2rows + " * " + parseInt(g1cols + 1) + ")"); // <<<
	}

	static uninterleave (cws, g1rows, g2rows, g1cols) {
		if (cws instanceof CodewordArray && cws.length === (g1rows * g1cols) + (g2rows * (g1cols + 1))) {

			const ncws = new CodewordArray(cws.length);

			let c = 0;

			for (let x = 0; x < g1rows + g2rows; x++) {
				for (let y = 0; y < g1cols; y++) {
					ncws[c++] = cws[(y * (g1rows + g2rows)) + x];
				}

				if (x >= g1rows) {
					ncws[c++] = cws[(g1cols * (g1rows + g2rows)) + x - g1rows];
				}
			}

			return ncws;
		} else throw new Error("..."); // <<<
	}

	static generateInterlateRSC (cws) { // IT'S ONLY INTERLATE THE GIVEN ALREADY ENCODED EC CWS FOR ONLY QR VERSION 20 NOW

		// if (cws instanceof CodewordArray && cws.length === (g1rows * g1cols) + (g2rows * (g1cols + 1))) {

			const ncws = new CodewordArray(cws.length);
			for (let i = 0; i < cws.length; i++) {
				ncws[((i % 30) * 12) + Math.floor(i / 30)] = cws[i];
			}
		// } else throw new Error("..."); // <<<

		return ncws;
	}
}