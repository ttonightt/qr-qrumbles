
class InterCharMap {
	static typingMode = 0;

	constructor (data, len, mlen) {
		this.len = len || data.length;

		switch (mlen) {
			case 1: case 2:
				this.mlen = mlen;
				break;
			default:
				throw new Error("Only values 1 or 2 are allowed");
		}

		this.container = DatablockMap.ccontainer;
		this.wrap = this.container.parentElement.parentElement;

		this.chars = "";

		// vvvv CALCULATIONS vvvv

		this.letterWidth = this.container.clientWidth;
		this.letterHeight = this.container.clientHeight;

		this.container.textContent = 0;
		this.container.selectionStart = 0;
		this.container.selectionEnd = 0;

		this.cols = Math.floor(this.container.clientWidth / this.letterWidth);
		this.rows = Math.ceil(this.len / this.cols);

		// vvvv SETTING UP THE DATA vvvv

		if (data) this.loadData(data);

		// vvvv CONTAINER'S EVENTS vvvv

		this.container.oncontextmenu = e => {
			e.preventDefault();
		};

		this.container.onmouseleave = () => {
			this.mark(-1);
		};

		let _i = 0; // ТУТ ПОТЕНЦІЙНИЙ БАГ: ЯКЩО ЯКИМСЬ ЧИНОМ ЛКМ БУДЕ ПІДНЯТА РАНІШЕ ЗА НАТИСКАННЯ ТО СИСТЕМА НЕ СПРАЦЮЄ

		this.container.onmousedown = e => {
			_i = (Math.floor((e.clientY - this.box.y + this.wrap.scrollTop) / this.letterHeight) * this.cols) + Math.round((e.clientX - this.box.x) / this.letterWidth);
		};

		this.container.onmousemove = e => {
			this.mark((Math.floor((e.clientY - this.box.y + this.wrap.scrollTop) / this.letterHeight) * this.cols) + Math.floor((e.clientX - this.box.x) / this.letterWidth), 0, 2);
		};

		this.container.onmouseup = e => {
			const rx = Math.floor((e.clientY - this.box.y + this.wrap.scrollTop) / this.letterHeight) * this.cols;
			const x = (e.clientX - this.box.x) / this.letterWidth;

			if (rx + Math.round(x) === _i) {
				if (e.target === this.input) return;

				this.relocateInput(rx + Math.floor(x));

				this.input.focus();
				this.input.selecti(0, this.input.size);
			} else {
				if (_i > rx + Math.round(x)) {
					console.log(this.getDataToLog(rx + Math.round(x), _i));
					this.container.selectionStart = rx + Math.round(x);
					this.container.selectionEnd = _i;
				} else {
					console.log(this.getDataToLog(_i, rx + Math.round(x)));
					this.container.selectionStart = _i;
					this.container.selectionEnd = rx + Math.round(x);
				}
			}
		};

		document.addEventListener("keydown", e => {
			if ((e.key === "Backspace" || e.key === "Delete") && this.container.selectionStart !== this.container.selectionEnd) {
				this.chars = this.chars.slice(0, this.container.selectionStart) + this.chars.slice(this.container.selectionEnd, this.len);
				this.relocateInput(2);
				window.deselect();
			}
		});

		// vvvv CANVAS vvvv

		this.canvas = this.container.previousElementSibling;
		this.ctx = this.canvas.getContext("2d");
		
		this.mi = {i: 0, base: 0};

		this.canvas.width = this.cols;
		this.canvas.height = this.rows;
		this.canvas.style.width = this.cols * this.letterWidth + "px";
		this.canvas.palette = [
			getComputedStyle(this.canvas).backgroundColor,
			getComputedStyle(this.canvas).color,
			getComputedStyle(this.canvas).accentColor
		];

		this.ctx.fillStyle = this.canvas.palette[1];

		for (let i = 0, y = -1; i < this.len; i++) {
			if (i % this.cols === 0) y++;
			if (Math.floor(i / 2) % 2) this.ctx.fillRect(i % this.cols, y, 1, 1);
		}

		// vvvv INPUT N MARKER CREATION vvvv

		this.input = document.createElement("input");
		this.input.type = "text";
		this.input.maxLength = 1;
		this.input.size = 1;
		this.input.value = this.chars[0];
		this.input.required = true;

		this.input.selecti = (a = this.input.size, b = a) => {
			this.input.selectionStart = a;
			this.input.selectionEnd = b;
		};

		this.container.textContent = "";

		this.container.append(
			document.createElement("p"),
			this.input,
			this.input.value,
			document.createElement("p")
		);

		this.input.nextElementSibling.textContent = this.getDataToLog(1, this.len);

		this.inputMode = 0;

		this.ci = 0;

		this.box = this.container.getBoundingClientRect(); // METHOD IS WORKABLE ONLY WHEN CONTAINER IS SMALLER THAN GRANDPARENT

		const __box = this.wrap.getBoundingClientRect();

		this.box = {
			x: this.box.x,
			y: this.box.y,
			owidth: __box.width,
			oheight: __box.height,
			sheight: this.wrap.scrollHeight,
			iwidth: this.box.width,
			iheight: this.box.height,
			left: this.box.left - __box.left,
			right: __box.right - this.box.right,
			top: this.box.top - __box.top,
			bottom: this.wrap.scrollHeight - this.box.height - this.box.top + __box.top
		};

		// vvvv EVENTS FOR INPUT N MARKER vvvv

		this.input.onfocus = () => {
			this.input.focused = true;
			if (this.input.nextSibling.data) {
				this.input.nextSibling.remove();
			}
		};

		this.input.onblur = () => {
			this.input.focused = false;
			this.input.after(this.input.value);
		};

		this.input.onmousedown = e => {
			if (InterCharMap.typingMode) e.preventDefault();
		};

		let keyDown = 0;

		this.input.onkeydown = e => {
			keyDown = e.key;

			if (keyDown === "ArrowRight" && this.input.selectionEnd === 1) {

				this.relocateInput(this.ci + 1, e.ctrlKey);
				this.input.selecti(0, this.input.size);
				this.showInput(true);
				e.preventDefault();

			} else if (keyDown === "ArrowLeft" && this.input.selectionStart === 0) {

				this.relocateInput(this.ci - !e.ctrlKey, e.ctrlKey);
				this.input.selecti(0, this.input.size);
				this.showInput(true);
				e.preventDefault();

			} else if (keyDown === "ArrowUp") {

				this.relocateInput(this.ci - this.cols);
				this.input.selecti(0, this.input.size);
				this.showInput(true);
				e.preventDefault();

			} else if (keyDown === "ArrowDown") {

				this.relocateInput(this.ci + this.cols);
				this.input.selecti(0, this.input.size);
				this.showInput(true);
				e.preventDefault();

			} else if (keyDown === "Escape") {
				this.input.blur();
			} else if (InterCharMap.typingMode && keyDown === "Backspace" && this.ci === 0) {
				e.preventDefault();
			}
		};

		this.input.oninput = () => {
			this.changeChar(this.ci, this.input.value, this.input._value === "");
			this.input._value = this.input.value; // КОЛИ БУДЕ ГОТОВА "ІСТОРІЯ ЗМІН" МОЖНА (В ТЕОРІЇ) БУДЕ БРАТИ ПОПЕРЕДНЄ ЗНАЧЕННЯ ЗВІДТИ

			if (InterCharMap.typingMode) {
				if (keyDown === "Delete") {
					this.relocateInput(this.ci);
				} else if (keyDown === "Backspace") {
					this.relocateInput(this.ci - 1);
				} else {
					this.relocateInput(this.ci + 1);
				}

				this.input.selecti(0, this.input.size);
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

	// changeInputMode (mode) {
	// 	if (this.inputMode != mode) {
	// 		this.inputMode = mode;
	
	// 		switch (mode) {
	// 			case 0:
	// 				this.input.size = 1;
	// 				this.input.maxLength = 1;
	// 				break;
	// 			case 1:
	// 				this.input.size = 6;
	// 				this.input.maxLength = 6;
	// 		}
	// 		this.input.classList.toggle("big");
	// 	}
	// }

	unmark () {
		if (this.mi.base === 0) return;

		let x, y;
		this.ctx.fillStyle = this.canvas.palette[Math.floor(this.mi.i / this.mlen) % this.mlen];

		if (this.mi.base === 1) {
			x = this.mi.i % this.cols;
			y = (this.mi.i - x) / this.cols;
			this.ctx.fillRect(x, y, 1, 1);
		} else for (let j = this.mi.i; j < this.mi.i + this.mi.base; j++) {
			x = j % this.cols;
			y = (j - x) / this.cols;
			this.ctx.fillRect(x, y, 1, 1);
		}
		this.mi.base = 0;
	}

	mark (x, y = 0, base) {
		base ||= 1;

		this.unmark();

		this.ctx.fillStyle = this.canvas.palette[2];

		const i = Math.floor(Math.min((y * this.cols) + x, this.len) / base) * base;
		this.mi.i = i;
		this.mi.base = base;

		if (base === 1) {
			x = i % this.cols;
			y = (i - x) / this.cols;
			this.ctx.fillRect(x, y, 1, 1);
		} else for (let j = i; j < i + base; j++) {
			x = j % this.cols;
			y = (j - x) / this.cols;
			this.ctx.fillRect(x, y, 1, 1);
		}
	}

	relocateInput (i, between = false) {
		this.input.previousElementSibling.textContent = "";
		this.input.nextElementSibling.textContent = "";

		this.ci = Math.fitinter(0, i, this.len - 1);
		
		if (between) {
			this.changeChar(this.ci, "0", true);
			this.input.value = "0";
		} else {
			this.input.value = this.getDataToLog(this.ci, this.ci + 1);
		}

		this.input.previousElementSibling.textContent = this.getDataToLog(0, this.ci);
		this.input.nextElementSibling.textContent = this.getDataToLog(this.ci + 1, this.len);
	}

	showInput (type = false) {
		const sy = (Math.floor(this.ci / this.cols) * this.letterHeight) + this.box.top;

		if (type) {
			this.wrap.scroll(0,
				sy - Math.round(this.box.oheight / 2) + Math.round(this.letterHeight / 2)
			);
		} else if (sy + this.letterHeight > this.box.oheight + this.wrap.scrollTop) {
			this.wrap.scroll(0,
				sy - this.box.oheight + this.letterHeight
			);
		} else if (sy < this.wrap.scrollTop) {
			this.wrap.scroll(0,
				sy
			);
		}
	}

	loadData (data) {
		if (data instanceof Uint16Array) {
			for (let i = 0; i < this.len; i++) {
				this.chars += String.fromCharCodeS(data[i] || 0x30);
			}
		} else if (typeof data == "string") {
			for (let i = 0; i < this.len; i++) {
				this.chars += data[i];
			}
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

	log () {
		this.container.innerHTML = this.getDataToLog();
	}
}

class DatablockMap {
	static pcontainer;
	static ccontainer;

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

		// POLYGONS

		this.polygons = [];
		let coords = [];
		let _v;
	
		BASE.current.goThroughDataModules((x, y, j, v) => {
			_v = -v;
			if (coords.length >= this.dblen * 2) {
				this.polygons.push(bitCoordsToPolygons(coords, ["upgoing", "downgoing"][(_v + 1) / 2], DatablockMap.pcontainer));
				coords = [];
			}
			coords.push(x);
			coords.push(y);
		}, {
			maxb: QRtable[BASE.current.version][BASE.current.ecdepth].dataBytes * 8,
		});
	
		if (coords.length > 2) {
			this.polygons.push(bitCoordsToPolygons(coords, ["upgoing", "downgoing"][(_v + 1) / 2], DatablockMap.pcontainer));
		}

		coords = [];

		// CHARS

		this.ichars = new InterCharMap(chars, this.dbs, 2);
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