
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

class BitMapWorkbench {
	constructor () {

	}
}

class CWMap {
	static canvas;
	static ctx;

	static init (canvas) {
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");

		// let _cw = -1;

		// this.canvas.onmousemove = e => {
		// 	const cw = (this.current.matrix.x2getD(
		// 		Math.floor(e.offsetX / window.canvasScale) - this.current.modules + this.current.matrix.columns,
		// 		Math.floor(e.offsetY / window.canvasScale),
		// 		-1
		// 	) % 4096) - 1;

		// 	if (_cw !== cw) {
		// 		console.log(cw);

		// 		_cw = cw;
		// 	}

		// 	// OneTitle.move(e.clientX, e.clientY);
		// };
	}

	static collection = {};
	static __index;

	static get current () {
		return this.collection[this.__index];
	}

	static collect (cwm, key) {
		this.collection[key] = cwm;
		this.__index = key;
	}

	static reindexate (index) {
		if (index in this) throw new Error("Invalid index");
		this.__index = index;
	}

	static getCW (x, y) {
		const bin12 = this.matrix.x2getD(x, y, 4095) % 4096;

		if (bin12 > 2956) return -1; // 2956 means quantity of codewords in version 40 with L errcor level (the highest)

		return bin12 - 1;
	}

	constructor (qr) {
		this.modules = qr.modules;
		this.datatype = qr.info.datatype;
		this.matrix = new Uint16Array(this.modules * (this.modules - qr.__ECStartPoint.x + 1)).x2convert(this.modules - qr.__ECStartPoint.x + 1);

		const g1 = qr.info.g1Blocks, g2 = qr.info.g2Blocks, g1cws = qr.info.g1DataBytesPerBlock, g2cws = qr.info.g2DataBytesPerBlock;

		const xs = new Uint8Array(8);	// x coordinates
		const ys = new Uint8Array(8);	// y coordinates
		const fs = new Uint16Array(8);	// format bit + bit offset

		switch (this.datatype) {
			case 2:
				QRT.current.goThroughDataModules((x, y, j) => {
					const li = j % 8, _gi = (j - li) / 8;
					const r = _gi % (g1 + g2), c = (_gi - r) / (g1 + g2);
					const gi = (g1cws * Math.min(r, g1)) + (g2cws * Math.max(0, r - g1)) + c;

					xs[j % 8] = x - this.modules + this.matrix.columns;
					ys[j % 8] = y;
					fs[j % 8] = (gi * 8) + li;

					if (j % 8 === 7) {
						this.cwBitsCoordsToMX(xs, ys, fs);
					}
				}, {
					maxb: 11744
				});

				break;
			case 4:
				qr.goThroughDataModules((x, y, j) => {
					xs[j % 8] = x - this.modules + this.matrix.columns;
					ys[j % 8] = y;
					fs[j % 8] = Math.floor(j / 8) + 1;

					if (j % 8 === 7) {
						this.cwBitsCoordsToMX(xs, ys, fs);
					}
				}, {
					maxb: qr.info.dataBytes * 8
				});
			// 	break;
			// case 7:
			// 	// ...
		}

		CWMap.collect(this, "27LB"); // <<<

		this.updateCanvas();
	}

	updateCanvas () {
		const pixs = window.canvasScale;
		const marg = this.modules - this.matrix.columns;
		CWMap.ctx.fillStyle = "green";

		for (let x = 0; x < this.matrix.columns; x++) {
			for (let y = 0; y < this.matrix.rows; y++) {

				const type = this.matrix.x2get(x, y) >> 14;

				if (type % 2) {
					CWMap.ctx.fillRect(((x + marg) * pixs) - 1, (y * pixs) - 1, 2, pixs + 2);
				}

				if ((type >> 1) % 2) {
					CWMap.ctx.fillRect(((x + marg) * pixs) - 1, ((y + 1) * pixs) - 1, pixs + 2, 2);
				}
			}
		}
	}

	cwBitsCoordsToMX (xs, ys, fs) {
		if (xs.length === ys.length && ys.length === fs.length) {
			let bit, _bit;

			for (let i = 0; i < xs.length; i++) {

				// fs[i] = Math.floor(fs[i] / 11) + 1; // FOR ALPHANUM!!!!
				bit = 0b00;

				_bit = this.matrix.x2getD(xs[i] - 1, ys[i], 0);

				if (_bit % 4096 !== fs[i]) { // check left cell
					bit += 0b01;
				}

				_bit = this.matrix.x2getD(xs[i], ys[i] - 1, 0);

				if (_bit % 4096 === fs[i]) { // check top cell
					this.matrix.x2set(
						xs[i],
						ys[i] - 1,
						_bit & 0b0111111111111111 // removes bottom side of top cell
					);
				}

				_bit = this.matrix.x2getD(xs[i] + 1, ys[i], 0);

				if (_bit % 4096 === fs[i]) { // check right cell
					this.matrix.x2set(
						xs[i] + 1,
						ys[i],
						_bit & 0b1011111111111111 // removes left side of right cell
					);
				}

				_bit = this.matrix.x2getD(xs[i], ys[i] + 1, 0);

				if (_bit % 4096 !== fs[i]) { // check bottom cell
					bit += 0b10;
				}

				this.matrix.x2set(
					xs[i],
					ys[i],
					(bit << 14) + fs[i]
				);
			}
		} else throw new Error("Inappropriate format of given data! Must be one array of int8s type of [x, y, x, y, ...] and then one non-negative number");
	}
}