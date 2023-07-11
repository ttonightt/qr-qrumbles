
class DBMChars {
	static typingMode = 0;
	static container;
	static swrap;
	static canvas;
	static input;
	static inputMode;
	static posti;
	static _p;
	static p_;
	static letterWidth;
	static letterHeight;

	static init (container, swrap) {
		this.container = container;
		this.swrap = swrap;

		this.container.textContent = "";

		this.letterWidth = this.container.clientWidth;
		this.letterHeight = this.container.clientHeight;
		
		this.container.textContent = "0";

		this.container.oncontextmenu = e => {
			e.preventDefault();
		};

		this.canvas = this.container.previousElementSibling;
		this.ctx = this.canvas.getContext("2d");

		this.canvas.palette = [
			getComputedStyle(this.canvas).backgroundColor,
			getComputedStyle(this.canvas).color,
			getComputedStyle(this.canvas).accentColor
		];

		this.input = document.createElement("input");
		this.input.type = "text";
		this.input.maxLength = 1;
		this.input.size = 1;
		this.input.required = true;
		DBMChars.input.pattern = "^.|\\n|\\r|\\u2028|\\u2029$";

		this.input.selecti = (a = this.input.size, b = a) => {
			this.input.selectionStart = a;
			this.input.selectionEnd = b;
		};

		// this.input.onfocus = () => {
		// 	this.input.focused = true;
		// 	if (!this.inputMode) {
		// 		this.posti.textContent = "";
		// 	}
		// };

		// this.input.onblur = () => {
		// 	this.input.focused = false;
		// 	if (!this.inputMode) {
		// 		this.posti.textContent = this.input.value;
		// 	}
		// };

		// this.input.onmousedown = e => {
		// 	if (DBMChars.typingMode) e.preventDefault();
		// };

		// this.posti = document.createElement("i");
		// this._p = document.createElement("p");
		// this.p_ = document.createElement("p");
	}

	static toggleTypingMode () {
		DBMChars.typingMode ^= 1;
	}

	constructor (data, len, mlen) {
		this.len = len || data.length;

		switch (mlen) {
			case 1: case 2:
				this.mlen = mlen;
				break;
			default:
				throw new Error("Only values 1 or 2 are allowed");
		}

		this.chars = "";

		// vvvv CALCULATIONS vvvv

		this.cols = Math.floor(DBMChars.container.clientWidth / DBMChars.letterWidth);
		this.rows = Math.ceil(this.len / this.cols);

		// vvvv SETTING UP THE DATA vvvv

		if (data instanceof Uint16Array) {
			for (let i = 0; i < this.len; i++) {
				this.chars += String.fromCharCodeS(data[i] || 0x30);
			}
		} else if (typeof data == "string") {
			for (let i = 0; i < this.len; i++) {
				this.chars += data[i];
			}
		}

		// vvvv BOX vvvv

		this.box = DBMChars.container.getBoundingClientRect(); // METHOD IS WORKABLE ONLY WHEN CONTAINER IS SMALLER THAN GRANDPARENT

		const __box = DBMChars.swrap.getBoundingClientRect();

		this.box = {
			x: this.box.x,
			y: this.box.y,
			owidth: __box.width,
			oheight: __box.height,
			sheight: DBMChars.swrap.scrollHeight,
			iwidth: this.box.width,
			iheight: this.box.height,
			left: this.box.left - __box.left,
			right: __box.right - this.box.right,
			top: this.box.top - __box.top,
			bottom: DBMChars.swrap.scrollHeight - this.box.height - this.box.top + __box.top
		};

		// vvvv CONTAINER'S EVENTS vvvv

		DBMChars.container.onmouseleave = () => {
			this.mark(-1);
		};

		DBMChars.container.onmousemove = e => {
			this.mark((Math.floor((e.clientY - this.box.y + DBMChars.swrap.scrollTop) / DBMChars.letterHeight) * this.cols) + Math.floor((e.clientX - this.box.x) / DBMChars.letterWidth), 0, 2);
		};

		DBMChars.container.onmouseup = e => {
			if (e.target === DBMChars.input) return;

			this.relocateInput(
				(Math.floor((e.clientY - this.box.y + DBMChars.swrap.scrollTop) / DBMChars.letterHeight) * this.cols) + Math.floor((e.clientX - this.box.x) / DBMChars.letterWidth),
				false,
				e.button
			);
			DBMChars.input.focus();
			DBMChars.input.selecti(0, DBMChars.input.size);
		};

		// vvvv CANVAS vvvv

		DBMChars.canvas.width = this.cols;
		DBMChars.canvas.height = this.rows;
		DBMChars.canvas.style.width = this.cols * DBMChars.letterWidth + "px"; // ROUND() IN CSS???
		
		this.mi = {i: 0, base: 0};

		DBMChars.ctx.fillStyle = DBMChars.canvas.palette[1];

		for (let i = 0, y = -1; i < this.len; i++) {
			if (i % this.cols === 0) y++;
			if (Math.floor(i / 2) % 2) DBMChars.ctx.fillRect(i % this.cols, y, 1, 1);
		}

		// vvvv INPUT vvvv

		DBMChars.input.value = this.chars[0];

		DBMChars.container.textContent = "";

		DBMChars.container.append(
			DBMChars._p,
			DBMChars.input,
			DBMChars.posti,
			DBMChars.p_
		);

		DBMChars.posti.textContent = DBMChars.input.value;
		DBMChars.p_.textContent = this.getDataToLog(1, this.len);

		this.ci = 0;

		// vvvv EVENTS FOR INPUT vvvv

		let keyDown = 0;

		DBMChars.input.onkeydown = e => {
			keyDown = e.key;

			if (keyDown === "ArrowRight" && DBMChars.input.selectionEnd === DBMChars.input.value.length) {

				this.relocateInput(this.ci + 1, e.ctrlKey);
				DBMChars.input.selecti(0, DBMChars.input.size);
				this.showInput(false);
				e.preventDefault();

			} else if (keyDown === "ArrowLeft" && DBMChars.input.selectionStart === 0) {

				this.relocateInput(this.ci - !e.ctrlKey, e.ctrlKey);
				DBMChars.input.selecti(0, DBMChars.input.size);
				this.showInput(false);
				e.preventDefault();

			} else if (keyDown === "ArrowUp") {

				this.relocateInput(this.ci - this.cols);
				DBMChars.input.selecti(0, DBMChars.input.size);
				this.showInput(false);
				e.preventDefault();

			} else if (keyDown === "ArrowDown") {

				this.relocateInput(this.ci + this.cols);
				DBMChars.input.selecti(0, DBMChars.input.size);
				this.showInput(false);
				e.preventDefault();

			} else if (keyDown === "Escape") {
				DBMChars.input.blur();
			} else if (DBMChars.typingMode && keyDown === "Backspace" && this.ci === 0) {
				e.preventDefault();
			}
		};

		DBMChars.input.oninput = () => {
			this.changeChar(this.ci, DBMChars.input.value, DBMChars.input._value === "");
			DBMChars.input._value = DBMChars.input.value; // КОЛИ БУДЕ ГОТОВА "ІСТОРІЯ ЗМІН" МОЖНА (В ТЕОРІЇ) БУДЕ БРАТИ ПОПЕРЕДНЄ ЗНАЧЕННЯ ЗВІДТИ

			if (DBMChars.inputMode && DBMChars.input.validity.valid) {
				DBMChars.posti.textContent = String.fromCharCode(parseInt(DBMChars.input.value.replace("u", ""), 16));
			}

			if (DBMChars.typingMode) {
				if (keyDown === "Delete") {
					this.relocateInput(this.ci);
				} else if (keyDown === "Backspace") {
					this.relocateInput(this.ci - 1);
				} else {
					this.relocateInput(this.ci + 1);
				}

				DBMChars.input.selecti(0, DBMChars.input.size);
			}
		};
	}

	changeChar (i, char, between = false) {
		if (char == "") {
			this.chars = this.chars.slice(0, i) + this.chars.slice(i + 1, this.len);
			if (this.chars.length < this.len) this.chars += "0";
		} else {
			this.chars = this.chars.slice(0, i) + char + this.chars.slice(i + !between, this.len);
		}
	}

	unmark () {
		if (this.mi.base === 0) return;

		let x, y;
		DBMChars.ctx.fillStyle = DBMChars.canvas.palette[Math.floor(this.mi.i / this.mlen) % this.mlen];

		if (this.mi.base === 1) {
			x = this.mi.i % this.cols;
			y = (this.mi.i - x) / this.cols;
			DBMChars.ctx.fillRect(x, y, 1, 1);
		} else for (let j = this.mi.i; j < this.mi.i + this.mi.base; j++) {
			x = j % this.cols;
			y = (j - x) / this.cols;
			DBMChars.ctx.fillRect(x, y, 1, 1);
		}
		this.mi.base = 0;
	}

	mark (x, y = 0, base) {
		base ||= 1;

		this.unmark();

		DBMChars.ctx.fillStyle = DBMChars.canvas.palette[2];

		const i = Math.floor(Math.min((y * this.cols) + x, this.len) / base) * base;
		this.mi.i = i;
		this.mi.base = base;

		if (base === 1) {
			x = i % this.cols;
			y = (i - x) / this.cols;
			DBMChars.ctx.fillRect(x, y, 1, 1);
		} else for (let j = i; j < i + base; j++) {
			x = j % this.cols;
			y = (j - x) / this.cols;
			DBMChars.ctx.fillRect(x, y, 1, 1);
		}
	}

	relocateInput (i, between = false, mode = false) {
		if (this.ci === i) return;

		DBMChars._p.textContent = "";
		DBMChars.p_.textContent = "";

		this.ci = Math.fitinter(0, i, this.len - 1);

		if (between) {
			this.changeChar(this.ci, "0", true);
			DBMChars.input.value = "0";
		} else {
			DBMChars.input.value = this.getDataToLog(this.ci, this.ci + 1);
		}

		if (DBMChars.inputMode !== mode) {
			DBMChars.inputMode = mode;

			if (mode) {
				DBMChars.input.value = "u" + DBMChars.input.value.charCodeAt(0).toString(16).padStart(4, "0");
				DBMChars.input.size = 5;
				DBMChars.input.maxLength = 5;
				DBMChars.input.classList.add("big");
				DBMChars.input.pattern = "^[uU]{0,1}[0-9a-fA-F]{1,4}$";
			} else {
				DBMChars.input.size = 1;
				DBMChars.input.maxLength = 1;
				DBMChars.input.classList.remove("big");
				DBMChars.input.pattern = "^.|\\n|\\r|\\u2028|\\u2029$";

				DBMChars.posti.textContent = "";
			}
		}

		DBMChars._p.textContent = this.getDataToLog(0, this.ci);
		DBMChars.p_.textContent = this.getDataToLog(this.ci + 1, this.len);
	}

	showInput (type = true) {
		const sy = (Math.floor(this.ci / this.cols) * DBMChars.letterHeight) + this.box.top;

		if (type) {
			DBMChars.swrap.scroll(0,
				sy - Math.round(this.box.oheight / 2) + Math.round(DBMChars.letterHeight / 2)
			);
		} else if (sy + DBMChars.letterHeight > this.box.oheight + DBMChars.swrap.scrollTop) {
			DBMChars.swrap.scroll(0,
				sy - this.box.oheight + DBMChars.letterHeight
			);
		} else if (sy < DBMChars.swrap.scrollTop) {
			DBMChars.swrap.scroll(0,
				sy
			);
		}
	}

	getDataToLog (a = 0, b = this.len, br = " ") {
		if (a == b) return ""/*(((b - 1) % this.cols) ? "" : br)*/; // <<< WASN'T TESTED
		if (b - a == 1) return this.chars[a]/* + ((b % this.cols) ? "" : br)*/;

		let str = "";
		for (let i = a; i < b; i++) {
			if (this.chars[i] == " ") {
				str += "\u00a0";
			} else {
				str += this.chars[i];
			}
			if ((i + 1) % this.cols === 0) str += br;
		}
		return str;
	}
}

class DBMPolygons {
	static container;

	static init (container) {
		this.container = container;
	}

	constructor (chars, datatype, databytes) {
		switch (datatype) {
			// case 7:
			// 	this.dbs = databytes * 8;
			// 	this.dblen = 8;
			// 	break;
			case 0b0100:
				this.dbs = databytes;
				this.dblen = 8;
				break;
			case 0b0010:
				this.dblen = 11;
				this.dbs = databytes * 8;
				if (this.dbs % 11 >= 7) {
					this.dbs = Math.ceil(this.dbs / 11);
				} else {
					this.dbs = Math.floor(this.dbs / 11);
				}
		}

		this.polygons = [];
		let coords = [];
		let _v;
	
		BASE.current.goThroughDataModules((x, y, j, v) => {
			_v = -v;
			if (coords.length >= this.dblen * 2) {
				this.polygons.push(bitCoordsToPolygons(coords, ["upgoing", "downgoing"][(_v + 1) / 2], DBMPolygons.container));
				coords = [];
			}
			coords.push(x);
			coords.push(y);
		}, {
			maxb: QRtable[BASE.current.version][BASE.current.ecdepth].dataBytes * 8,
		});
	
		if (coords.length > 2) {
			this.polygons.push(bitCoordsToPolygons(coords, ["upgoing", "downgoing"][(_v + 1) / 2], DBMPolygons.container));
		}

		coords = [];

		// CHARS

		this.ichars = new DBMChars(chars, this.dbs, 2);
	}
}

function bitCoordsToPolygons (coords, cssClass, parent) {
	let i = 0, t;
	let _coords = structuredClone(coords);

	for (i = 0; i < 2000; i++) {
		t = true;
		for (let j = 0; j < _coords.length - 2; j++) {
			if (_coords[j] < _coords[j + 2]) {
				_coords[j] += _coords[j + 2];
				_coords[j + 2] = _coords[j] - _coords[j + 2];
				_coords[j] -= _coords[j + 2];
				t = false;
			}
		}
		if (t) break;
	}

	const 	minx = _coords[_coords.length - 2];
			miny = _coords[_coords.length - 1];
			maxx = _coords[0];
			maxy = _coords[1];

	let map = new Int8Array((maxy - miny + 2) * (maxx - minx + 2)).x2convert(maxx - minx + 2);

	for (i = 0; i < coords.length; i += 2) {
		map.x2set(coords[i] - minx, 	coords[i + 1] - miny, 		1);
		map.x2set(coords[i] - minx + 1, coords[i + 1] - miny, 		1);
		map.x2set(coords[i] - minx, 	coords[i + 1] - miny + 1, 	1);
		map.x2set(coords[i] - minx + 1, coords[i + 1] - miny + 1, 	1);
	}

	let polygons = [];
	t = true;

	for (i = 0; t && i < 10; i++) {
		t = false;

		let points = [];
		let x = 0, y = map.rows - 1, vec = [0, -1];
		let _x = 0, _y = 0;
		let p = 0, _p = p;
		let rn = 0;
	
		do {
			if (points.length == 0) {
				if (map.x2get(x, y) == 1 && map.x2getD(x + 1, y, 0) != 2 && map.x2getD(x, y + 1, 0) != 2 && map.x2getD(x - 1, y, 0) != 2 && map.x2getD(x, y - 1, 0) != 2) {
					t = true;
					_x = x;
					_y = y;
					_p = p;
				} else {
					if (y == 1 && x < map.columns - 1) {
						y = map.rows - 1;
						x++;
					} else {
						y--;
					}
					continue;
				}
			}
	
			if (map.x2getD(x + vec[1], y - vec[0]) >= 1) {	// TURNING LEFT
				vec = [vec[1], -vec[0]];
				rn = 0;
			}
	
			if (map.x2getD(x + vec[0], y + vec[1]) >= 1) {	// IF MOVING IS POSSIBLE
				x += vec[0];
				y += vec[1];
				map.x2set(x, y, 2);
				if (rn++ > 0) {
					points[points.length - 2] = x + minx;
					points[points.length - 1] = y + miny;
				} else {
					points.push(x + minx);
					points.push(y + miny);
				}
			} else {										// TURNING RIGHT
				vec = [-vec[1], vec[0]];
				x += vec[0];
				y += vec[1];
				map.x2set(x, y, 2);
				points.push(x + minx);
				points.push(y + miny);
				rn++;
			}
		} while (!(x == _x && y == _y && p - _p > 1) && ++p < 200);

		if (points.length > 1) {
			polygons.push(points);
		}
	}

	let elem;
	
	if (polygons.length > 1) {
		elem = document.createElementNS("http://www.w3.org/2000/svg", "g");
		parent.appendChild(elem);
		
		for (i = polygons.length - 1; i >= 0; i--) {
			SVGPolygonElement.create(polygons[i], elem);
		}
	} else {
		elem = SVGPolygonElement.create(polygons[0], parent);
	}

	elem.classList.add(cssClass);

	return elem;
}