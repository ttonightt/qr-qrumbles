console.logb = function (bnum) {
	console.log(parseInt(bnum.toString(2), 10));
};

Math.fitinter = function (min, x, max) {
	return Math.max(Math.min(x, max), min);
}

Math.binlen = function (bx) {
	if (bx == 0) return 0;
	if (bx < 0) throw new Error("Inapropriate argument was putted into Math.binlen(): the argument is a negative number");
	return Math.floor(Math.log2(bx)) + 1;
}

Number.prototype.interval = function (a, b) {
	return a <= this && this <= b;
}

function charToInt45 (char) {
	switch (char) {
		case " ":
			return 36;
		case "$":
			return 37;
		case "%":
			return 38;
		case "*":
			return 39;
		case "+":
			return 40;
		case "-":
			return 41;
		case ".":
			return 42;
		case "/":
			return 43;
		case ":":
			return 44;
		default:
			return parseInt(char, 36);
	}
}

String.prototype.decodeAsAN2 = function () {
	let res = 0n, _res = "";
	let leadingZeroes = 0;

	for (let i = 0; i < this.length - (this.length % 2); i += 2) {
		res += BigInt((45 * charToInt45(this[i])) + charToInt45(this[i + 1] || 0));
		res <<= 11n;

		if (i ==0) {
			leadingZeroes = 11 - (res.toString(2).length % 11);
		}
	}

	if (this.length % 2) {
		_res += "0".repeat(leadingZeroes);

		res >>= 5n;
		res += BigInt(charToInt45(this[this.length - 1] || 0));
	} else {
		res >>= 11n;
	}

	_res += res.toString(2);

	return _res;
}

String.prototype.decodeAsASCII2 = function () {
	let _res, res = "";

	for (let i = 0; i < this.length; i++) {
		_res = this[i].charCodeAt(0).toString(2);
		res += ("0".repeat(8 - (_res.length % 8))) + _res;
	}

	return res;
}

Uint16Array.prototype.inject = function (_i, arr) {
	for (let i = 0; i < arr.length; i++) {
		this[_i + i] = arr[i];
	}
	return this;
}

function getGeneratorPolynomial (len) {
	// let apows = ;
	// return 
}