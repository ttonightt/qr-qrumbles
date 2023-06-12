
class InterCharMap {
	constructor (container, data) {
		this.len = data.length;

		this.container = container;

		this.letterSize = [
			this.container.clientWidth,
			this.container.clientHeight
		];

		this.container.parentElement.style.flex = "1";

		this.charCodes = new Uint16Array(this.len);
		this.updateData(data);
		this.logData();
		this.charCodes.x2convert(Math.floor(this.container.clientWidth / this.letterSize[0]));

		this.container.onclick = e => {
			if (e.target == this.input) return;

			const 	x = Math.min(Math.floor(e.offsetX / this.letterSize[0]), this.charCodes.columns - 1),
					y = Math.floor(e.offsetY / this.letterSize[1]);
			if (this.charCodes.x2getDF(x, y, 0) != 0) {
				this.pasteInput(x, y);
			}
		};

		this.input = document.createElement("input");
		this.input.type = "text";
		this.input.maxLength = 1;
		this.input.size = 1;
		this.input.value = "";
		// this.input.style.display = "none";

		this.eci = 0;

		this.input.onkeydown = e => {
			if (e.keyCode == 39 && this.eci < this.len && this.input.selectionEnd == this.input.size) {
				this.pasteInput(this.eci + 1, false);
			} else if (e.keyCode == 37 && this.eci > 0 && this.input.selectionStart == 0) {
				this.pasteInput(this.eci - 1, false);
			} else if (e.keyCode == 38 && this.eci >= this.charCodes.columns) {
				this.pasteInput(this.eci - this.charCodes.columns, false);
			} else if (e.keyCode == 40 && this.eci < this.charCodes.length - (this.charCodes.length % this.charCodes.columns)) {
				this.pasteInput(this.eci + this.charCodes.columns, false);
			}
		};
	}

	pasteInput (x, y = 0, focus = true) {
		const i = Math.min((y * this.charCodes.columns) + x, this.charCodes.length - 1);
		const _textContent = this.container.textContent.slice(0, this.eci) + this.input.value + this.container.textContent.slice(this.eci, this.len);
		this.container.innerHTML = "";

		this.container.append(	_textContent.slice(0, i),
								this.input,
								_textContent.slice(i + 1, this.len));

		this.input.value = _textContent[i] || "";
		if (focus) {
			this.input.focus();
			this.input.selectionStart = 0;
			this.input.selectionEnd = 1;
		}

		this.eci = i;
	}

	updateData (data) {
		if (data instanceof Uint16Array) {
			for (let i = 0; i < this.len; i++) {
				this.charCodes[i] = data[i];
			}
		} else if (typeof data == "string") {
			for (let i = 0; i < this.len; i++) {
				this.charCodes[i] = data[i].charCodeAt(0);
			}
		}
	}

	logData () {
		let str = "";
		for (let i = 0; i < this.len; i++) {
			str += String.fromCharCodeS(this.charCodes[i]);
		}
		this.container.textContent = str;
	}
}

class DatablockMap {
	constructor (qr, polygonsContainer) {
		switch (qr.datatype) {
			// case 7:
			// 	this.dbs = QRtable[qr.version][qr.ecdepth].dataBytes * 8;
			// 	this.dblen = 8;
			// 	break;
			case 4:
				this.dbs = QRtable[qr.version][qr.ecdepth].dataBytes;
				this.dblen = 8;
				break;
			case 2:
				this.dblen = 11;
				this.dbs = QRtable[qr.version][qr.ecdepth].dataBytes * 8;
				if (this.dbs % 11 >= 7) {
					this.dbs = Math.ceil(this.dbs / 11);
				} else {
					this.dbs = Math.floor(this.dbs / 11);
				}
		}

		this.polygons = createDatablocksPolygons(this.dblen, qr, polygonsContainer);
		let str = "";
		for (let i = 0; i < 100; i++) str += String.fromCharCode(i + 33);
		this.chars = new InterCharMap(document.getElementById("decoded"), str);
		console.log(this.chars);
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
			createPolygon(polygons[i], elem);
		}
	} else {
		elem = createPolygon(polygons[0], parent);
	}

	elem.classList.add(cssClass);

	return elem;
}

function createDatablocksPolygons (separator, qr, parent) {
	let polygons = [];
	let coords = [];
	const maxlen = QRtable[qr.version][qr.ecdepth].dataBytes * 8;

	let x = qr.modules - 1, y = qr.modules - 1, v = 1;
	coords.push(x--);
	coords.push(y);
	for (let i = 1, j = 0; j < maxlen; i++) {
		if (x == 10 && y == qr.modules) {
			y -= 9;
			x -= 2;
			v = -v;
		}

		if (x == 8 && y == 8) {
			x--;
		}

		if (x == qr.modules - 9 && y == 6) {
			x -= 2;
			y -= 6;
			v = -v;
		}
		
		if (y < 0 || y >= qr.modules || (y == 8 && (qr.matrix.x2get(x, y) == 4 || qr.matrix.x2get(x, y) == 5)) || (x <= 5 && y == qr.modules - 11)) {
			y += v;
			x -= 2;
			v = -v;
			if (coords.length >= separator * 2) {
				polygons.push(bitCoordsToPolygons(coords, ["upgoing", "downgoing"][(-v + 1) / 2], parent));
				coords = [];
			}
			coords.push(x);
			coords.push(y);
			j++;
		} else if (qr.matrix.x2get(x, y) == 0 || qr.matrix.x2get(x, y) == 1) {
			if (coords.length >= separator * 2) {
				polygons.push(bitCoordsToPolygons(coords, ["upgoing", "downgoing"][(-v + 1) / 2], parent));
				coords = [];
			}
			coords.push(x);
			coords.push(y);
			j++;
		}
		if (i % 2) {
			x++;
			y -= v;
		} else {
			x--;
		}
	}

	if (coords.length > 2) {
		coords.pop();
		coords.pop();
		polygons.push(bitCoordsToPolygons(coords, ["upgoing", "downgoing"][(-v + 1) / 2], parent));
	}

	return polygons;
}