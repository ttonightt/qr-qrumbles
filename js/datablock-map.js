
class InterCharMap {
	static typingMode = 0;

	static changeTypingMode () {
		this.typingMode ^= 1;
	}

	constructor (data, length, container = DatablockMap.ccontainer) {
		this.len = length || data.length;

		this.container = container;

		this.letterWidth = this.container.clientWidth;
		this.letterHeight = this.container.clientHeight;

		this.chars = "";

		this.container.innerHTML = 0;
		this.cols = Math.floor(this.container.clientWidth / this.letterWidth);
		this.rows = Math.ceil(this.len / this.cols);
		if (data) this.loadData(data);
		this.logData(data);

		this.container.onmouseup = e => {
			if (e.target == this.marker) {
				let i = Math.floor(e.offsetX / this.letterWidth);
				if (i < 0) i = 1;

				this.pasteInput(i, true, Math.floor(e.button / 2));

			} else if (e.target == this.container) {
				const i = 	(Math.floor(e.offsetY / this.letterHeight) * this.cols) +
							Math.min(Math.floor(e.offsetX / this.letterWidth), this.cols - 1);

				this.mark(i);
				this.pasteInput(i - this.mi, true, Math.floor(e.button / 2));
			}
		};

		this.container.onmousemove = e => {
			if (!this.input.focused && e.target == this.container) {
				const 	x = Math.min(Math.floor(e.offsetX / this.letterWidth), this.cols - 1),
						y = Math.floor(e.offsetY / this.letterHeight);

				this.mark((y * this.cols) + x);
			}
		};

		this.container.oncontextmenu = e => {
			e.preventDefault();
		};

		this.marker = document.createElement("div");

		this.input = document.createElement("input");
		this.input.type = "text";
		this.input.maxLength = 1;
		this.input.size = 1;
		this.input.value = this.chars[0];
		this.inputMode = 0;

		this.ci = 0;
		this.mi = 0;

		let keyDown = 0;

		this.input.onfocus = () => {
			this.input.focused = true;
		};

		this.input.onblur = () => {
			this.input.focused = false;
		};

		this.input.onkeydown = e => {
			if (this.inputMode) return;
			keyDown = e.keyCode;
			if (keyDown == 39 && this.ci < this.len - 1 && this.input.selectionEnd == this.input.value.length) {
				this.mark(this.ci + 1);
				this.pasteInput((this.ci + 1) % 2, true);
			} else if (keyDown == 37 && this.ci > 0 && this.input.selectionStart == 0) {
				this.mark(this.ci - 1);
				this.pasteInput((this.ci - 1) % 2, true);
			} else if (keyDown == 38 && this.ci >= this.cols) {
				this.mark(this.ci - this.cols);
				this.pasteInput((this.ci - this.cols) % 2, true);
			} else if (keyDown == 40 && this.ci < this.len - (this.len % this.cols)) {
				this.mark(this.ci + this.cols);
				this.pasteInput((this.ci + this.cols) % 2, true);
			} else if (keyDown == 8 && this.ci == 0) {
				e.preventDefault();
			}
		};

		this.input.onkeyup = () => {
			if (InterCharMap.typingMode) {
				this.input.selectionStart = 0;
				this.input.selectionEnd = 1;
			}
			keyDown = 0;
		};

		this.input.oninput = () => {
			if (InterCharMap.typingMode) {
				if (keyDown == 46) {
					this.pasteInput(this.ci);
				} else if (keyDown == 8 && this.ci > 0) {
					this.pasteInput(this.ci - 1);
				} else {
					this.pasteInput(this.ci + 1);
				}
			}

			this.changeChar(this.ci, this.input.value);
		};
	}

	changeChar (i, char) {
		if (char == "") {
			this.chars = this.chars.slice(0, i) + this.chars.slice(i + 1, this.len);
			this.mark(this.ci);
		} else {
			this.chars = this.chars.slice(0, i) + char + this.chars.slice(i + 1, this.len);
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

	mark (i) {
		i = Math.floor(Math.min(i, this.len - 1) / 2) * 2;
		if (i == this.mi) return;

		this.container.innerHTML = "";
		this.container.append(
			this.getLogData(0, i),
			this.marker,
			this.getLogData(i + 2)
		);

		this.marker.innerHTML = this.getLogData(i, i + 2);
		this.mi = i;
	}

	pasteInput (i, focus = true, mode = this.inputMode) {
		this.ci = this.mi + i;
		this.marker.innerHTML = "";

		// this.changeInputMode(mode); // <<<

		if (i == 1) {
			this.marker.append(this.getLogData(this.ci - 1, this.ci), this.input);
		} else {
			this.marker.append(this.input, this.getLogData(this.ci + 1, this.ci + 2));
		}

		// if (this.inputMode) {
		// 	const cc = this.chars[i].charCodeAt(0).toString(16);
		// 	this.input.value = "\\u" + "0".repeat(4 - cc.length) + cc;
		// } else {
			this.input.value = this.chars[this.ci];
		// }

		if (focus) {
			this.input.focus();
			this.input.selectionStart = 0;
			this.input.selectionEnd = 1;
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

	logData () {
		this.container.innerHTML = this.getLogData();
	}

	getLogData (a = 0, b = this.len) {
		let str = "";
		for (let i = a; i < b; i++) {
			if (this.chars[i] == " ") {
				str += "\u00a0";
			} else {
				str += this.chars[i];
			}
			if ((i + 1) % this.cols == 0) str += " ";
		}
		return str;
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
	
		BASE.current().goThroughDataModules((x, y, j, v) => {
			_v = -v;
			if (coords.length >= this.dblen * 2) {
				this.polygons.push(bitCoordsToPolygons(coords, ["upgoing", "downgoing"][(_v + 1) / 2], DatablockMap.pcontainer));
				coords = [];
			}
			coords.push(x);
			coords.push(y);
		}, {
			maxb: QRtable[BASE.current().version][BASE.current().ecdepth].dataBytes * 8,
		});
	
		if (coords.length > 2) {
			this.polygons.push(bitCoordsToPolygons(coords, ["upgoing", "downgoing"][(_v + 1) / 2], DatablockMap.pcontainer));
		}

		coords = [];

		// CHARS

		this.ichars = new InterCharMap(chars, this.dbs);
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