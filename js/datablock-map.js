
class DatablockMap {
	constructor (qr, polygonsContainer) {
		switch (qr.datatype) {
			case 7:
				this.dbs = QRtable[qr.version][qr.ecdepth].dataBytes * 8;
				this.dblen = 8;
				break;
			case 4:
				this.dbs = QRtable[qr.version][qr.ecdepth].dataBytes * 8;
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

		this.polygons = createDatablocksPolygons(11, qr, polygonsContainer);
		this.charcells = [];
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
		
		if (y < 0 || y >= qr.modules || (y == 8 && (qr.matrix[y][x] == 4 || qr.matrix[y][x] == 5)) || (x <= 5 && y == qr.modules - 11)) {
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
		} else if (qr.matrix[y][x] == 0 || qr.matrix[y][x] == 1) {
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

class InputFromCluster {
	constructor (value) {
		this.elem = document.createElement("input");
		this.elem.type = "text";
		this.elem.maxLength = 1;
		this.elem.name = "decoded";
		this.elem.value = value;
		this.value = value;

		this.elem.addEventListener("keydown", e => {
			if (e.keyCode == 39 && (this.elem.selectionEnd == 1 || (this.elem.selectionStart == 0 && this.elem.value.length == 0)) && this.elem.nextElementSibling != null) {
				this.elem.nextElementSibling.focus();
			} else if (e.keyCode == 37 && this.elem.selectionStart == 0 && this.elem.previousElementSibling != null) {
				this.elem.previousElementSibling.focus();
			}
		});

		document.querySelector(".decoded-wrap").appendChild(this.elem);
	}
}

let DCD = {
	charios: [],
	scanCharIOs: () => {
		this.charios = [];
		for (let i = 0; i < 12; i++) {
			charios[i] = new InputFromCluster("h");
		}
	},
};

DCD.scanCharIOs();