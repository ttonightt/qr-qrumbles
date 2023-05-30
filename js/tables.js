let GF256 = {
    _refTableIntToPow: new Int16Array(256),
    _refTablePowToInt: new Int16Array(256),
    ip: int => {
        return GF256._refTableIntToPow[int % 256];
    },
    pi: pow => {
        return GF256._refTablePowToInt[pow % 256];
    }
};

GF256._refTableIntToPow[0] = -1;
GF256._refTablePowToInt[0] = 1;

for (let i = 1; i < 256; i++) {
	GF256._refTablePowToInt[i] = GF256._refTablePowToInt[i - 1] * 2;
	if (GF256._refTablePowToInt[i] >= 256) {
		GF256._refTablePowToInt[i] ^= 285;
	}
	GF256._refTableIntToPow[GF256._refTablePowToInt[i]] = i;
}

GF256._refTableIntToPow[1] = 0;

const polynomialsGens = {
    "10": new Uint16Array([0, 251, 67, 46, 61, 118, 70, 64, 94, 32, 45]),
    "30": new Uint16Array([0, 41, 173, 145, 152, 216, 31, 179, 182, 50, 48, 110, 86, 239, 96, 222, 125, 42, 173, 226, 193, 224, 130, 156, 37, 251, 216, 238, 40, 192, 180]),
};

const QRtable = {
    "20": {
        alignmentRectsGap: [28, 28],
        L: {
            dataBytes: 861,
            ecBytes: 28,
            g1Blocks: 3,
            g1BytesPerBlock: 107,
            g2Blocks: 5,
            g2BytesPerBlock: 108
        },
        M: {
            dataBytes: 669,
            ecBytes: 26,
            g1Blocks: 3,
            g1BytesPerBlock: 41,
            g2Blocks: 13,
            g2BytesPerBlock: 42
        },
        Q: {
            dataBytes: 485,
            ecBytes: 30,
            g1Blocks: 15,
            g1BytesPerBlock: 24,
            g2Blocks: 5,
            g2BytesPerBlock: 25
        },
        H: {
            dataBytes: 385,
            ecBytes: 28,
            g1Blocks: 15,
            g1BytesPerBlock: 15,
            g2Blocks: 10,
            g2BytesPerBlock: 16
        }
    },

    "27": {
        alignmentRectsGap: [28, 28],
        L: {
            dataBytes: 1468,
            ecBytes: 30,
            g1Blocks: 8,
            g1BytesPerBlock: 122,
            g2Blocks: 4,
            g2BytesPerBlock: 123
        },
        M: {
            dataBytes: 1128,
            ecBytes: 28,
            g1Blocks: 22,
            g1BytesPerBlock: 45,
            g2Blocks: 3,
            g2BytesPerBlock: 46
        },
        Q: {
            dataBytes: 808,
            ecBytes: 30,
            g1Blocks: 8,
            g1BytesPerBlock: 23,
            g2Blocks: 26,
            g2BytesPerBlock: 24
        },
        H: {
            dataBytes: 628,
            ecBytes: 30,
            g1Blocks: 12,
            g1BytesPerBlock: 15,
            g2Blocks: 28,
            g2BytesPerBlock: 16
        }
    },

    "34": {
        alignmentRectsGap: [28, 28],
        L: {
            dataBytes: 2191,
            ecBytes: 30,
            g1Blocks: 13,
            g1BytesPerBlock: 115,
            g2Blocks: 6,
            g2BytesPerBlock: 116
        },
        M: {
            dataBytes: 1725,
            ecBytes: 28,
            g1Blocks: 14,
            g1BytesPerBlock: 46,
            g2Blocks: 23,
            g2BytesPerBlock: 47
        },
        Q: {
            dataBytes: 1231,
            ecBytes: 30,
            g1Blocks: 44,
            g1BytesPerBlock: 24,
            g2Blocks: 7,
            g2BytesPerBlock: 25
        },
        H: {
            dataBytes: 961,
            ecBytes: 30,
            g1Blocks: 59,
            g1BytesPerBlock: 16,
            g2Blocks: 1,
            g2BytesPerBlock: 17
        }
    },

    "40": {
        alignmentRectsGap: [24, 28],
        L: {
            dataBytes: 2956,
            ecBytes: 30,
            g1Blocks: 19,
            g1BytesPerBlock: 118,
            g2Blocks: 6,
            g2BytesPerBlock: 119
        },
        M: {
            dataBytes: 2334,
            ecBytes: 28,
            g1Blocks: 18,
            g1BytesPerBlock: 47,
            g2Blocks: 31,
            g2BytesPerBlock: 48
        },
        Q: {
            dataBytes: 1666,
            ecBytes: 30,
            g1Blocks: 34,
            g1BytesPerBlock: 24,
            g2Blocks: 34,
            g2BytesPerBlock: 25
        },
        H: {
            dataBytes: 1276,
            ecBytes: 30,
            g1Blocks: 20,
            g1BytesPerBlock: 15,
            g2Blocks: 61,
            g2BytesPerBlock: 16
        }
    }
};