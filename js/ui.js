const OneTitle = {
	elem: document.getElementById("onetitle"),
	content: document.querySelector("#onetitle > span"),
	shown: 0,
	pivot: 0,
	__timer: 0,
	show: (x, y, message, prefs = {}) => {
		OneTitle.pivot = prefs.pivot || OneTitle.pivot;
		const anim = prefs.anim || "blink";
		const timeOut = prefs.timeOut || 0;

		OneTitle.elem.setAttribute("data-anim", anim);
		if (message) OneTitle.content.textContent = message;
		OneTitle.elem.classList.add("visible");

		if (typeof x === "number" && typeof y === "number") {
			OneTitle.elem.style.left = x - (Math.floor(OneTitle.pivot / 3) * OneTitle.elem.clientWidth / 2) + "px";
			OneTitle.elem.style.top = y - ((OneTitle.pivot % 3) * OneTitle.elem.clientHeight / 2) + "px";
		}

		if (OneTitle.__timer) {
			clearTimeout(OneTitle.__timer);
		}

		if (parseInt(timeOut, 10) > 50) {
			OneTitle.__timer = setTimeout(() => {
				OneTitle.hide();
			}, timeOut);
			return;
		}

		OneTitle.shown = 1;
	},
	move: (x, y) => {
		OneTitle.elem.style.left = x - (Math.floor(OneTitle.pivot / 3) * OneTitle.elem.clientWidth / 2) + "px";
		OneTitle.elem.style.top = y - ((OneTitle.pivot % 3) * OneTitle.elem.clientHeight / 2) + "px";
	},
	log: message => {
		OneTitle.content.textContent = message;
	},
	hide: () => {
		OneTitle.elem.classList.remove("visible");
		OneTitle.shown = 0;
	},
};

// POPUPS vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

const popupElements = document.querySelectorAll("#popups .popup");
let popupBindings = {};

const popupCallers = document.querySelectorAll(".call-popup");

for (let i = 0; i < popupElements.length; i++) {
	popupElements[i].popen = () => {
		popupElements[i].classList.add("active");
		popupElements[0].parentElement.classList.add("visible");
	};

	popupBindings[popupElements[i].getAttribute("data-popup").replaceAll("-", "")] = popupElements[i];
	popupElements[i].querySelector("i#this-close").addEventListener("click", () => {
		popupElements[i].classList.remove("active");
		popupElements[0].parentElement.classList.remove("visible");
	});
}

for (let i = 0; i < popupCallers.length; i++) {
	const caller = popupCallers[i];
	caller.addEventListener("click", () => {
		popupBindings[caller.getAttribute("data-popup").replaceAll("-", "")].classList.add("active");
		popupElements[0].parentElement.classList.add("visible");
	});
}



class ScalableBox {
	constructor (parentWidth, parentHeight, width, height) {
		this.cwidth = width;
		this.cheight = height;
		this.pwidth = parentWidth;
		this.pheight = parentHeight;

		this.toScale(1);

		if (this.scale <= 0) {
			throw new Error("Parent box must be larger than child's one!");
		} else if (this.scale === 1) {
			this.scalemin = this.scale;
		} else {
			this.scalemin = this.scale - 1;
		}
	}

	toScale (value, cx, cy) {
		if (typeof value === "number") {

			if (typeof cx === "number" && typeof cy === "number") {
				this.scale = value;
				this.cx = Math.floor(cx - ((cx - this.cx) * value / this.scale));
				this.cy = Math.floor(cy - ((cy - this.cy) * value / this.scale));
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

	toMove (dcx, dcy) {
		this.cx += dcx;
		this.cy += dcy;
	}
}

class Project {
	static list = [];
	static __index = -1;

	static get current () {
		if (this.__index >= 0) {
			return this.list[this.__index];
		}
	}

	static add (name, settings) {
		this.list.push(new Project(name, settings));
		this.__index = this.list.length - 1;
	}

	static remove (index) {
		this.list.splice(index, 1);
		if (this.__index >= index) {
			this.__index--;
		}
	}

	static switchTo (index) {
		if (index === this.__index) return;
		this.__index = index;
		QRT.canvas.width = Project.current.qrt.modules;
		QRT.canvas.height = Project.current.qrt.modules;
		Project.canvasWrap.style.width = Project.current.box.cwidth * Project.current.box.scale + "px";
		Project.canvasWrap.style.height = Project.current.box.cheight * Project.current.box.scale + "px";
		Project.canvasWrap.style.left = Project.current.box.cx + "px";
		Project.canvasWrap.style.top = Project.current.box.cy + "px";
		// ...
	}
	
	static tabCallersContainer;
	static canvasArea;
	static canvasWrap;

	static init (tabCallersContainer, canvasArea, canvasWrap, qrtCanvas) {
		if (tabCallersContainer instanceof HTMLElement) {
			this.tabCallersContainer = tabCallersContainer;
		} else {
			throw new Error("..."); // <<<
		}

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

		QRT.init(qrtCanvas);

		// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

		let mouseDown = 0;
		let _offsetX, _offsetY;
		let _phantomX = 1, _phantomY = 1;
		let areaToClear = 0;

		this.canvasArea.onmousedown = e => {

			mouseDown = e.button + 1;
			_offsetX = e.offsetX;
			_offsetY = e.offsetY;

			if (mouseDown === 2) {
				this.canvasArea.style.cursor = "move";
			} else if (e.target === QRT.canvas) {
				_offsetX = Math.floor(_offsetX / Project.current.box.scale);
				_offsetY = Math.floor(_offsetY / Project.current.box.scale);
				if (Tools.value === "brush") this.current.qrt.applyPointOn(_offsetX, _offsetY, (mouseDown - 3) / -2);
			}
		};

		this.canvasArea.onmousemove = e => {
			let _x = Math.floor(e.offsetX / Project.current.box.scale), _y = Math.floor(e.offsetY / Project.current.box.scale);

			if (mouseDown === 2) {
				this.canvasWrap.style.top = (e.clientY - 100 - _offsetY) + "px";
				this.canvasWrap.style.left = (e.clientX - _offsetX) + "px";
			} else if (e.target === QRT.canvas) {
				if (mouseDown % 2) {
					switch (Tools.value) {
						case "brush":
							this.current.qrt.drawLineOn(_offsetX, _offsetY, _x, _y, (mouseDown - 3) / -2, Tools.list.brush.radius, false);
							this.current.qrt.applyLineOn(_offsetX, _offsetY, _x, _y, (mouseDown - 3) / -2, Tools.list.brush.radius, false);
							_offsetX = _x;
							_offsetY = _y;
							break;
						case "line":
							if (areaToClear) this.current.qrt.updateCanvasX(areaToClear);

							areaToClear = this.current.qrt.drawLineOn(
								Math.floor(_offsetX),
								Math.floor(_offsetY),
								_x, _y, (mouseDown - 3) / -2, Tools.list.line.width
							);

							break;
						case "circle":
							if (areaToClear) this.current.qrt.updateCanvasX(areaToClear);

							areaToClear = this.current.qrt.drawEllipseOn(
								Math.floor(_offsetX),
								Math.floor(_offsetY),
								_x, _y, e.ctrlKey, e.shiftKey, (mouseDown - 3) / -2
							);
					}
				} else if ((this.current.qrt.matrix.x2get(_x, _y) ^ this.current.qrt.getMaskBit(_x, _y)) === 1) {
					this.current.qrt.drawPointOn(_phantomX, _phantomY, 0);
					_phantomX = 1;
					_phantomY = 1;
				} else {
					this.current.qrt.drawPointOn(_phantomX, _phantomY, 0);
					this.current.qrt.drawPointOn(_x, _y, 1);
					_phantomX = _x;
					_phantomY = _y;
				}
			}

			if (OneTitle.shown) {
				OneTitle.hide();
			}
		};

		this.canvasArea.onmouseup = e => {
			if (mouseDown === 2) {
				this.canvasArea.style.cursor = "";
				this.current.qrt.drawPointOn(_phantomX, _phantomY, 0);
			} else {
				switch (Tools.value) {
					case "line":
						this.current.qrt.applyLineOn(Math.floor(_offsetX),
												Math.floor(_offsetY),
												Math.floor(e.offsetX / Project.current.box.scale),
												Math.floor(e.offsetY / Project.current.box.scale),
												(mouseDown - 3) / -2, Tools.list.line.width);
						break;
					case "circle":
						this.current.qrt.applyEllipseOn(	Math.floor(_offsetX),
													Math.floor(_offsetY),
													Math.floor(e.offsetX / Project.current.box.scale),
													Math.floor(e.offsetY / Project.current.box.scale),
													e.ctrlKey, e.shiftKey, (mouseDown - 3) / -2);
						break;
				}
			}
			if (mouseDown != 0) {
				_phantomX = 1;
				_phantomY = 1;
			}
			mouseDown = 0;
		};

		this.canvasWrap.onmouseleave = () => {
			this.current.qrt.drawPointOn(_phantomX, _phantomY, 0);
			_phantomX = 1;
			_phantomY = 1;
		};

		this.canvasArea.oncontextmenu = e => {
			e.preventDefault();
		};
	}

	constructor (name, settings) {
		if (!(Project.tabCallersContainer && Project.canvasArea && Project.canvasWrap)) {
			throw new Error("Project (class) was not initialize!");
		}

		this.name = name + "";

		this.qrt = new QRT(settings);
		QRT.canvas.width = this.qrt.modules;
		QRT.canvas.height = this.qrt.modules;
		this.qrt.updateCanvasX();

		this.box = new ScalableBox(
			Project.canvasArea.clientWidth,
			Project.canvasArea.clientHeight,
			Project.canvasWrap.clientWidth,
			Project.canvasWrap.clientHeight
		);

		this.fitCanvasArea();

		this.tabCaller = document.createElement("li");
	}

	fitCanvasArea () {
		this.box.toScale(1);
		Project.canvasWrap.style.width = this.box.scale * this.box.cwidth + "px";
		Project.canvasWrap.style.height = this.box.scale * this.box.cheight + "px";
		Project.canvasWrap.style.left = this.box.cx + "px";
		Project.canvasWrap.style.top = this.box.cy + "px";
		// CWMap canvas ...
	}
}