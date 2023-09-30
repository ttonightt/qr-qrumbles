
class Charmap {
	static markup;
	static textarea;
	static block = [];
	static grabberLeft;
	static grabberRight;

	static init (markup, textarea) {
		this.markup = markup;
		this.textarea = textarea;
		this.__x = this.textarea.getBoundingClientRect().x;
		this.__y = this.textarea.getBoundingClientRect().y;

		this.textarea.textContent = "0";
		this.letterWidth = this.textarea.clientWidth;
		this.letterHeight = this.textarea.clientHeight;
		this.textarea.textContent = "";
		this.columns = Math.floor(this.textarea.clientWidth / this.letterWidth);

		document.documentElement.style.setProperty("--textarea-width", this.columns + "ch");

		this.grabberLeft = document.createElement("i");
		this.grabberRight = document.createElement("i");

		let grabber, lim, _pos, pos, _textContent;

		Charmap.grabberRight.onmousedown = () => {
			grabber = 2;
			lim = Math.floor((Charmap.grabberLeft.offsetLeft + 3) / this.letterWidth) + (Math.ceil((Charmap.grabberLeft.offsetTop - 1) / this.letterHeight) * this.columns);
			_pos = Math.floor((Charmap.grabberRight.offsetLeft + 3) / this.letterWidth) + (Math.ceil((Charmap.grabberRight.offsetTop - 1) / this.letterHeight) * this.columns);
			// console.log(lim);
			// console.log(_pos);

			_textContent = Charmap.textarea.textContent.slice(lim);

			console.log(_textContent);
		};
		
		Charmap.textarea.onmousemove = e => {
			if (grabber === 2) {
				pos = Math.floor((e.clientX - this.__x) / this.letterWidth) + (Math.floor((e.clientY - this.__y) / this.letterHeight) * this.columns);
				// console.log(pos);
				Charmap.grabberRight.previousElementSibling.textContent = _textContent.slice(0, pos - lim);
				Charmap.grabberRight.nextElementSibling.textContent = _textContent.slice(0, pos - lim);
			}
		};

		window.addEventListener("mouseup", () => {
			grabber = 0;
		});
	}

	constructor (data) {
		this.restructure(data);

		// Charmap.textarea.append(Charmap.grabberLeft, Charmap.ps[0], Charmap.grabberRight);
	}

	restructure (dblocks) {
		if (!(dblocks instanceof Array)) throw new Error("..."); // <<<

		if (Charmap.block.length < dblocks.length) {
			for (let i = Charmap.block.length; i < dblocks.length; i++) {
				Charmap.block[i] = {
					p: document.createElement("p")
				};
			}
		} else if (Charmap.block.length > dblocks.length) Charmap.block.splice(dblocks.length, Charmap.block.length - dblocks.length);

		let len = 0;

		for (let i = 0; i < dblocks.length; i++) {

			Charmap.block[i].p.textContent = dblocks[i].chars;

			len += dblocks[i].chars.length;

			Charmap.block[i].p.setAttribute("encoding", dblocks[i].encoding);

			Charmap.block[i].p.onclick = () => {
				Charmap.block[i].p.before(Charmap.grabberLeft);
				Charmap.block[i].p.after(Charmap.grabberRight);
			};

			Charmap.textarea.appendChild(Charmap.block[i].p);

			if (Charmap.textarea.textContent.length % Charmap.columns === 0) {
				Charmap.textarea.appendChild(document.createElement("wbr"));
			}
		}
	}
}

class CWMap {
	static canvas;
	static ctx;

	static init (ctx) {
		if (ctx instanceof CanvasRenderingContext2D) {
			this.ctx = ctx;
			this.canvas = this.ctx.canvas;
		} else if (ctx instanceof HTMLCanvasElement) {
			this.canvas = ctx;
			this.ctx = ctx.getContext("2d");
		} else {
			throw new Error("..."); // <<<
		}
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

	getCW (x, y) {
		const bin12 = this.matrix.x2getD(x - this.modules + this.matrix.columns, y, 0) % 4096;

		if (bin12 > 2956) return -1; // 2956 means quantity of codewords in version 40 with L errcor level (the highest)

		return bin12 - 1;
	}

	constructor (qr) {
		this.modules = qr.modules;
		this.datatype = qr.info.datatype;
		this.matrix = new Uint16ArrayX2(this.modules, this.modules - qr.info.firstECModuleParams.x + 1);

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
					const _i = Math.floor(j / 8);
					const r = _i % (g1 + g2);

					xs[j % 8] = x - this.modules + this.matrix.columns;
					ys[j % 8] = y;
					fs[j % 8] = (g1cws * Math.min(r, g1)) + (g2cws * Math.max(0, r - g1)) + ((_i - r) / (g1 + g2)) + 1;

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

		let str = "";

		for (const bit of this.matrix) {
			str += bit.toString(2).padStart(16, "0") + ", ";
		}

		console.log(str);

		CWMap.collect(this, "27LB"); // <<<
	}

	updateCanvas (scale) {
		const marg = this.modules - this.matrix.columns;
		CWMap.ctx.fillStyle = "green";

		for (let x = 0; x < this.matrix.columns; x++) {
			for (let y = 0; y < this.matrix.rows; y++) {
				
				const type = this.matrix.x2get(x, y) >> 14;

				if (type % 2) {
					CWMap.ctx.fillRect(((x + marg) * scale) - 1, (y * scale) - 1, 2, scale + 2);
				}

				if ((type >> 1) % 2) {
					CWMap.ctx.fillRect(((x + marg) * scale) - 1, ((y + 1) * scale) - 1, scale + 2, 2);
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