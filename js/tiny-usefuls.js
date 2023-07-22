console.logb = function (bnum, pad = 0) {
	bnum = bnum.toString(2);

	if (pad > bnum.length) {
		bnum = bnum.padStart(pad, "0");
	}

	console.log(bnum);
};

Math.hammingDistance = (a, b) => {
	if (a === b) return 0;

	a ^= b;
	b = 0;

	while (a > 0) {
		if (a % 2) {
			b++;
		}

		a >>= 1;
	}

	return b;
};

Math.fitinter = function (min, x, max) {
	return Math.max(Math.min(x, max), min);
}

Math.binlen = function (bx) {
	if (bx === 0) return 0;
	return Math.floor(Math.log2(bx)) + 1;
}

const Alphanumerical = {

	fromCharCode (code) {
		switch (code) {
			case 0:
				return "0";
			case 1:
				return "1";
			case 2:
				return "2";
			case 3:
				return "3";
			case 4:
				return "4";
			case 5:
				return "5";
			case 6:
				return "6";
			case 7:
				return "7";
			case 8:
				return "8";
			case 9:
				return "9";
			case 10:
				return "A";
			case 11:
				return "B";
			case 12:
				return "C";
			case 13:
				return "D";
			case 14:
				return "E";
			case 15:
				return "F";
			case 16:
				return "G";
			case 17:
				return "H";
			case 18:
				return "I";
			case 19:
				return "J";
			case 20:
				return "K";
			case 21:
				return "L";
			case 22:
				return "M";
			case 23:
				return "N";
			case 24:
				return "O";
			case 25:
				return "P";
			case 26:
				return "Q";
			case 27:
				return "R";
			case 28:
				return "S";
			case 29:
				return "T";
			case 30:
				return "U";
			case 31:
				return "V";
			case 32:
				return "W";
			case 33:
				return "X";
			case 34:
				return "Y";
			case 35:
				return "Z";
			case 36:
				return " ";
			case 37:
				return "$";
			case 38:
				return "%";
			case 39:
				return "*";
			case 40:
				return "+";
			case 41:
				return "-";
			case 42:
				return ".";
			case 43:
				return "/";
			case 44:
				return ":";
			default:
				throw new Error("Code of alphanumerical char cannot be greater that 44");
		}
	},

	charCode (char) {
		switch (char[0]) {
			case "0":
				return 0;
			case "1":
				return 1;
			case "2":
				return 2;
			case "3":
				return 3;
			case "4":
				return 4;
			case "5":
				return 5;
			case "6":
				return 6;
			case "7":
				return 7;
			case "8":
				return 8;
			case "9":
				return 9;
			case "A":
				return 10;
			case "B":
				return 11;
			case "C":
				return 12;
			case "D":
				return 13;
			case "E":
				return 14;
			case "F":
				return 15;
			case "G":
				return 16;
			case "H":
				return 17;
			case "I":
				return 18;
			case "J":
				return 19;
			case "K":
				return 20;
			case "L":
				return 21;
			case "M":
				return 22;
			case "N":
				return 23;
			case "O":
				return 24;
			case "P":
				return 25;
			case "Q":
				return 26;
			case "R":
				return 27;
			case "S":
				return 28;
			case "T":
				return 29;
			case "U":
				return 30;
			case "V":
				return 31;
			case "W":
				return 32;
			case "X":
				return 33;
			case "Y":
				return 34;
			case "Z":
				return 35;
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
				throw new Error("Only following chars can be converted into code: \"0-9A-Z $%*+-./:\"");
		}
	}
}

String.fromCharCodeS = function (code) {
	if ((0 <= code && code <= 0x1f) || (0x7f <= code && code <= 0x9f)) {
		code = 0xfffd;
	}
	return String.fromCharCode(code);
}

String.prototype.decodeAsAN2 = function () { // MUST BE INTAGRATED INTO QR CLASS !!!!!!!!!!!
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

String.prototype.decodeAsASCII2 = function () { // MUST BE INTAGRATED INTO QR CLASS !!!!!!!!!!!
	let _res, res = "";

	for (let i = 0; i < this.length; i++) {
		_res = this[i].charCodeAt(0).toString(2);
		res += ("0".repeat(8 - (_res.length % 8))) + _res;
	}

	return res;
}

// DATATYPES vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv



// ARRAYS vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

Object.defineProperty(Array.prototype, "last", {
	configurable: true,

	get () {
		return this[this.length - 1];
	},

	set (data) {
		this[this.length - 1] = data;
	}
});

Int8Array.prototype.x2convert = function (cols) {
	this.rows = Math.ceil(this.length / cols);
	this.columns = cols;
	this.x2get = function (x = 0, y = 0) {
		return this[(y * this.columns) + x];
	};
	this.x2getDF = function (x = 0, y = 0, wrong) {
		const adr = (y * this.columns) + x;
		if (0 <= adr && adr < this.length) {
			return this[adr];
		} else {
			return wrong;
		}
	};
	this.x2getD = function (x = 0, y = 0, wrong) {
		if (0 <= x && x < this.columns && 0 <= y && y < this.rows) {
			return this[(y * this.columns) + x];
		} else {
			return wrong;
		}
	};
	this.x2set = function (x = 0, y = 0, int) {
		this[(y * this.columns) + x] = int;
	};
	return this;
}

Uint8Array.prototype.x2convert = Int8Array.prototype.x2convert;
Uint16Array.prototype.x2convert = Int8Array.prototype.x2convert;

Uint16Array.prototype.inject = function (_i, arr) {
	for (let i = 0; i < arr.length; i++) {
		this[_i + i] = arr[i];
	}
	return this;
}

function setCSSvar (name, value) { // ???????????????????????????????????????
	console.log("setting");
	document.documentElement.style.setProperty(name, value);
}

function getCSSvar (name) { // ???????????????????????????????????
	return document.documentElement.style.getPropertyValue(name);
}

window.deselect = () => {
	window.getSelection().removeAllRanges();
};

SVGPolygonElement.create = (points) => {
	const elem = document.createElementNS("http://www.w3.org/2000/svg", "polygon");

	let str = "";
	for (let i = 0; i < points.length; i += 2) {
		str += points[i] + "," + points[i + 1] + " ";
	}

	elem.setAttribute("points", str);

	return elem;
};

function lineWidthCompensator (w, angle) {
	return w * (1 + Math.abs(0.33 * Math.sin(angle * 2)));
}

// ONETITLE vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

const OneTitle = {
	elem: document.getElementById("onetitle"),
	content: document.querySelector("#onetitle > span"),
	shown: 0,
	pivot: 0,
	__timer: 0,
	show: (x, y, message, prefs = {}) => {
		OneTitle.pivot = prefs.pivot || OneTitle.pivot;
		const anim = prefs.anim || "blink";
		const timeOut = prefs.timeOut || 0;

		OneTitle.elem.setAttribute("data-anim", anim);
		if (message) OneTitle.content.textContent = message;
		OneTitle.elem.classList.add("visible");

		if (typeof x === "number" && typeof y === "number") {
			OneTitle.elem.style.left = x - (Math.floor(OneTitle.pivot / 3) * OneTitle.elem.clientWidth / 2) + "px";
			OneTitle.elem.style.top = y - ((OneTitle.pivot % 3) * OneTitle.elem.clientHeight / 2) + "px";
		}

		if (OneTitle.__timer) {
			clearTimeout(OneTitle.__timer);
		}

		if (parseInt(timeOut, 10) > 50) {
			OneTitle.__timer = setTimeout(() => {
				OneTitle.hide();
			}, timeOut);
			return;
		}

		OneTitle.shown = 1;
	},
	move: (x, y) => {
		OneTitle.elem.style.left = x - (Math.floor(OneTitle.pivot / 3) * OneTitle.elem.clientWidth / 2) + "px";
		OneTitle.elem.style.top = y - ((OneTitle.pivot % 3) * OneTitle.elem.clientHeight / 2) + "px";
	},
	log: message => {
		OneTitle.content.textContent = message;
	},
	hide: () => {
		OneTitle.elem.classList.remove("visible");
		OneTitle.shown = 0;
	},
};

// POPUPS vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

const popupElements = document.querySelectorAll("#popups .popup");
let popupBindings = {};

const popupCallers = document.querySelectorAll(".call-popup");

for (let i = 0; i < popupElements.length; i++) {
	popupElements[i].popen = () => {
		popupElements[i].classList.add("active");
		popupElements[0].parentElement.classList.add("visible");
	};

	popupBindings[popupElements[i].getAttribute("data-popup").replaceAll("-", "")] = popupElements[i];
	popupElements[i].querySelector("i#this-close").addEventListener("click", () => {
		popupElements[i].classList.remove("active");
		popupElements[0].parentElement.classList.remove("visible");
	});
}

for (let i = 0; i < popupCallers.length; i++) {
	const caller = popupCallers[i];
	caller.addEventListener("click", () => {
		popupBindings[caller.getAttribute("data-popup").replaceAll("-", "")].classList.add("active");
		popupElements[0].parentElement.classList.add("visible");
	});
}