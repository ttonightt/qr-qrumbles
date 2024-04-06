"use strict";

import QR from "./qr/qr";
import QRMX, {Qanvas} from "./qr/qrmx";
import {QRTable} from "./qr/qr-tables.js";
import {Rect8} from "./tiny-usefuls.js";
import {Charmap} from "./charmap/charmap";

import React from "react";

export class ZoomArea extends React.Component {

	static defaultProps = {
		padding: 40
	};

	constructor (props) {
		super(props);

		this.state = {
			cwidth: 0,
			cheight: 0,
			cx: 0,
			cy: 0
		};

		this.ref = React.createRef();
		this.boxRef = React.createRef();
	}

	componentDidMount () {

		this.prect = this.ref.current.getBoundingClientRect();

		this.initBox();
	}

	initBox () {
		this.crect = this.boxRef.current.getBoundingClientRect();

		this.fitBox();

		if (this.scale <= 0) {
			throw new Error("Parent box must be larger than child's one!");
		} else if (this.scale < 2) {
			this.scalemin = 1;
		} else {
			this.scalemin = this.scale - 2;
		}

		this.scalemax = this.scale + 8;
	}

	fitBox () {

		if (this.prect.height < this.prect.width) {

			this.scale = Math.floor((this.prect.height - 40) / this.crect.height);
		} else {
			this.scale = Math.floor((this.prect.width - 40) / this.crect.width);
		}

		this.cx = Math.floor((this.prect.width - (this.scale * this.crect.width)) / 2);
		this.cy = Math.floor((this.prect.height - (this.scale * this.crect.height)) / 2);

		this.updateStates();
	}

	updateStates () {
		this.setState({
			cx: this.cx + "px",
			cy: this.cy + "px",
			cwidth: this.scale * this.crect.width + "px",
			cheight: this.scale * this.crect.height + "px"
		});
	}

	scaleOn (coef, px, py) {

		if (this.scalemin <= coef && coef <= this.scalemax) {

			this.cx = Math.floor(px - ((px - this.cx) * coef / this.scale));
			this.cy = Math.floor(py - ((py - this.cy) * coef / this.scale));

			this.scale = coef;
		}

		this.updateStates();
	}

	render () {

		let x0, y0;

		return (
			<div className="scalable-workspace" ref={this.ref}
				onWheel={
					e => this.scaleOn(
						this.scale - Math.sign(e.deltaY),
						e.clientX - this.prect.x,
						e.clientY - this.prect.y
					)}

				onMouseDown={e => {

					if (e.button === 2) {

						x0 = e.nativeEvent.offsetX;
						y0 = e.nativeEvent.offsetY;
					}
				}}

				onMouseMove={e => {

					this.set
				}}
			>
				<div className="scalable-box" ref={this.boxRef} style={{

					width: this.state.cwidth,
					height: this.state.cheight,
					top: this.state.cy,
					left: this.state.cx

				}}>{this.props.children}</div>
			</div>
		);
	}
}

export class Project {

	static list = [];
	static index = -1;

	static current;

	static qanvas = <Qanvas/>;
	static workspace = <ZoomArea>{this.qanvas}</ZoomArea>;

	/* static init () {

		this.canvasArea.onwheel = e => {
			Project.current.box.toScale(Project.current.box.scale - Math.sign(e.deltaY), e.clientX - this.current.box.px, e.clientY - this.current.box.py);

			this.canvasWrap.style.width = Project.current.box.cwidth * Project.current.box.scale + "px";
			this.canvasWrap.style.height = Project.current.box.cheight * Project.current.box.scale + "px";
			this.canvasWrap.style.left = Project.current.box.cx + "px";
			this.canvasWrap.style.top = Project.current.box.cy + "px";
		};

		let mouseDown = 0;
		let _offsetX, _offsetY;
		let x, y, _x, _y;
		let area = 0;
		let _matrix;

		QR.canvas.onmousedown = e => {

			mouseDown = e.button + 1;
			// _offsetX = e.clientX - this.current.box.px - this.current.box.cx;
			// _offsetY = e.clientY - this.current.box.py - this.current.box.cy;
			_offsetX = e.offsetX;
			_offsetY = e.offsetY;

			_matrix = new Uint8ArrayX2(this.current.qrt.matrix);

			if (mouseDown === 2) {
				this.canvasArea.style.cursor = "move";
			} else {
				const bradius = Tools.list[Tools.value].radius || Tools.list[Tools.value].width || 1;

				if (bradius % 2) {
					_offsetX = Math.floor(_offsetX / Project.current.box.scale);
					_offsetY = Math.floor(_offsetY / Project.current.box.scale);
				} else {
					_offsetX = Math.round(_offsetX / Project.current.box.scale);
					_offsetY = Math.round(_offsetY / Project.current.box.scale);
				}

				if (Tools.value === "brush") {
					area = new Rect8(_offsetX, _offsetY, _offsetX, _offsetY, Math.floor(Tools.list.brush.radius / 2));
					if (Tools.list.brush.radius === 1) {
						this.current.qrt.applyPointOn(_offsetX, _offsetY, (mouseDown - 3) / -2);
					} else {
						this.current.qrt.applySpriteOn(_offsetX, _offsetY, QR.sprites.circles[Tools.list.brush.radius], (mouseDown - 3) / -2);
					}
				}
			}
		};

		QR.canvas.onmousemove = e => {
			const bradius = Tools.list[Tools.value].radius || Tools.list[Tools.value].width || 1;

			// x = e.clientX - this.current.box.px - this.current.box.cx;
			// y = e.clientY - this.current.box.py - this.current.box.cy;
			x = e.offsetX;
			y = e.offsetY;

			if (bradius % 2) {
				x = Math.floor(x / this.current.box.scale);
				y = Math.floor(y / this.current.box.scale);
			} else {
				x = Math.round(x / this.current.box.scale);
				y = Math.round(y / this.current.box.scale);
			}

			if (Math.floor(x) === _x && Math.floor(y) === _y) return;

			_x = x;
			_y = y;

			if (mouseDown === 2) {
				this.current.box.toMove(e.clientX - this.current.box.px - _offsetX, e.clientY - this.current.box.py - _offsetY);
				this.canvasWrap.style.top = this.current.box.cy + "px";
				this.canvasWrap.style.left = this.current.box.cx + "px";
			} else if (mouseDown % 2) {
				switch (Tools.value) {
					case "brush":
						const rect = this.current.qrt.drawLineOn(_offsetX, _offsetY, x, y, (mouseDown - 3) / -2, QR.sprites.circles[Tools.list.brush.radius]);
						this.current.qrt.applyLineOn(_offsetX, _offsetY, x, y, (mouseDown - 3) / -2, QR.sprites.circles[Tools.list.brush.radius]);
						_offsetX = x;
						_offsetY = y;

						area[0] = Math.min(area[0], rect[0]);
						area[1] = Math.min(area[1], rect[1]);
						area[2] = Math.max(area[2], rect[2]);
						area[3] = Math.max(area[3], rect[3]);
						break;
					case "line":
						if (area) this.current.qrt.updateCanvas(area);

						area = this.current.qrt.drawLineOn(
							Math.floor(_offsetX),
							Math.floor(_offsetY),
							x, y, (mouseDown - 3) / -2, QR.sprites.circles[Tools.list.line.width]
						);

						break;
					case "circle":
						if (area) this.current.qrt.updateCanvas(area);

						area = this.current.qrt.drawEllipseOn(
							Math.floor(_offsetX),
							Math.floor(_offsetY),
							x, y, e.ctrlKey, e.shiftKey, (mouseDown - 3) / -2
						);
				}
			} else if (bradius === 1) {
				this.current.qrt.updateCanvas(area);
				this.current.qrt.drawPointOn(x, y, 1);
				area = new Rect8(x, y, x, y);
			} else {
				this.current.qrt.updateCanvas(area);
				area = this.current.qrt.drawSpriteOn(x, y, QR.sprites.circles[bradius], 1);
			}

			if (OneTitle.shown) {
				OneTitle.hide();
			}
		};

		window.onmouseup = e => {
			if (mouseDown === 2) {
				this.canvasArea.style.cursor = "";
			} else if (mouseDown !== 0) {
				switch (Tools.value) {
					case "brush":
						this.current.history.push(new History.BitmapArea(
							this.current.qrt.matrix,
							_matrix,
							area
						));
						break;
					case "line":
						this.current.qrt.applyLineOn(
							_offsetX,
							_offsetY,
							x,
							y,
							(mouseDown - 3) / -2,
							QR.sprites.circles[Tools.list.line.width]
						);

						this.current.history.push(new History.BitmapArea(
							this.current.qrt.matrix,
							_matrix,
							area
						));
						break;
					case "circle":
						this.current.qrt.applyEllipseOn(
							Math.floor(_offsetX),
							Math.floor(_offsetY),
							x,
							y,
							e.ctrlKey, e.shiftKey, (mouseDown - 3) / -2
						);

						this.current.history.push(new History.BitmapArea(
							this.current.qrt.matrix,
							_matrix,
							area
						));
						break;
				}

				this.current.status = (this.current.status * 2) & 3;

				this.current.qrt.applyECDataOn(this.current.qrt.encodeECCodewords(QR.uninterleave(this.current.qrt.scanDataFrom(), this.current.qrt.info.g1Blocks, this.current.qrt.info.g2Blocks, this.current.qrt.info.g1DataBytesPerBlock)));
				this.current.qrt.updateCanvas(new Rect8(0, 0, 255, 255));
				area = 0;
				mouseDown = 0;
			}
		};

		this.canvasWrap.onmouseleave = () => {
			if (mouseDown % 2 === 0) {
				this.current.qrt.updateCanvas(area);
			}
		};

		this.canvasArea.oncontextmenu = e => {
			e.preventDefault();
		};
	} */

	static createBlank (name, params) {
		this.current = new Project(name, params);

		console.log(this.current);

		this.qanvas.setState({
			version: this.current.qrInfo.version,
			modules: this.current.qrInfo.modules
		});

		this.list.push(this.current);
		this.__index = this.list.length - 1;
	}

	static createFromTQRT (name, params, refmx) {
		// this.current = new Project(name, params, refmx);
		// this.current.qrmx = QR.createFromTQRT(params, );

		// this.list.push(this.current);
		// this.__index = this.list.length - 1;
	}

	constructor (name, params) {

		this.name = name + "";

	// QR MODULEBLOCK CREATING

		this.qrInfo = new QRTable(params);
		this.qr = new QR(this.qrInfo);

		this.qrmx = new QRMX(this.qrInfo, {maskPattern: params.maskPattern});

		this.qrmx.onCellChange = (offset, cw, bit) => {

			this.qr.codewords[cw] ^= 1 << bit;

			let i = Math.floor(cw / 20);

			for (i; this.datablocks[i].bitOffset < offset; i++);

			this.Histo
			this.datablocks[i].
		};

		// MODULES COORDS >> CODEWORD BIT
		const skipsPrecidingColumn = new Uint16Array(this.qrInfo.matrixDataDoubleColumns); // SKIPS_PRECIDING_MODULE_PATTERN є [0, 7] << 11 + SKIPS є [0, ~1400]
		const skipsPrecidingModulePatterns = new Uint8Array(7); // SKIPS є [0, 70]

		// CODEWORD >> MODULES COORDS
		const codewordShiftFromColumnStart = new Uint8Array(this.qrInfo.dataBytes); // SKIPS_WITHIN_MATRIX_COLUMN є [0, 70] * 3 + COLUMN_TRANSLATION є [0, 2]
		const codewordColumnFirstBitCoords = new Uint8Array(this.qrInfo.g1BytesPerBlock + (this.qrInfo.g2Blocks ?? 0)); // X_COORD є [0, modules) * MODULES +  Y_COORD є [0, modules)

		// CODEWORD >> DATABLOCK
		const datablockCodewordsGuides = [0];

		const applyCodewordsOnMatrix = cwf => {

			let col, dc, step;

			const g1Bytes = this.info.g1BytesPerBlock * this.info.g1Block;
			const g2BytesPerBlock = this.info.g1BytesPerBlock + 1;

			if (cwf.offset > g1Bytes) {

				col = (cwf.offset + this.info.g1Blocks) % g2BytesPerBlock;
				//     ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ OR cwf.offset - g1Bytes
				dc = (cwf.offset + this.info.g1Blocks - col) / g2BytesPerBlock;
			} else {
				col = cwf.offset % this.info.g1BytesPerBlock;
				dc = (cwf.offset - col) / this.info.g1BytesPerBlock;
			}

			for (let c = 0; c < this.info.g1BytesPerBlock; c++) { // iterates "columns"

				const coords = codewordColumnFirstBitCoords[(c + col) % this.info.g1BytesPerBlock];

				let y = (coords - x) / this.qrInfo.modules,
					x = coords % this.qrInfo.modules;

				xm2 = x % 2;
				xf2 = x - xm2;
				x2 = xf2 / 2;
				x2m2 = x2 % 2;

				if (c + col >= step) dc ...;

				const fcw = codewordShiftFromColumnStart[cwf.offset + c];

				if (fcw % 3 === 0) {

					y -= v * (
						(dc * 4) + // codeword y shift
						Math.floor(fcw / 6) + // skips y shift
						(x2 * ((fcw / 3) % 2)) // y shift in 1 if x shift in 1 is necessary
					);

					x += (fcw / 3) % 2; // x shift in 1 module
				} else {

					const spcc = skipsPrecidingColumn[Math.floor((this.qrInfo.modules - x - 1) / 2)];
					const dm = (dc * 8) - (y * 2) + (spcc % 2048) - skipsPrecidingModulePatterns[((spcc >> 11) * this.qrInfo.modules) + (y * 2) + xm2];

					x -= (fcw % 3) * 2;
					y = (x2m2 * (this.qrInfo.modules - 1)) - (v * Math.floor(dm / 2));
					v = (x2m2 * 2) - 1;
				}

				const mcSkips = matrixDoubleColumnSkips[(this.qrInfo.modules - x2 - 1) / 2];
				const mSkips = moduleSkipsWithinDoubleColumn[
					((((mcSkips >> 12) * this.qrInfo.modules) + y) * 2) + x2
				];

				this.qrmx.__goThroughDataModules(({x, y, j}) => {

					if (this.qrmx.matrix.x2get(x, y) % 4 < 2 && bit === 1) {

						this.qrmx.matrix.x2set(x, y, (cwf[j] >> (7 - (j % 8))) % 1);
					}

				}, {x, y, j: 0, maxj: 255});

				step = this.info.g1BytesPerBlock;

				this.qrmx.__goThroughDataModules(({x, y, j}) => {

					if (this.qrmx.matrix.x2get(x, y) % 4 < 2 && bit === 1) {

						this.qrmx.matrix.x2set(x, y, (cwf[j] >> (7 - (j % 8))) % 1);
					}

				}, {x, y, j: 0, maxj: 255});
			}

		};

		this.charmap.onBlockResized = ({b1textOffset, b1textOffset, b2textOffset, b2textEndOffset}) => {

			this.qr.encodeUsingDatablock();
			this.qr.encodeUsingDatablock(mod.b2textOffset, mod.b2textEndOffset, mod.b2bitOffset);

			applyCodewordsOnMatrix(xored);
		};

		this.charmap.onCharChanged = () => {

			this.qr.encode();
		};

		this.charmap.onBlockRemoved = () => {

			this.qr
		};

		this.charmap.onBlockMoved = () => {

			this.qr
		};

		this.charmap.onBlockInserted = () => {

			this.qr
		};
	}

	modifyCodewordsByMatrix (rect8) {

		for (let i = rect8.x; i < rect8.w; i++) {

			for (let j = rect8.y; j < rect8.h; j++) {

				const c = this.qrmx.getCell(i, j);
				
			}
		}
	}

	undo () {
		const commit = this.history.backup();

		if (commit instanceof History.BitmapArea) {
			if (commit.width === 1) {
				for (let i = 0; i < commit.height; i++) {
					this.qrt.matrix.x2set(commit.x0, i + commit.y0, this.qrt.matrix.x2get(commit.x0, i + commit.y0) ^ commit.matrix.x2get(0, i));
				}
			} else {
				for (let i = 0; i < commit.width; i++) {
					for (let j = 0; j < commit.height; j++) {
						this.qrt.matrix.x2set(i + commit.x0, j + commit.y0, this.qrt.matrix.x2get(i + commit.x0, j + commit.y0) ^ commit.matrix.x2get(i, j));
					}
				}
			}
			Project.current.qrt.updateCanvas(new Rect8(0, 0, 255, 255));
		}
	}

	redo () {
		const commit = this.history.nextup();

		if (commit instanceof History.BitmapArea) {
			if (commit.width === 1) {
				for (let i = 0; i < commit.height; i++) {
					this.qrt.matrix.x2set(commit.x0, i + commit.y0, this.qrt.matrix.x2get(commit.x0, i + commit.y0) ^ commit.matrix.x2get(0, i));
				}
			} else {
				for (let i = 0; i < commit.width; i++) {
					for (let j = 0; j < commit.height; j++) {
						this.qrt.matrix.x2set(i + commit.x0, j + commit.y0, this.qrt.matrix.x2get(i + commit.x0, j + commit.y0) ^ commit.matrix.x2get(i, j));
					}
				}
			}
			Project.current.qrt.updateCanvas(new Rect8(0, 0, 255, 255));
		}
	}

	save () {
		this.name = Controls.savingProjectName.value;

		const time = new Date();

		FilePortal.save(
			this.qrt.buildTQRT(
				this.name + "-" +
				time.getFullYear() + "-" +
				time.getMonth() + "-" +
				time.getDate() + "-" +
				time.getHours() + "-" +
				time.getMinutes() + "-" +
				time.getSeconds()
			)
		);

		this.status = 1;
	}

	// building - building - building - building - building - building - building

	buildTQRT (name) {
		const olen = this.matrix.length;
		let bstr = "";

		bstr += String.fromCharCode(this.info.version);
		bstr += String.fromCharCode(this.format5u);

		let mod = 7, num = 0o0, byte = 0b0;

		for (let y = 0; y < this.modules; y++) {
			for (let x = 0; x < this.modules; x++) {
				if (mod < 3) {
					num = (this.matrix.x2get(x, y) ^ this.getMaskBit(x, y)) % 8;
					mod = 3 - mod;
					byte += num >> mod;

					bstr += String.fromCharCode(byte);

					byte = num % (1 << mod);
					mod = 7 - mod;
					byte <<= mod;

					continue;
				}

				num = this.matrix.x2get(x, y) % 8;
				mod -= 3;
				byte += num << mod;
			}
		}

		// let str = "";

		// for (let k = 0; k < bstr.length; k++) {
		// 	str += bstr[k].charCodeAt(0).toString(2).padStart(7, "0") + " , ";
		// }

		// console.log(str);

		return new File([bstr], name + ".tqrt", {type: "image/tqrt"});
	}

	static readTQRT = (tqrt) => new Promise ((resolve, reject) => {
		const reader = new FileReader();
		const indata = {
			name: tqrt.name.slice(0, -5)
		};

		reader.readAsArrayBuffer(tqrt);

		reader.onload = () => {
			const arrbuff = reader.result;
			const arr = new Uint8Array(arrbuff); // НЕОБХІДНА ПЕРЕВІРКА НА ПРАВИЛЬНІСТЬ ДОВЖИНИ ВСІХ ДАНИХ

			indata.version = arr[0];

			const format = arr[1];

			if (0 <= format && format < 32) {
				indata.ecdepth = format >> 3;

				switch (indata.ecdepth) {
					case 1:
						indata.ecdepth = "L";
						break;
					case 0:
						indata.ecdepth = "M";
						break;
					case 3:
						indata.ecdepth = "Q";
						break;
					case 2:
						indata.ecdepth = "H";
				}

				indata.masktype = format % 4;

			} else throw new Error("Recieved file is corrupted! Inappropriate format bits of qrt was detected");

			let mod = 7, j = 2;

			const modules = ((indata.version * 4) + 17);
			indata.matrix = new Uint8ArrayX2(modules, modules);

			for (let i = 0; i < indata.matrix.length; i++) {
				if (mod < 3) {
					indata.matrix[i] = arr[j++] % (1 << mod);
					mod = 3 - mod;
					indata.matrix[i] <<= mod;
					mod = 7 - mod;
					indata.matrix[i] += arr[j] >> mod;
				} else {
					mod -= 3;
					indata.matrix[i] = (arr[j] >> mod) % 8;
				}
			}

			// INDATA WAS DEPRECATED vvvvv

			indata.datatype = indata.matrix.x2get(modules - 1, modules - 1) % 2;
			indata.datatype <<= 1;
			indata.datatype += indata.matrix.x2get(modules - 2, modules - 1) % 2;
			indata.datatype <<= 1;
			indata.datatype += indata.matrix.x2get(modules - 1, modules - 2) % 2;
			indata.datatype <<= 1;
			indata.datatype += indata.matrix.x2get(modules - 2, modules - 2) % 2;

			switch (indata.datatype) {
				case 2: case 4:
					resolve(indata);
					break;
				default:
					indata.datatype = 4;
					resolve(indata);
					// throw new Error("..."); // <<<
			}
		};
	});
}