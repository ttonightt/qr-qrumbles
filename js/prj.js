"use strict";

class ScalableBox {
	constructor (parentWidth, parentHeight, width, height) {
		this.cwidth = width;
		this.cheight = height;
		this.pwidth = parentWidth;
		this.pheight = parentHeight;

		this.toScale(1);

		if (this.scale <= 0) {
			throw new Error("Parent box must be larger than child's one!");
		} else if (this.scale < 2) {
			this.scalemin = 1;
		} else {
			this.scalemin = this.scale - 2;
		}

		this.scalemax = this.scale + 8;

		this.angle = 0; // mesures in deg
	}

	toScale (value, px, py) {
		if (typeof value === "number") {

			if (typeof px === "number" && typeof py === "number") {
				if (this.scalemin <= value && value <= this.scalemax) {
					this.cx = Math.floor(px - ((px - this.cx) * value / this.scale));
					this.cy = Math.floor(py - ((py - this.cy) * value / this.scale));
					this.scale = value;
				}
			} else if (value === 1) {

				if (this.pheight < this.pwidth) {
					this.scale = Math.floor((this.pheight - 40) / this.cheight);
				} else {
					this.scale = Math.floor((this.pwidth - 40) / this.cwidth);
				}
				this.cx = Math.floor((this.pwidth - (this.scale * this.cwidth)) / 2);
				this.cy = Math.floor((this.pheight - (this.scale * this.cheight)) / 2);
			} else {
				throw new Error("..."); // ????
			}

		} else {
			throw new Error("..."); // <<<
		}
	}

	toMove (cx, cy) {
		this.cx = cx;
		this.cy = cy;
	}

	toRotate (angle) {
		this.angle = angle % 360;
	}
}

class Project {
	static list = [];
	static __index = -1;

	static current;

	static add (name, settings, refmx) {
		this.current = new Project(name, settings, refmx);
		this.list.push(this.current);
		this.__index = this.list.length - 1;
	}

	static remove (qrti) {
		if (qrti || qrti === 0) {
			if (this.__index === qrti) {
				this.current = this.list[qrti - 1] || this.list[qrti + 1];
			}
			delete this.list[qrti];
		}
	}

	static switchTo (qrti) {
		if (qrti === this.__index) return;
		this.__index = qrti;
		this.current = this.list[qrti];

		QRT.canvas.width = Project.current.qrt.modules;
		QRT.canvas.height = Project.current.qrt.modules;
		Project.canvasWrap.style.width = Project.current.box.cwidth * Project.current.box.scale + "px";
		Project.canvasWrap.style.height = Project.current.box.cheight * Project.current.box.scale + "px";
		Project.canvasWrap.style.left = Project.current.box.cx + "px";
		Project.canvasWrap.style.top = Project.current.box.cy + "px";
		// ...
	}

	static canvasArea;
	static canvasWrap;

	static init (canvasArea, canvasWrap) {

		if (canvasArea instanceof HTMLElement) {
			this.canvasArea = canvasArea;
		} else {
			throw new Error("..."); // <<<
		}

		if (canvasWrap instanceof HTMLElement) {
			this.canvasWrap = canvasWrap;
		} else {
			throw new Error("..."); // <<<
		}

		// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

		this.canvasArea.onwheel = e => {
			Project.current.box.toScale(Project.current.box.scale - Math.sign(e.deltaY), e.clientX, e.clientY - 100);

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

		this.canvasArea.onmousedown = e => {

			mouseDown = e.button + 1;
			_offsetX = e.offsetX;
			_offsetY = e.offsetY;

			_matrix = new Uint8ArrayX2(this.current.qrt.matrix);

			if (mouseDown === 2) {
				this.canvasArea.style.cursor = "move";
			} else if (e.target === QRT.canvas) {
				const bradius = Tools.list[Tools.value].radius || Tools.list[Tools.value].width || 1;

				if (bradius % 2) {
					_offsetX = Math.floor(e.offsetX / Project.current.box.scale);
					_offsetY = Math.floor(e.offsetY / Project.current.box.scale);
				} else {
					_offsetX = Math.round(e.offsetX / Project.current.box.scale);
					_offsetY = Math.round(e.offsetY / Project.current.box.scale);
				}

				if (Tools.value === "brush") {
					area = new Rect8(_offsetX, _offsetY, _offsetX, _offsetY, Math.floor(Tools.list.brush.radius / 2));
					if (Tools.list.brush.radius === 1) {
						this.current.qrt.applyPointOn(_offsetX, _offsetY, (mouseDown - 3) / -2);
					} else {
						this.current.qrt.applySpriteOn(_offsetX, _offsetY, QRT.sprites.circles[Tools.list.brush.radius], (mouseDown - 3) / -2);
					}
				}
			}
		};

		QRT.canvas.onmousemove = e => {
			const bradius = Tools.list[Tools.value].radius || Tools.list[Tools.value].width || 1;

			x = e.offsetX;
			y = e.offsetY;

			if (e.target === this.canvasArea) {
				x -= this.current.box.cx;
				y -= this.current.box.cy;
			}

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
				this.current.box.toMove(e.clientY - 100 - _offsetY, e.clientX - _offsetX);
				this.canvasWrap.style.top = this.current.box.cx + "px";
				this.canvasWrap.style.left = this.current.box.cy + "px";
			} else if (mouseDown % 2) {
				switch (Tools.value) {
					case "brush":
						const rect = this.current.qrt.drawLineOn(_offsetX, _offsetY, x, y, (mouseDown - 3) / -2, QRT.sprites.circles[Tools.list.brush.radius]);
						this.current.qrt.applyLineOn(_offsetX, _offsetY, x, y, (mouseDown - 3) / -2, QRT.sprites.circles[Tools.list.brush.radius]);
						_offsetX = x;
						_offsetY = y;

						area[0] = Math.min(area[0], rect[0]);
						area[1] = Math.min(area[1], rect[1]);
						area[2] = Math.max(area[2], rect[2]);
						area[3] = Math.max(area[3], rect[3]);
						break;
					case "line":
						if (area) this.current.qrt.updateCanvasX(area);

						area = this.current.qrt.drawLineOn(
							Math.floor(_offsetX),
							Math.floor(_offsetY),
							x, y, (mouseDown - 3) / -2, QRT.sprites.circles[Tools.list.line.width]
						);

						break;
					case "circle":
						if (area) this.current.qrt.updateCanvasX(area);

						area = this.current.qrt.drawEllipseOn(
							Math.floor(_offsetX),
							Math.floor(_offsetY),
							x, y, e.ctrlKey, e.shiftKey, (mouseDown - 3) / -2
						);
				}
			} else if (bradius === 1) {
				this.current.qrt.updateCanvasX(area);
				this.current.qrt.drawPointOn(x, y, 1);
				area = new Rect8(x, y, x, y);
			} else {
				this.current.qrt.updateCanvasX(area);
				area = this.current.qrt.drawSpriteOn(x, y, QRT.sprites.circles[bradius], 1);
			}

			if (OneTitle.shown) {
				OneTitle.hide();
			}
		};

		this.canvasArea.onmouseup = e => {
			if (mouseDown === 2) {
				this.canvasArea.style.cursor = "";
			} else {
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
							QRT.sprites.circles[Tools.list.line.width]
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
			}

			this.current.qrt.updateCanvasX(new Rect8(0, 0, 255, 255));
			area = 0;
			mouseDown = 0;
		};

		this.canvasWrap.onmouseleave = () => {
			if (mouseDown % 2 === 0) {
				this.current.qrt.updateCanvasX(area);
			}
		};

		this.canvasArea.oncontextmenu = e => {
			e.preventDefault();
		};
	}

	constructor (name, settings, refmx) {
		if (!(Project.canvasArea && Project.canvasWrap)) {
			throw new Error("Project (class) was not initialize!");
		}

		this.name = name + "";

		this.qrt = new QRT(settings, refmx);
		QRT.canvas.width = this.qrt.modules;
		QRT.canvas.height = this.qrt.modules;
		this.qrt.updateCanvasX(new Rect8(0, 0, 255, 255));

		this.box = new ScalableBox(
			Project.canvasArea.clientWidth,
			Project.canvasArea.clientHeight,
			QRT.canvas.width,
			QRT.canvas.height
		);

		this.fitCanvasArea();

		this.history = new History();

		this.status = 0; // 0 - unsaved at all, 1 - saved as and up to date, 2 - saved as and modified
	}

	fitCanvasArea () {
		this.box.toScale(1);
		Project.canvasWrap.style.width = this.box.scale * this.box.cwidth + "px";
		Project.canvasWrap.style.height = this.box.scale * this.box.cheight + "px";
		Project.canvasWrap.style.left = this.box.cx + "px";
		Project.canvasWrap.style.top = this.box.cy + "px";
		// CWMap canvas ...
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
			Project.current.qrt.updateCanvasX(new Rect8(0, 0, 255, 255));
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
			Project.current.qrt.updateCanvasX(new Rect8(0, 0, 255, 255));
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
}