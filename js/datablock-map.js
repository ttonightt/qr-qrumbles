
class DBMChars {
	static typingMode = 0;
	static container;
	static swrap;
	static input;
	static inputMode;
	static posti;
	static eblocks = [];

	static init (container, swrap) {
		this.container = container;
		this.swrap = swrap;

		this.container.oncontextmenu = e => {
			e.preventDefault();
		};

		this.input = document.createElement("input");
		this.input.type = "text";
		this.input.maxLength = 1;
		this.input.size = 1;
		this.input.required = true;
		DBMChars.input.pattern = "^.|\\n|\\r|\\u2028|\\u2029$";

		this.posti = document.createElement("i");

		this.input.selecti = (a = this.input.size, b = a) => {
			this.input.selectionStart = a;
			this.input.selectionEnd = b;
		};
	}

	static resizeContent (len) {
		if (len < this.len)  {
			// ...
		} else if (len > this.len) {
			// ...
		}
	}

	static toggleTypingMode () {
		DBMChars.typingMode ^= 1;
	}

	constructor (data, dbs, blen, padTo = data.length) {
		this.dbs = dbs;	//		  ^^^^^^^^^^^^^^^^^^^
		this.clen = padTo; // <<< ТРЕБА ЗРОБИТИ ПЕРЕВІРКУ НА ПРАВИЛЬНІСТЬ ДОВЖИНИ ДАНИХ ТА ВИНЕСТИ ЇЇ У КЛАСС QR

		switch (blen) {
			case 1: case 2:
				this.blen = blen;
				break;
			default:
				throw new Error("Only values 1 or 2 are allowed");
		}

		// vvvv ????
		
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

		// vvvv SETTING UP THE DATA vvvv

		this.chars = "";

		if (data instanceof Uint16Array) {
			for (let i = 0; i < this.clen; i++) {
				this.chars += String.fromCharCodeS(data[i] || 0x30);
			}
		} else if (typeof data === "string") {
			for (let i = 0; i < this.clen; i++) {
				this.chars += data[i] || "0";
			}
		}

		if (this.dbs < DBMChars.eblocks.length) {
			for (let i = DBMChars.eblocks.length; i > this.dbs; i--) {
				DBMChars.eblocks.pop();
				DBMChars.container.lastChild.remove();
			}
		} else if (this.dbs > DBMChars.eblocks.length) {
			for (let i = DBMChars.eblocks.length; i < this.dbs; i++) {
				const elem = document.createElement("p");
				DBMChars.eblocks.push(elem);
				DBMChars.container.appendChild(elem);
			}
		}

		if (this.blen === 2) {
			for (let i = 0, j = 0; j < this.clen; i++, j += 2) {

				const elem = DBMChars.eblocks[i];
				elem.textContent = this.chars[j] + (this.chars[j + 1] || "");

				elem.onmouseup = () => {
					const selection = getSelection();

					if (selection.anchorNode === selection.focusNode && selection.anchorOffset === selection.focusOffset) {
						this.relocateInputTo((i * this.blen) + selection.anchorOffset);
					} else {
						// ...
					}
				};
			}
		} else if (this.blen === 1) {
			for (let i = 0; i < this.dbs; i++) {
				const elem = document.createElement("p");
				elem.textContent = this.chars[i];
				DBMChars.container.appendChild(elem);
			}
		}

		// vvvv INPUT EVENTS vvvv

		this.ci = -1;

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
		if (char === "") {
			this.chars = this.chars.slice(0, i) + this.chars.slice(i + 1, this.len);
			if (this.chars.length < this.len) this.chars += "0";
		} else {
			this.chars = this.chars.slice(0, i) + char + this.chars.slice(i + !between, this.len);
		}
	}

	relocateInputTo (i, between = false, mode = false) {
		i = Math.fitinter(0, i, this.clen);

		if (this.ci === i) return;

		if (this.ci !== -1) {
			const bi = Math.floor(this.ci / this.blen);
			DBMChars.eblocks[bi].textContent = this.getDataToLog(bi * this.blen, (bi + 1) * this.blen);
		}

		this.ci = i;

		const bi = Math.floor(this.ci / this.blen), ii = this.ci % this.blen;

		// if (between) {
		// 	this.changeChar(this.ci, "0", true);
		// 	DBMChars.input.value = "0";
		// } else {
			DBMChars.eblocks[bi].textContent = "";

			if (ii > 0) DBMChars.eblocks[bi].append(this.getDataToLog(bi * this.blen, this.ci));
			
			DBMChars.eblocks[bi].append(DBMChars.input);

			DBMChars.input.value = this.chars[this.ci];

			if (ii < this.blen - 1) DBMChars.eblocks[bi].append(this.getDataToLog(this.ci + 1, (bi + 1) * this.blen));
		// }

		// if (DBMChars.inputMode !== mode) {
		// 	DBMChars.inputMode = mode;

		// 	if (mode) {
		// 		DBMChars.input.value = "u" + DBMChars.input.value.charCodeAt(0).toString(16).padStart(4, "0");
		// 		DBMChars.input.size = 5;
		// 		DBMChars.input.maxLength = 5;
		// 		DBMChars.input.classList.add("big");
		// 		DBMChars.input.pattern = "^[uU]{0,1}[0-9a-fA-F]{1,4}$";
		// 	} else {
		// 		DBMChars.input.size = 1;
		// 		DBMChars.input.maxLength = 1;
		// 		DBMChars.input.classList.remove("big");
		// 		DBMChars.input.pattern = "^.|\\n|\\r|\\u2028|\\u2029$";

		// 		DBMChars.posti.textContent = "";
		// 	}
		// }
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

	getDataToLog (a = 0, b = this.clen) {
		if (a === b) return "";
		if (b - a === 1) return this.chars[a];

		let str = "";
		for (let i = a; i < b; i++) {
			if (this.chars[i] === " ") {
				str += "\u00a0";
			} else {
				str += this.chars[i];
			}
		}
		return str;
	}
}

class DBMPolygons {
	static container;

	static init (container) {
		this.container = container;
	}

	constructor (chars, datatype, tinfo) {
		const g1 = tinfo.g1Blocks, g2 = tinfo.g2Blocks, g1cws = tinfo.g1DataBytesPerBlock, g2cws = tinfo.g2DataBytesPerBlock;

		switch (datatype) {
			case 2:
				this.datablocks = [];
				let coords = [];
				
				for (let i = Math.ceil(tinfo.dataBytes * 8 / 11); i >= 0; i--) {
					this.datablocks.push(
						DBMPolygons.container.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "g"))
					);
				}

				QRT.current.goThroughDataModules((x, y, j) => {
					const li = j % 8, gi = (j - li) / 8;
					const r = gi % (g1 + g2), c = (gi - r) / (g1 + g2);
					const ti = (g1cws * Math.min(r, g1)) + (g2cws * Math.max(0, r - g1)) + c;

					coords.push(x);
					coords.push(y);

					if (((ti * 8) + li) % 11 === 0 || li === 7) {
						this.datablocks[Math.floor(ti * 8 / 11)].appendChild(bitCoordsToPolygons(coords));
						coords = [];
					}
				}, {
					maxb: tinfo.dataBytes * 8
				});

				// if (coords.length > 2) {
				// 	this.polygons.push(bitCoordsToPolygons(coords, DBMPolygons.container));
				// }

				break;
			case 4:
				this.dbs = databytes;
				this.dblen = 8;
			// 	break;
			// case 7:
			// 	// ...
		}

		// CHARS

		// this.ichars = new DBMChars(chars, this.dbs, 2, this.clen);
	}
}

function bitCoordsToPolygons (coords, parent) {
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
			if (points.length === 0) {
				if (map.x2get(x, y) === 1 && map.x2getD(x + 1, y, 0) != 2 && map.x2getD(x, y + 1, 0) != 2 && map.x2getD(x - 1, y, 0) != 2 && map.x2getD(x, y - 1, 0) != 2) {
					t = true;
					_x = x;
					_y = y;
					_p = p;
				} else {
					if (y === 1 && x < map.columns - 1) {
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
		} while (!(x === _x && y === _y && p - _p > 1) && ++p < 200);

		if (points.length > 1) {
			polygons.push(points);
		}
	}

	let elem;

	if (polygons.length > 1) {
		elem = document.createElementNS("http://www.w3.org/2000/svg", "g");
		
		for (i = polygons.length - 1; i >= 0; i--) {
			elem.appendChild(SVGPolygonElement.create(polygons[i]));
		}
	} else {
		elem = SVGPolygonElement.create(polygons[0]);
	}

	return elem;
}