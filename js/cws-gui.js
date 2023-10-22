
class Charmap {
	static markup;
	static textarea;
	static ps;
	static grabberLeft;
	static grabberRight;
	static guiMode = 0; // 0 - char edit, 1 - markup

	static bitLengthOfStringLength (encoding, strlen) { // TEMPORARY !!!

		switch (encoding) {
			case "Alphanum":
				return (Math.floor(strlen / 2) * 11) + ((strlen % 2) * 6);

			case "Num":
				return (Math.floor(strlen / 3) * 10) + Math.floor(7 * ((n + 0.2) % 3) / 2);

			default:
				return strlen * 8;
		}
	}

	static stringLengthByBitLength (encoding, bitlen) { // TEMPORARY !!!

		switch (encoding) {
			case "Alphanum":
				return (Math.floor(bitlen / 11) * 2) + (bitlen % 11 >= 6);

			case "Num":
				return (Math.floor(bitlen / 10) * 3) + Math.floor(((n + 0.5) % 10) / 3.75);

			default:
				return Math.floor(bitlen / 8);
		}
	}

	static init (markup, textarea) {
		this.ps = [];
		this.padp = document.createElement("b");
		this.markup = markup;
		this.textarea = textarea;

		this.textarea.textContent = "0";
		this.letterWidth = this.textarea.clientWidth;
		this.letterHeight = this.textarea.clientHeight;
		this.textarea.textContent = "";
		this.columns = Math.floor(this.textarea.clientWidth / this.letterWidth);

		document.documentElement.style.setProperty("--textarea-width", this.columns + "ch");

		this.__x = this.textarea.getBoundingClientRect().x;
		this.__y = this.textarea.getBoundingClientRect().y;

		Charmap.textarea.append(Charmap.padp);

		this.grabberLeft = document.createElement("i");
		this.grabberRight = document.createElement("i");

		let grabber = 0,
			offset,
			_offset = 0,
			len_,
			_textContent,
			i,
			maxi,
			j,
			maxj,
			bits,
			pad,
			maxoffset,
			_scrollTop;

		Charmap.grabberLeft.onmousedown = () => {
			grabber = 1;

			_textContent = Charmap.textarea.textContent;

			maxj = this.ps.length - 1;
			maxi = this.__focused.childIndex;

			this.padp.textContent = "";
			Charmap.textarea.classList.add("disabled");
		};

		Charmap.grabberRight.onmousedown = () => {
			grabber = 2;

			_textContent = Charmap.textarea.textContent;

			maxoffset = this.__focused.textEndOffset;
			bits = this.bits - this.__focused.bitEndOffset;

			maxj = this.ps.length - 1;
			maxi = this.__focused.childIndex;

			switch (this.__focused.encoding) {
				case "Alphanum":
					maxoffset += Math.floor(bits / 11) * 2;

					if (bits % 11 >= 6) {
						maxoffset++;
					}
					break;
				case "Num":
					maxoffset += Math.floor(bits / 10) * 3;

					if (bits % 10 >= 4) {
						maxoffset++;
					}
					if (bits % 10 >= 7) {
						maxoffset++;
					}
					break;
				default:
					maxoffset += Math.floor(bits / 8);
					break;
			}

			this.padp.textContent = "";
			Charmap.textarea.classList.add("disabled");
		};

		Charmap.textarea.onmousemove = e => {

			if (grabber === 0) return;

			offset = Math.floor((e.clientX - this.__x) / this.letterWidth) + (Math.floor((e.clientY - this.__y + this.textarea.parentElement.scrollTop) / this.letterHeight) * this.columns);

			if (offset - _offset === 0) return;

			if (offset > maxoffset) offset = maxoffset;

			_scrollTop = this.textarea.parentElement.scrollTop;

			if (Charmap.__mode) {
				if (grabber === 2) {

					if (offset <= this.__focused.textOffset) {
						offset = this.__focused.textOffset + 1;
					}

					if (_offset < offset) {

						for (i = this.__focused.childIndex + 1; this.ps[i].textEndOffset < offset; i++) {

							this.ps[i].textContent = "";
						}

						maxi = i;
					} else {

						for (i = maxi; this.ps[i].textOffset > offset; i--) {

							this.ps[i].textContent = _textContent.slice(this.ps[i].textOffset, this.ps[i].textEndOffset);
						}
					}

					if (i === this.__focused.childIndex) {

						this.ps[i + 1].textContent = _textContent.slice(offset, this.ps[i + 1].textEndOffset);
					} else {

						this.ps[i].textContent = _textContent.slice(offset, this.ps[i].textEndOffset);
					}

					this.__focused.textContent = _textContent.slice(this.__focused.textOffset, offset);

				} else if (grabber === 1) {

					if (offset >= this.__focused.textEndOffset) {
						offset = this.__focused.textEndOffset - 1;
					}

					if (_offset > offset) {

						for (i = maxi; this.ps[i].textEndOffset < offset; i++) {

							this.ps[i].textContent = _textContent.slice(this.ps[i].textOffset, this.ps[i].textEndOffset);
						}

					} else {

						for (i = this.__focused.childIndex - 1; this.ps[i].textOffset > offset; i--) {

							this.ps[i].textContent = "";
						}

						maxi = i;
					}

					if (i === this.__focused.childIndex) {

						this.ps[i - 1].textContent = _textContent.slice(this.ps[i - 1].textOffset, offset);
					} else {

						this.ps[i].textContent = _textContent.slice(this.ps[i].textOffset, offset);
					}

					this.__focused.textContent = _textContent.slice(offset, this.__focused.textEndOffset);
				}
			} else {
				if (grabber === 2) { // WORKS !

					if (offset <= this.__focused.textOffset) {
						offset = this.__focused.textOffset + 1;
					}

					if (offset < this.__focused.textEndOffset) {

						this.__focused.textContent = _textContent.slice(this.__focused.textOffset, offset);
					} else {

						this.__focused.textContent = _textContent.slice(this.__focused.textOffset, this.__focused.textEndOffset) + " ".repeat(offset - this.__focused.textEndOffset);
					}

					bits = this.__focused.bitOffset - this.__focused.bitEndOffset;

					len_ = offset - this.__focused.textOffset;

				} else if (grabber === 1) {

					if (offset >= this.__focused.textEndOffset) {
						offset = this.__focused.textEndOffset - 1;
					}

					if (_offset < offset) {

						for (i = maxi; i > 0 && this.ps[i].textOffset > this.__focused.textOffset - offset; i--) {

							this.ps[i].textContent = _textContent.slice(this.ps[i].textOffset, this.ps[i].textEndOffset);
						}

					} else {

						if (offset < this.__focused.textOffset) {

							for (i = 0; this.ps[i].textEndOffset < this.__focused.textOffset - offset; i++) {

								this.ps[i].textContent = "";
							}

							maxi = i;
						}
					}

					if (offset > this.__focused.textOffset) {

						this.ps[i].textContent = " ".repeat(offset - this.__focused.textOffset) + _textContent.slice(0, this.ps[i].textEndOffset);

						this.__focused.textContent = _textContent.slice(offset, this.__focused.textEndOffset);
					} else {

						this.ps[i].textContent = _textContent.slice(this.__focused.textOffset - offset, this.ps[i].textEndOffset);

						this.__focused.textContent = " ".repeat(this.__focused.textOffset - offset) + _textContent.slice(this.__focused.textOffset, this.__focused.textEndOffset);
					}

					bits = -this.ps[i].bitEndOffset - (this.__focused.bitEndOffset - this.__focused.bitOffset);

					len_ = this.ps[i].textContent.length;

					switch (this.ps[i].encoding) {
						case "Alphanum":
							bits += (Math.floor(len_ / 2) * 11) + ((len_ % 2) * 6);
							break;
						case "Num":
							bits += Math.floor(len_ / 3) * 10;

							if (len_ % 3 === 2) {
								bits += 7;
							}
							if (len_ % 3 === 1) {
								bits += 4;
							}
							break;
						default:
							bits += len_ * 8;
							break;
					}

					len_ = this.__focused.textEndOffset - offset;
				}
			}

			switch (this.__focused.encoding) {
				case "Alphanum":
					bits += (Math.floor(len_ / 2) * 11) + ((len_ % 2) * 6);
					break;
				case "Num":
					bits += Math.floor(len_ / 3) * 10;

					if (len_ % 3 === 2) {
						bits += 7;
					}
					if (len_ % 3 === 1) {
						bits += 4;
					}
					break;
				default:
					bits += len_ * 8;
					break;
			}

			if (_offset < offset) { // <<<<

				for (j = this.ps.length - 1; this.ps[j].bitOffset + bits > this.bits; j--) {

					this.ps[j].textContent = "";
				}

				maxj = j;
			} else {

				for (j = maxj; j < this.ps.length - 1 && this.ps[j].bitEndOffset + bits < this.bits; j++) {

					this.ps[j].textContent = _textContent.slice(this.ps[j].textOffset, this.ps[j].textEndOffset);
				}
			}

			pad = 0;

			if (bits <= 0) {

				bits = this.bits - this.ps.last.bitEndOffset - bits;

				switch (this.ps.last.encoding) {
					case "Alphanum":
						pad += Math.floor(bits / 11) * 2;

						if (bits % 11 >= 6) {
							pad++;
						}
						break;
					case "Num":
						pad += Math.floor(bits / 10) * 3;	

						if (bits % 10 >= 4) {
							pad++;
						}
						if (bits % 10 >= 7) {
							pad++;
						}
						break;
					default:
						pad += Math.floor(bits / 8);
						break;
				}

				this.ps[j].textContent = _textContent.slice(this.ps.last.textOffset, this.ps.last.textEndOffset) + " ".repeat(pad);

			} else {

				bits = this.bits - this.ps[j].bitOffset - bits;

				switch (this.ps[j].encoding) {
					case "Alphanum":
						pad += Math.floor(bits / 11) * 2;

						if (bits % 11 >= 6) {
							pad++;
						}
						break;
					case "Num":
						pad += Math.floor(bits / 10) * 3;

						if (bits % 10 >= 4) {
							pad++;
						}
						if (bits % 10 >= 7) {
							pad++;
						}
						break;
					default:
						pad += Math.floor(bits / 8);
						break;
				}

				this.ps[j].textContent = _textContent.substr(this.ps[j].textOffset, pad);

				this.padp.textContent = " ".repeat(this.ps.last.textEndOffset - this.ps[j].textOffset - pad - offset + this.__focused.textEndOffset);
			}

			// CHECK vvvv

			let check = this.bits;

			for (i = 0; i < this.ps.length; i++) {

				len_ = this.ps[i].textContent.length;

				switch (this.ps[i].encoding) {
					case "Alphanum":
						check -= (Math.floor(len_ / 2) * 11) + ((len_ % 2) * 6);
						break;
					case "Num":
						check -= Math.floor(len_ / 3) * 10;
	
						if (len_ % 3 === 2) {
							check -= 7;
						}
						if (len_ % 3 === 1) {
							check -= 4;
						}
						break;
					default:
						check -= len_ * 8;
						break;
				}
			}

			console.log("check:", check);

			this.textarea.parentElement.scrollTop = _scrollTop;

			_offset = offset;
		};

		window.addEventListener("mouseup", () => {
			if (grabber) {
				grabber = 0;

				Charmap.textarea.classList.remove("disabled");
			} else {
				Charmap.grabberLeft.remove();
				Charmap.grabberRight.remove();
			}
		});
	}

	constructor (data) {
		this.fillWithData(data);
		this.remarkup();
		Charmap.bits = Math.ceil(Charmap.ps.last.bitEndOffset / 8) * 8;
	}

	fillWithData (dblocks) {
		if (dblocks instanceof Array) {

			let i;

			if (Charmap.ps.length < dblocks.length) {

				for (i = Charmap.ps.length; i < dblocks.length; i++) {
					Charmap.ps[i] = document.createElement("p");

					Charmap.ps[i].onclick = () => {
						Charmap.__focused = Charmap.ps[i];

						Charmap.ps[i].before(Charmap.grabberLeft);
						Charmap.ps[i].after(Charmap.grabberRight);
					};

					// Charmap.ps[i].datalock = !Charmap.ps[i].datalock;
					// Charmap.ps[i].classList.toggle("fixed", Charmap.ps[i].datalock);
				}

			} else if (Charmap.ps.length > dblocks.length) Charmap.ps.splice(dblocks.length, Charmap.ps.length - dblocks.length);

			for (i = 0; i < Charmap.ps.length; i++) {
				if (dblocks !== "") {
					Charmap.ps[i].textContent = dblocks[i].chars;

					Charmap.ps[i].encoding = dblocks[i].encoding;
					Charmap.ps[i].setAttribute("encoding", dblocks[i].encoding);
				}
			}
			
		} else throw new Error("..."); // <<<
	}

	remarkup () {

		let len = 0, bits = 0;

		for (let i = 0; i < Charmap.ps[i].length; i++) {

			Charmap.ps[i].childIndex = i;

			Charmap.ps[i].textOffset = len;
			Charmap.ps[i].bitOffset = bits;

			len += Charmap.ps[i].textContent.length;

			switch (dblocks[i].encoding) {
				case "Alphanum":
					bits += (Math.floor(dblocks[i].chars.length / 2) * 11) + ((dblocks[i].chars.length % 2) * 6);
					break;
				case "Num":
					bits += Math.floor(dblocks[i].chars.length / 3) * 10;

					if (dblocks[i].chars.length % 3 === 2) {
						bits += 7;
					} else if (dblocks[i].chars.length % 3 === 1) {
						bits += 4;
					}
					break;
				default:
					bits += dblocks[i].chars.length * 8;
					break;
			}

			Charmap.ps[i].textEndOffset = len;
			Charmap.ps[i].bitEndOffset = bits;

			Charmap.textarea.appendChild(Charmap.ps[i]);
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