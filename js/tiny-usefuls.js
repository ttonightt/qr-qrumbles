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

// ARRAYS vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

Int8Array.prototype.x2convert = function (cols) {
	this.rows = Math.ceil(this.length / cols);
	this.columns = cols;
	return this;
}

Uint16Array.prototype.x2convert = Int8Array.prototype.x2convert;

Int8Array.prototype.x2get = function (x = 0, y = 0) {
	return this[(y * this.columns) + x];
}

Uint16Array.prototype.x2get = Int8Array.prototype.x2get;

Int8Array.prototype.x2getDF = function (x = 0, y = 0, wrong) {
	const adr = (y * this.columns) + x;
	if (0 <= adr && adr < this.length) {
		return this[adr];
	} else {
		return wrong;
	}
}

Uint16Array.prototype.x2getDF = Int8Array.prototype.x2getDF;

Int8Array.prototype.x2getD = function (x = 0, y = 0, wrong) {
	if (0 <= x && x < this.columns && 0 <= y && y < this.rows) {
		return this[(y * this.columns) + x];
	} else {
		return wrong;
	}
}

Uint16Array.prototype.x2getD = Int8Array.prototype.x2getD;

Int8Array.prototype.x2set = function (x = 0, y = 0, int) {
	this[(y * this.columns) + x] = int;
}

Uint16Array.prototype.x2set = Int8Array.prototype.x2set;

Uint16Array.prototype.inject = function (_i, arr) {
	for (let i = 0; i < arr.length; i++) {
		this[_i + i] = arr[i];
	}
	return this;
}

function setCSSvar (name, value) {
	console.log("setting");
	document.documentElement.style.setProperty(name, value);
}

function getCSSvar (name) {
	return document.documentElement.style.getPropertyValue(name);
}

function createPolygon (points, parent) {
	const elem = document.createElementNS("http://www.w3.org/2000/svg", "polygon");

	let str = "";
	for (let i = 0; i < points.length; i += 2) {
		str += points[i] + "," + points[i + 1] + " ";
	}

	elem.setAttribute("points", str);
	parent.appendChild(elem);

	return elem;
}

// ONETITLE vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

const OneTitle = {
	elem: document.getElementById("onetitle"),
	content: document.querySelector("#onetitle > span"),
	shown: 0,
	_pivot: 0,
	show: (message, anim, x, y, pivot = OneTitle._pivot) => {
		OneTitle.elem.setAttribute("data-anim", anim);
		OneTitle.content.textContent = message;
		OneTitle.elem.classList.add("visible");

		OneTitle._pivot = pivot;
		if (typeof x == "number" && typeof y == "number") {
			OneTitle.elem.style.left = x + "px";
			OneTitle.elem.style.top = parseInt(y - ((pivot % 3) * OneTitle.elem.clientHeight / 2)) + "px";
		}
		OneTitle.shown = 1;
	},
	move: (x, y) => {
		OneTitle.elem.style.left = x + "px";
		OneTitle.elem.style.top = parseInt(y - ((pivot % 3) * OneTitle.elem.clientHeight / 2)) + "px";
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

String.fromCharCodeS = code => {
	if ((0 <= code && code <= 0x1f) || (0x7f <= code && code <= 0x9f)) {
		code = 0xfffd;
	}
	return String.fromCharCode(code);
};