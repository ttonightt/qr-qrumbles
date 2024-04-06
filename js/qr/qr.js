"use strict";

import {GF256, polyGens} from "./qr-tables.js";
import {Bath} from "../tiny-usefuls";

const Alphanumerical = { // Capital letters from A to Z as well as decimal arabic letters and a few special characters
	__ref: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ\u0020$%*+-./:",

	charByCode (code) {
		return Alphanumerical.__ref[code];
	},

	codeByChar (char) {
		return Alphanumerical.__ref.indexOf(char);
	}
};

const Latin2 = { // Central European languages such as Checz, Croatian, Hungarian, etc.
	__ref: "\u0000\u0001\u0002\u0003\u0004\u0005\u0006\u0007\u0008\u0009\u000a\u000b\u000c\u000d\u000e\u000f\u0010\u0011\u0012\u0013\u0014\u0015\u0016\u0017\u0018\u0019\u001a\u001b\u001c\u001d\u001e\u001f\u0020\u0021\u0022\u0023\u0024\u0025\u0026\u0027\u0028\u0029\u002a\u002b\u002c\u002d\u002e\u002f\u0030\u0031\u0032\u0033\u0034\u0035\u0036\u0037\u0038\u0039\u003a\u003b\u003c\u003d\u003e\u003f\u0040\u0041\u0042\u0043\u0044\u0045\u0046\u0047\u0048\u0049\u004a\u004b\u004c\u004d\u004e\u004f\u0050\u0051\u0052\u0053\u0054\u0055\u0056\u0057\u0058\u0059\u005a\u005b\u005c\u005d\u005e\u005f\u0060\u0061\u0062\u0063\u0064\u0065\u0066\u0067\u0068\u0069\u006a\u006b\u006c\u006d\u006e\u006f\u0070\u0071\u0072\u0073\u0074\u0075\u0076\u0077\u0078\u0079\u007a\u007b\u007c\u007d\u007e\u007f\u0080\u0081\u0082\u0083\u0084\u0085\u0086\u0087\u0088\u0089\u008a\u008b\u008c\u008d\u008e\u008f\u0090\u0091\u0092\u0093\u0094\u0095\u0096\u0097\u0098\u0099\u009a\u009b\u009c\u009d\u009e\u009f\u00a0\u0104\u02D8\u0141\u00a4\u013D\u015A\u00a7\u00a8\u0160\u015E\u0164\u0179\u00ad\u017D\u017B\u00b0\u0105\u02DB\u0142\u00b4\u013E\u015B\u02C7\u00b8\u0161\u015F\u0165\u017A\u02DD\u017E\u017C\u0154\u00c1\u00c2\u0102\u00c4\u0139\u0106\u00c7\u010C\u00c9\u0118\u00cb\u011A\u00cd\u00ce\u010E\u0110\u0143\u0147\u00d3\u00d4\u0150\u00d6\u00d7\u0158\u016E\u00da\u0170\u00dc\u00dd\u0162\u00df\u0155\u00e1\u00e2\u0103\u00e4\u013A\u0107\u00e7\u010D\u00e9\u0119\u00eb\u011B\u00ed\u00ee\u010F\u0111\u0144\u0148\u00f3\u00f4\u0151\u00f6\u00f7\u0159\u016F\u00fa\u0171\u00fc\u00fd\u0163\u02D9",

	charByCode (code) {
		return Latin2.__ref[code];
	},

	codeByChar (char) {
		return Latin2.__ref.indexOf(char);
	}
};

const Windows1251 = { // Cyrillic script languages of Europe such as Bulgarian, Ukrainian, Serbian, etc.
	__ref: "\u0000\u0001\u0002\u0003\u0004\u0005\u0006\u0007\u0008\u0009\u000a\u000b\u000c\u000d\u000e\u000f\u0010\u0011\u0012\u0013\u0014\u0015\u0016\u0017\u0018\u0019\u001a\u001b\u001c\u001d\u001e\u001f\u0020\u0021\u0022\u0023\u0024\u0025\u0026\u0027\u0028\u0029\u002a\u002b\u002c\u002d\u002e\u002f\u0030\u0031\u0032\u0033\u0034\u0035\u0036\u0037\u0038\u0039\u003a\u003b\u003c\u003d\u003e\u003f\u0040\u0041\u0042\u0043\u0044\u0045\u0046\u0047\u0048\u0049\u004a\u004b\u004c\u004d\u004e\u004f\u0050\u0051\u0052\u0053\u0054\u0055\u0056\u0057\u0058\u0059\u005a\u005b\u005c\u005d\u005e\u005f\u0060\u0061\u0062\u0063\u0064\u0065\u0066\u0067\u0068\u0069\u006a\u006b\u006c\u006d\u006e\u006f\u0070\u0071\u0072\u0073\u0074\u0075\u0076\u0077\u0078\u0079\u007a\u007b\u007c\u007d\u007e\u007f\u0402\u0403\u201a\u0453\u201e\u2026\u2020\u2021\u20ac\u2030\u0409\u2039\u040a\u040c\u040b\u040f\u0452\u2018\u2019\u201c\u201d\u2022\u2013\u2014\u0098\u2122\u0459\u203a\u045a\u045c\u045b\u045f\u00a0\u040e\u045e\u0408\u00a4\u0490\u00a6\u00a7\u0401\u00a9\u0404\u00ab\u00ac\u00ad\u00ae\u0407\u00b0\u00b1\u0406\u0456\u0491\u00b5\u00b6\u00b7\u0451\u2116\u0454\u00bb\u0458\u0405\u0455\u0457\u0410\u0411\u0412\u0413\u0414\u0415\u0416\u0417\u0418\u0419\u041a\u041b\u041c\u041d\u041e\u041f\u0420\u0421\u0422\u0423\u0424\u0425\u0426\u0427\u0428\u0429\u042a\u042b\u042c\u042d\u042e\u042f\u0430\u0431\u0432\u0433\u0434\u0435\u0436\u0437\u0438\u0439\u043a\u043b\u043c\u043d\u043e\u043f\u0440\u0441\u0442\u0443\u0444\u0445\u0446\u0447\u0448\u0449\u044a\u044b\u044c\u044d\u044e\u044f",

	charByCode (code) {
		return Windows1251.__ref[code];
	},

	codeByChar (char) {
		return Windows1251.__ref.indexOf(char);
	}
};

const Windows1250 = { // Central European languages such as Checz, Croatian, Hungarian, etc.
	__ref: "\u0000\u0001\u0002\u0003\u0004\u0005\u0006\u0007\u0008\u0009\u000a\u000b\u000c\u000d\u000e\u000f\u0010\u0011\u0012\u0013\u0014\u0015\u0016\u0017\u0018\u0019\u001a\u001b\u001c\u001d\u001e\u001f\u0020\u0021\u0022\u0023\u0024\u0025\u0026\u0027\u0028\u0029\u002a\u002b\u002c\u002d\u002e\u002f\u0030\u0031\u0032\u0033\u0034\u0035\u0036\u0037\u0038\u0039\u003a\u003b\u003c\u003d\u003e\u003f\u0040\u0041\u0042\u0043\u0044\u0045\u0046\u0047\u0048\u0049\u004a\u004b\u004c\u004d\u004e\u004f\u0050\u0051\u0052\u0053\u0054\u0055\u0056\u0057\u0058\u0059\u005a\u005b\u005c\u005d\u005e\u005f\u0060\u0061\u0062\u0063\u0064\u0065\u0066\u0067\u0068\u0069\u006a\u006b\u006c\u006d\u006e\u006f\u0070\u0071\u0072\u0073\u0074\u0075\u0076\u0077\u0078\u0079\u007a\u007b\u007c\u007d\u007e\u007f\u20ac\u0081\u201a\u0083\u201e\u2026\u2020\u2021\u0088\u2030\u0160\u2039\u015a\u0164\u017d\u0179\u0090\u2018\u2019\u201c\u201d\u2022\u2013\u2014\u0098\u2122\u0161\u203a\u015b\u0165\u017e\u017a\u00a0\u02c7\u02d8\u0141\u00a4\u0104\u00a6\u00a7\u00a8\u00a9\u015e\u00ab\u00ac\u00ad\u00ae\u017b\u00b0\u00b1\u02db\u0142\u00b4\u00b5\u00b6\u00b7\u00b8\u0105\u015f\u00bb\u013d\u02dd\u013e\u017c\u0154\u00c1\u00c2\u0102\u00c4\u0139\u0106\u00c7\u010c\u00c9\u0118\u00cb\u011a\u00cd\u00ce\u010e\u0110\u0143\u0147\u00d3\u00d4\u0150\u00d6\u00d7\u0158\u016e\u00da\u0170\u00dc\u00dd\u0162\u00df\u0155\u00e1\u00e2\u0103\u00e4\u013a\u0107\u00e7\u010d\u00e9\u0119\u00eb\u011b\u00ed\u00ee\u010f\u0111\u0144\u0148\u00f3\u00f4\u0151\u00f6\u00f7\u0159\u016f\u00fa\u0171\u00fc\u00fd\u0163\u02d9",

	charByCode (code) {
		return Windows1250.__ref[code];
	},

	codeByChar (char) {
		return Windows1250.__ref.indexOf(char);
	}
};

class Datablocks {

	toString () {
		let str = "";

		for (let i = 0; i < this.length; i++) {

			str += this[i].chars;
		}

		return str;
	}

	constructor (chars, blocks) {

		this.chars = "some string";
		this.blocks = [{

			type: "vacuum"
		}];
	}

	bufferizeAll () {

		this.buffer = this.toString();
	}

	updateLayout () {


	}

	modifyDatablocks (...dbmods) {
		/*
			{
				action: "change-char", // changes specific char or chars, in case of removing chars lefts vacuum
				chars: "c"
				block: 2,
				textOffset: 14
			}
			{
				action: "create-block", // pastes new block BEFORE the noted one, truncates the following one, lefts vacuum in case it's necessary
				block: 3,
				encoding: "latin2",
				chars: "initial"
			}
			{
				action: "remove-block", // removes specific block and lefts vacuum on its place
				block: 3,
				encoding: "latin2",
				chars: "initial"
			}
			{
				action: "resize-block", // changes char capacity of the focused block through the truncation of following blocks, lefts vacuum in case it's necessary
				block: 10,
				textOffset: 14,
				textEndOffset: 231
			}
		*/

		let i, j;

		for (i = 0; i < dbmods.length; i++) {

			const fdb = this.datablocks[dbmods[i].block]; // FOCUSED DATABLOCK
			const dbm = dbmods[i]; // CURRENT DATABLOCK MODIFIER

			switch (dbm.action) {

				case "create-block": // -------------------------------------- CREATE BLOCK

					// datablock ordering

					for (j = this.datablocks.length; j > target; j--) {

						this.datablocks[j] = this.datablocks[j - 1];
						this.datablocks[j].block = j;
					}

					fdb = {

						encoding: dbmods[i].encoding,
						chars: dbmods[i].chars ?? "",
						index: dbmods[i].block
					};

					const bitEndOffset_ = this.__encode(fdb);

					if (bitEndOffset_ > dbmods[i].block) {

						for (j = dbmods[i].block + 1; bitEndOffset_ > dbmods[j].bitEndOffset; j++);

						this.datablocks.splice(j, bitEndOffset_ - dbmods[i].block);
					}

					this.datablocks[j].bitOffset = QR.bitlenToStrlen(bitEndOffset_);

					this.__encode(this.datablocks[j].encoding, this.datablocks[j].chars, this.datablocks[j].bitOffset, true);

					break;
				case "remove-block": // -------------------------------------- REMOVE BLOCK

					fdb = {

						encoding: "void",
						bitOffset: fdb.bitOffset,
						bitEndOffset: fdb.bitEndOffset
					};

					break;
				case "change-char": // --------------------------------------- CHANGE CHAR

					// UNDONE
					fdb.chars = fbd.chars.slice(0, fdb.textOffset) + fdb.chars + fdb.chars.slice();

					break;
				case "resize-block": // -------------------------------------- RESIZE BLOCK

					if (dbm.textOffset === fdb.textOffset) return;

					if (dbm.textOffset < fdb.textOffset) {

						fdb.chars = " ".repeat(dbm.textOffset, fdb.textOffset) + this.buffer.slice(fdb.textOffset, fdb.textEndOffset);

					} else {

						fdb.chars = this.buffer.slice(dbm.textOffset, fdb.textEndOffset);
					}

					if (dbm.textEndOffset === fdb.textEndOffset) return;

					if (fdb.textOffset < dbm.textOffset) {

						fdb.chars = "".repeat(dbm.textOffset, fdb.textOffset) + this.buffer.slice(fdb.textOffset, fdb.textEndOffset);

					} else {

						fdb.chars = this.buffer.slice(fdb.textOffset, dbm.textEndOffset);
					}

					break;
			}
		}
	}
}

/*
	QR is the mediator between Codewords and
	Datablocks. Also it interact with History module.
	So, it helps to convert and change codewords
	effectively as well as to supplement (pad)
	them with redudancy in order to share them with
	QRMX module.
*/

export default class QR {

	static encodeFormatBits (mask, ecdepth) {

		if (0 > mask && mask > 8)
			throw new Error("Inapropriate mask type was put as an argument into QRt instance. Registered one is " + ecdepth + "\nOnly values from 0 to 7 are allowed!")

		if (0 > ecdepth && ecdepth > 4)
			throw new Error("Inapropriate error correction value was put as an argument into QRt instance. Registered one is " + ecdepth + "\nOnly values from 0 to 3 are allowed!")

		let bits = (ecdepth << 3) + mask;

		bits <<= 10;

		let _num = bits;

		for (let p = 0; Bath.binlen(bits) > 10 && p < 100; p++) {
			bits ^= 0b10100110111 << (bits.toString(2).length - 11);
		}

		bits += _num;
		bits ^= 0b101010000010010;

		return bits;
	}

	constructor (info, dbmods) {

	// INFO OBJECT SETTING UP

		this.info = info;

	// CREATING A CODEWORDS ARRAY AND A DATABLOCKS ARRAY

		/*
		datablock
		vvvvvvvvv
		{
			encoding: "byte" || "windows1251" || "latin2" || "numerical" // ...
			chars: "..."
			block: 4
			bitOffset: 123
			bitEndOffset: 169
			textOffset: 25
			textEndOffset: 31
		}
		{
			encoding: "void",
			bitOffset: 123,
			bitEndOffset: 169
		}
		*/

		this.codewords = new Uint8ClampedArray(this.info.dataBytes);
		this.datablocks = Object.assign(new Datablocks(), {

			bitlenByStrlen (encoding, slen, prefix = false) {

				switch (encoding) {
		
					case "numerical":
		
						return Math.ceil(slen * 3.33333) + (prefix ? this.info.counterref.N + 4 : 0); // since the maximum possible length of numerical string fits 10^5, five digits (3) after the dot is enough
		
					case "alphanumerical":
		
						return Math.round(slen * 5.5) + (prefix ? this.info.counterref.A + 4 : 0);
		
					case "byte": 
		
						return (slen * 8) + (prefix ? this.info.counterref.B + 4 : 0);

					case "latin1": case "latin2": case "windows1251": case "windows1250":

						return (slen * 8) + (prefix ? this.info.counterref.B + 16 : 0)
				}

				return NaN;
			},
		
			strlenByBitlen (encoding, blen, prefix = false) {
		
				if (prefix) switch (encoding) {
		
					case "numerical":

						blen -= this.info.counterref.N + 4;
						break;
					case "alphanumerical":

						blen -= this.info.counterref.A + 4;
						break;
					case "latin1": case "latin2": case "windows1251": case "windows1250":

						blen -= this.info.counterref.B + 16;
						break;
					case "byte":

						blen -= this.info.counterref.B + 4;
				}
		
				switch (encoding) {
		
					case "numerical":
		
						return Math.floor(blen / 3.33333); // since the maximum possible length of numerical string fits 10^5, five digits (3) after the dot is enough
		
					case "alphanumerical":
		
						return Math.floor(blen / 5.5);
		
					case "byte": case "latin1": case "latin2": case "windows1251": case "windows1250":
		
						return Math.floor(blen / 8);
				}
		
				return NaN;
			},

			encode
		});

		this.codewords.bitlen = this.codewords.length * 8;

		this.applyDatablockMods(dbmods);
	}

	__encode (encoding, chars, bitOffset, prefix = false) {

		let i;
		let k = bitOffset % 8,
			c = Math.floor(bitOffset / 8),
			buff = this.codewords[c] >> (8 - k),
			space = this.codewords.bitlen - bitOffset;

	// PREFIX: ECI + MODE BITS

		if (prefix && encoding !== "DEV_binary" && encoding !== "end") {

		// ADDING ECI INDICATOR AND ECI CODE

			switch (encoding) {
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

			// Distribution of the encoded data

			if (k >= 8) {

				k -= 8;
				this.codewords[c++] = buff >> k;
				buff %= 1 << k;

				if (k >= 8) {
					k -= 8;
					this.codewords[c++] = buff >> k;
					buff %= 1 << k;
				}
			}

		// ADDING MODE BITS

			switch (encoding) {

				case "latin1": case "latin2": case "windows1250": case "windows1251": case "byte":

					buff = (buff << 4) + 0b0100;

					k += 4 + counterref.B;
					space -= 4 + counterref.B;
					buff = buff << counterref.B;

					break;
				case "alphanumerical":

					buff = (buff << 4) + 0b0010;

					k += 4 + counterref.A;
					space -= 4 + counterref.A;
					buff = buff << counterref.A;

					break;
				case "numerical":

					buff = (buff << 4) + 0b0001;
					k += 4 + counterref.N;
					space -= 4 + counterref.N;
					buff = buff << counterref.N;

					break;
				case "end":
					buff <<= 4;
					k += 4;
					space -= 4;

					break;
				case "DEV_binary":
					break;
				default:
					// In this switch ALL the encoding types are been checking at first
					throw new Error("Datablocks encoding was interrupted because of: Unknown encoding, you've passed wrong value of an encoding type to the encode() function!");
			}
		}

	// MAXIMUM CHAR CAPACITY CALCULATION

		switch (encoding) {

			case "latin1": case "latin2": case "windows1250": case "windows1251": case "byte": case "end":

				maxCharCapacity = Math.floor(space / 8);

				break;
			case "alphanumerical":

				maxCharCapacity = Math.floor(space / 5.5);

				break;
			case "numerical":

				maxCharCapacity = Math.floor(space / 3.33333); // since the maximum possible length of numerical string fits 10^5, five digits (3) after the dot is enough

				break;
			case "DEV_binary":

				maxCharCapacity = space;
		}

	// PREFIX: ADDING COUNTER AND DISTRIBUTING

		// Whether given string length fits maxCharCapacity

		if (encoding !== "end") {

			if (maxCharCapacity < 0 || chars.length > maxCharCapacity)
				throw new Error("Datablocks encoding was interrupted because of: Codewords overflow, you're trying to encode more blocks than codewords array can contain!");

			if (encoding !== "DEV_binary")
				buff += char.length;
		}

		// Distribution of the encoded data

		if (k >= 8) {

			k -= 8;
			this.codewords[c++] = buff >> k;
			buff %= 1 << k;

			if (k >= 8) {
				k -= 8;
				this.codewords[c++] = buff >> k;
				buff %= 1 << k;
			}
		}

	// ENCODING AND DISTRIBUTION OF CHARACTERS

		switch (encoding) {
			case "latin1": case "byte": // ------------------------------------- LATIN-1 ------------ 8

				for (i = 0; i < charcap; i++) {
					buff = (buff << 8) + chars.charCodeAt(j);
					this.codewords[c++] = buff >> k;
					buff %= 1 << k;
					space -= 8;
				}
				break;
			case "latin2": // -------------------------------------------------- LATIN-2 ------------ 8

				for (i = 0; i < charcap; i++) {
					buff = (buff << 8) + Latin2.codeByChar(chars[i]);
					this.codewords[c++] = buff >> k;
					buff %= 1 << k;
					space -= 8;
				}
				break;
			case "windows1251": // --------------------------------------------- WINDOWS-1251 ------- 8

				for (i = 0; i < charcap; i++) {
					buff = (buff << 8) + Windows1251.codeByChar(chars[i]);
					this.codewords[c++] = buff >> k;
					buff %= 1 << k;
					space -= 8;
				}
				break;
			case "windows1250": // --------------------------------------------- WINDOWS-1250 ------- 8

				for (i = 0; i < charcap; i++) {
					buff = (buff << 8) + Windows1250.codeByChar(chars[i]);
					this.codewords[c++] = buff >> k;
					buff %= 1 << k;
					space -= 8;
				}
				break;
			case "alphanumerical": // ------------------------------------------ ALPHANUM ----------- 11 / 6

				for (i = 0; i < charcap - 1; i += 2) {
					buff = (buff << 11) + (45 * Alphanumerical.codeByChar(chars[i])) + Alphanumerical.codeByChar(chars[i + 1]);
					k += 11;
					space -= 11;

					if (k >= 16) {
						k -= 8;
						this.codewords[c++] = buff >> k;
						buff %= 1 << k;
					}

					k -= 8;
					this.codewords[c++] = buff >> k;
					buff %= 1 << k;
				}

				if (charcap % 2) {
					buff = (buff << 6) + Alphanumerical.codeByChar(chars[i]);
					k += 6;
					space -= 6;
				}
				break;
			case "numerical": // ----------------------------------------------- NUMERICAL ---------- 10 / 7 / 4

				for (i = 0; i < charcap - 2; i += 3) {
					buff = (buff << 10) + parseInt(chars[i] + chars[i + 1] + chars[i + 2]);
					k += 10;
					space -= 10;

					if (k >= 16) {
						k -= 8;
						this.codewords[c++] = buff >> k;
						buff %= 1 << k;
					}

					k -= 8;
					this.codewords[c++] = buff >> k;
					buff %= 1 << k;
				}

				switch (charcap % 3) {
					case 1:
						buff = (buff << 4) + parseInt(chars[i]);
						k += 4;
						space -= 4;
						break;
					case 2:
						buff = (buff << 7) + parseInt(chars[i] + chars[i + 1]);
						k += 7;
						space -= 7;
						break;
				}
				break;
			case "DEV_binary": // ---------------------------------------------- DEV_BINARY --------- 1

				for (i = 0; i < charcap; i++) {
					buff = (buff << 1) + parseInt(chars[i], 2);
					k++;
					space--;

					if (k === 8) {
						this.codewords[c++] = buff;
						buff = 0;
						k -= 8;
					}
				}
		}

	// LEAVING

		if (k >= 8) { // may be true only after encoding alphanum or num only
			k -= 8;
			this.codewords[c++] = buff >> k;
			buff %= 1 << k;
		}

		if (k >= 8)
			throw new Error("Unexpected value of k: " + k);

		this.codewords[c] = (buff << (8 - k)) + (this.codewords % (8 - k));

		return (c * 8) + k;
	}

	/*__move (offset0, offset, target0, cutting = false) {

		if (offset0 - target0 === 0) return;

		const c0 = Math.floor(offset / 8);

		let dk = target0 - offset,
			k = (target - offset0) % 8,
			buff = this.codewords[c_] >> (8 - k);

		for (let c = this.codewords.length - 1; c > c0; c--) {

			buff += this.codewords[c0] << k;
			k += 8;

			this.codewords[c] = buff % 8;
			buff >>= 8;
			k -= 8;
		}

		//    c0       
		// 10101010 11100111 00110010 10011100 01011011 10101001
		// ^^^^^^'' '                                        xxx
		// 10101010 11011100 11100110 01010011 10001011 01110101
		// ^^^^^^'' '                                        xxx
		// 101010bb b1011100 11100110 01010011 10001011 01110101
		// ^^^^^^^^ ^                                           
		// buff: 1011100

		//    c0       
		// 10101010 11100111 00110010 10011100 01011011 10101001
		// ^^^xxx                                               
		// 10110111 11100111 00110010 10011100 01011011 10101001
		// ^^^xxx                                               
		// 10110111 00111001 10010100 11100010 11011101 01001bbb
		// ^^^                                               +++
		// buff: 0011100110010
	}*/

	modifyCodewords () {

	}

	decodeCodewords (cws) {

		// ...
	}

	interleave (cws, g1rows, g2rows, g1cols) {
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

	uninterleave (cws, g1rows, g2rows, g1cols) {
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

	encodeECCodewords (datacws) {
		if (datacws instanceof CodewordArray && datacws.length === this.info.dataBytes)
			throw new Error("..."); // <<<

		const _eccws = new CodewordArray((this.info.g1Blocks + this.info.g2Blocks) * this.info.ecBytesPerBlock);

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

				if (message[i] === 0) continue;

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
				message[j] = datacws[(this.info.g1Blocks * this.info.g1DataBytesPerBlock) + (k * this.info.g2DataBytesPerBlock) + j];
			}

			const _generator = new Uint8Array(message.length); // backup copy
			_generator.set(polyGens[this.info.ecBytesPerBlock], 0); // SUITABLE ONLY FOR 26, 28, 30 EC CODEWORDS PER BLOCK!!!

			let generator; // pows

			for (let i = 0; i < this.info.g2DataBytesPerBlock; i++) {
				const pow = GF256.ip(message[i]);

				generator = new Uint8Array(_generator);

				if (message[i] === 0) continue;

				for (let j = 0; j <= this.info.ecBytesPerBlock; j++) {
					generator[j] = (generator[j] + pow) % 255;
					generator[j] = GF256.pi(generator[j]);
					message[j + i] ^= generator[j];
				}
			}

			_eccws.set(message.slice(this.info.g2DataBytesPerBlock), (this.info.g1Blocks + k) * this.info.ecBytesPerBlock);
		}

		const eccws = new Uint8Array(_eccws.length);

		for (let i = 0; i < _eccws.length; i++) {
			eccws[((i % this.info.ecBytesPerBlock) * (this.info.g1Blocks + this.info.g2Blocks)) + Math.floor(i / this.info.ecBytesPerBlock)] = _eccws[i];
		}

		return eccws;
	}
}

const arr = [];
const len = 256;
const offset = 160;
const target = 24;

for (let i = 0; i < len; i++) {

	_arr[i] = {
		value: Math.round(Math.random() * 255)
	};
}

const _arr = arr;

const elem = arr[offset];
let i;

if (offset < target) {

	for (i = offset; i <= this.datablocks.length; i++) {

		arr[i] = arr[i + 1];
	}
} else {

	for (i = this.datablocks.length; i > target; i--) {

		arr[i] = arr[i - 1];
	}
}

arr[target] = elem;

[0,1,2,3,4,5,6, ,8,9]