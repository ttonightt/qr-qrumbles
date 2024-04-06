"use strict";

export const GF256 = {
	__refTableIntToPow: new Uint8Array([-1, 0, 1, 25, 2, 50, 26, 198, 3, 223, 51, 238, 27, 104, 199, 75, 4, 100, 224, 14, 52, 141, 239, 129, 28, 193, 105, 248, 200, 8, 76, 113, 5, 138, 101, 47, 225, 36, 15, 33, 53, 147, 142, 218, 240, 18, 130, 69, 29, 181, 194, 125, 106, 39, 249, 185, 201, 154, 9, 120, 77, 228, 114, 166, 6, 191, 139, 98, 102, 221, 48, 253, 226, 152, 37, 179, 16, 145, 34, 136, 54, 208, 148, 206, 143, 150, 219, 189, 241, 210, 19, 92, 131, 56, 70, 64, 30, 66, 182, 163, 195, 72, 126, 110, 107, 58, 40, 84, 250, 133, 186, 61, 202, 94, 155, 159, 10, 21, 121, 43, 78, 212, 229, 172, 115, 243, 167, 87, 7, 112, 192, 247, 140, 128, 99, 13, 103, 74, 222, 237, 49, 197, 254, 24, 227, 165, 153, 119, 38, 184, 180, 124, 17, 68, 146, 217, 35, 32, 137, 46, 55, 63, 209, 91, 149, 188, 207, 205, 144, 135, 151, 178, 220, 252, 190, 97, 242, 86, 211, 171, 20, 42, 93, 158, 132, 60, 57, 83, 71, 109, 65, 162, 31, 45, 67, 216, 183, 123, 164, 118, 196, 23, 73, 236, 127, 12, 111, 246, 108, 161, 59, 82, 41, 157, 85, 170, 251, 96, 134, 177, 187, 204, 62, 90, 203, 89, 95, 176, 156, 169, 160, 81, 11, 245, 22, 235, 122, 117, 44, 215, 79, 174, 213, 233, 230, 231, 173, 232, 116, 214, 244, 234, 168, 80, 88, 175]),
	__refTablePowToInt: new Uint8Array([1, 2, 4, 8, 16, 32, 64, 128, 29, 58, 116, 232, 205, 135, 19, 38, 76, 152, 45, 90, 180, 117, 234, 201, 143, 3, 6, 12, 24, 48, 96, 192, 157, 39, 78, 156, 37, 74, 148, 53, 106, 212, 181, 119, 238, 193, 159, 35, 70, 140, 5, 10, 20, 40, 80, 160, 93, 186, 105, 210, 185, 111, 222, 161, 95, 190, 97, 194, 153, 47, 94, 188, 101, 202, 137, 15, 30, 60, 120, 240, 253, 231, 211, 187, 107, 214, 177, 127, 254, 225, 223, 163, 91, 182, 113, 226, 217, 175, 67, 134, 17, 34, 68, 136, 13, 26, 52, 104, 208, 189, 103, 206, 129, 31, 62, 124, 248, 237, 199, 147, 59, 118, 236, 197, 151, 51, 102, 204, 133, 23, 46, 92, 184, 109, 218, 169, 79, 158, 33, 66, 132, 21, 42, 84, 168, 77, 154, 41, 82, 164, 85, 170, 73, 146, 57, 114, 228, 213, 183, 115, 230, 209, 191, 99, 198, 145, 63, 126, 252, 229, 215, 179, 123, 246, 241, 255, 227, 219, 171, 75, 150, 49, 98, 196, 149, 55, 110, 220, 165, 87, 174, 65, 130, 25, 50, 100, 200, 141, 7, 14, 28, 56, 112, 224, 221, 167, 83, 166, 81, 162, 89, 178, 121, 242, 249, 239, 195, 155, 43, 86, 172, 69, 138, 9, 18, 36, 72, 144, 61, 122, 244, 245, 247, 243, 251, 235, 203, 139, 11, 22, 44, 88, 176, 125, 250, 233, 207, 131, 27, 54, 108, 216, 173, 71, 142, 1]),

	ip (int) {
		return GF256.__refTableIntToPow[int % 256];
	},

	pi (pow) {
		return GF256.__refTablePowToInt[pow % 256];
	}
};

export const polyGens = {
	26: new Uint8Array([0, 173, 125, 158, 2, 103, 182, 118, 17, 145, 201, 111, 28, 165, 53, 161, 21, 245, 142, 13, 102, 48, 227, 153, 145, 218, 70]),
	28: new Uint8Array([0, 168, 223, 200, 104, 224, 234, 108, 180, 110, 190, 195, 147, 205, 27, 232, 201, 21, 43, 245, 87, 42, 195, 212, 119, 242, 37, 9, 123]),
	30: new Uint8Array([0, 41, 173, 145, 152, 216, 31, 179, 182, 50, 48, 110, 86, 239, 96, 222, 125, 42, 173, 226, 193, 224, 130, 156, 37, 251, 216, 238, 40, 192, 180])
};

export class QRTable {

	static charCounterLength = [
		{Numerical: 10, Alphanumerical:  9, Byte:  8}, // 1 - 9
		{Numerical: 12, Alphanumerical: 11, Byte: 16}, // 10 - 26
		{Numerical: 14, Alphanumerical: 13, Byte: 16}, // 27 - 40
	];

	static codewordsInfo = {
		20: {
			1: {
				dataBytes: 861,
				errorCorrectionBytesPerBlock: 28,
				errorCorrectionBytes: 224,
				g1Blocks: 3,
				g1DataBytesPerBlock: 107,
				g2Blocks: 5,
				g2DataBytesPerBlock: 108
			},
			0: {
				dataBytes: 669,
				errorCorrectionBytesPerBlock: 26,
				errorCorrectionBytes: 416,
				g1Blocks: 3,
				g1DataBytesPerBlock: 41,
				g2Blocks: 13,
				g2DataBytesPerBlock: 42
			},
			3: {
				dataBytes: 485,
				errorCorrectionBytesPerBlock: 30,
				errorCorrectionBytes: 600,
				g1Blocks: 15,
				g1DataBytesPerBlock: 24,
				g2Blocks: 5,
				g2DataBytesPerBlock: 25
			},
			2: {
				dataBytes: 385,
				errorCorrectionBytesPerBlock: 28,
				errorCorrectionBytes: 700,
				g1Blocks: 15,
				g1DataBytesPerBlock: 15,
				g2Blocks: 10,
				g2DataBytesPerBlock: 16
			}
		},
		27: {
			1: {
				dataBytes: 1468,
				errorCorrectionBytesPerBlock: 30,
				errorCorrectionBytes: 360,
				g1Blocks: 8,
				g1DataBytesPerBlock: 122,
				g2Blocks: 4,
				g2DataBytesPerBlock: 123
			},
			0: {
				dataBytes: 1128,
				errorCorrectionBytesPerBlock: 28,
				errorCorrectionBytes: 700,
				g1Blocks: 22,
				g1DataBytesPerBlock: 45,
				g2Blocks: 3,
				g2DataBytesPerBlock: 46
			},
			3: {
				dataBytes: 808,
				errorCorrectionBytesPerBlock: 30,
				errorCorrectionBytes: 1020,
				g1Blocks: 8,
				g1DataBytesPerBlock: 23,
				g2Blocks: 26,
				g2DataBytesPerBlock: 24
			},
			2: {
				dataBytes: 628,
				errorCorrectionBytesPerBlock: 30,
				errorCorrectionBytes: 1200,
				g1Blocks: 12,
				g1DataBytesPerBlock: 15,
				g2Blocks: 28,
				g2DataBytesPerBlock: 16
			}
		},
		34: {
			1: {
				dataBytes: 2191,
				errorCorrectionBytesPerBlock: 30,
				errorCorrectionBytes: 570,
				g1Blocks: 13,
				g1DataBytesPerBlock: 115,
				g2Blocks: 6,
				g2DataBytesPerBlock: 116
			},
			0: {
				dataBytes: 1725,
				errorCorrectionBytesPerBlock: 28,
				errorCorrectionBytes: 1036,
				g1Blocks: 14,
				g1DataBytesPerBlock: 46,
				g2Blocks: 23,
				g2DataBytesPerBlock: 47
			},
			3: {
				dataBytes: 1231,
				errorCorrectionBytesPerBlock: 30,
				errorCorrectionBytes: 1530,
				g1Blocks: 44,
				g1DataBytesPerBlock: 24,
				g2Blocks: 7,
				g2DataBytesPerBlock: 25
			},
			2: {
				dataBytes: 961,
				errorCorrectionBytesPerBlock: 30,
				errorCorrectionBytes: 1800,
				g1Blocks: 59,
				g1DataBytesPerBlock: 16,
				g2Blocks: 1,
				g2DataBytesPerBlock: 17
			}
		},
		40: {
			1: {
				dataBytes: 2956,
				errorCorrectionBytesPerBlock: 30,
				errorCorrectionBytes: 750,
				g1Blocks: 19,
				g1DataBytesPerBlock: 118,
				g2Blocks: 6,
				g2DataBytesPerBlock: 119
			},
			0: {
				dataBytes: 2334,
				errorCorrectionBytesPerBlock: 28,
				errorCorrectionBytes: 1372,
				g1Blocks: 18,
				g1DataBytesPerBlock: 47,
				g2Blocks: 31,
				g2DataBytesPerBlock: 48
			},
			3: {
				dataBytes: 1666,
				errorCorrectionBytesPerBlock: 30,
				errorCorrectionBytes: 2040,
				g1Blocks: 34,
				g1DataBytesPerBlock: 24,
				g2Blocks: 34,
				g2DataBytesPerBlock: 25
			},
			2: {
				dataBytes: 1276,
				errorCorrectionBytesPerBlock: 30,
				errorCorrectionBytes: 2430,
				g1Blocks: 20,
				g1DataBytesPerBlock: 15,
				g2Blocks: 61,
				g2DataBytesPerBlock: 16
			}
		}
	};

	constructor ({version, errorCorrectionDepth}) {

		// VERSION

		switch (parseInt(version)) {
			case 20: case 27: case 34: case 40:

				this.version = version;
				break;
			default:
				throw new Error("..."); // <<<
		}

		// ERROR CORRECTION DEPTH

		switch (parseInt(errorCorrectionDepth, 27)) {
			case 21: case 7: case 1:
				this.errorCorrectionDepth = 1;
				break;
			case 22: case 15: case 0:
				this.errorCorrectionDepth = 0;
				break;
			case 26: case 25: case 3:
				this.errorCorrectionDepth = 3;
				break;
			case 17: case 30: case 2:
				this.errorCorrectionDepth = 2;
				break;
			default:
				throw new Error("One of argument's property has inappropriate value!");
		}

		// CODEWORDS INFORMATION

		Object.assign(this, QRTable.codewordsInfo[this.version][this.errorCorrectionDepth]);

		// CHAR COUNTER LENGTH

		if (version > 26) {
			this.charCounterLength = QRTable.charCounterLength[2];
		} else if (version > 9) {
			this.charCounterLength = QRTable.charCounterLength[1];
		} else {
			this.charCounterLength = QRTable.charCounterLength[0];
		}

		// MODULES

		this.modules = (version * 4) + 17;

		// ALIGNMENT PATTERNS INTERVALS

		let i;

		const sbss = new Uint8Array(Math.floor(this.version / 7) + 1);
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

		this.alignmentPatternIntervals = sbss;
	}
}