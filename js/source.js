
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



const OneTitle = {
	elem: document.getElementById("onetitle"),
	content: document.querySelector("#onetitle > span"),
	_pivot: 0,
	show: (message, anim, x, y, pivot = OneTitle._pivot) => {
		OneTitle.elem.setAttribute("data-anim", anim);
		OneTitle.content.textContent = message;
		OneTitle.elem.classList.add("visible");

		OneTitle._pivot = pivot;
		if (typeof x == "number" && typeof y == "number") {
			OneTitle.elem.style.left = x + "px";
			OneTitle.elem.style.top = parseInt(y - ((pivot % 3) * OneTitle.elem.clientHeight / 2)) + "px";
		}
	},
	move: (x, y) => {
		OneTitle.elem.style.left = x + "px";
		OneTitle.elem.style.top = parseInt(y - ((pivot % 3) * OneTitle.elem.clientHeight / 2)) + "px";
	},
	log: message => {
		OneTitle.content.textContent = message;
	},
	hide: () => {
		OneTitle.elem.classList.remove("visible");
	},
};



const contrastSwitcher = document.getElementById("tocontrast");

contrastSwitcher.onchange = () => {
	if (contrastSwitcher.checked) {
		document.documentElement.classList.add("preview");
	} else {
		document.documentElement.classList.remove("preview");
	}
};

const projPortal = document.getElementById("proj-to-open");
const projPreview = document.getElementById("open-proj-preview");
const openProjTrigger = document.getElementById("open-proj-btn");

projPortal.onchange = (e) => {
	globalFileBuffer = e.target.files[0];
	projPreview.innerHTML = globalFileBuffer.name;
	projPortal.classList.add("selected");
};

openProjTrigger.onclick = () => {
	readTQRT(globalFileBuffer);

	openProjTrigger.parentElement.parentElement.classList.remove("active");
	openProjTrigger.parentElement.parentElement.parentElement.classList.remove("visible");

	projPortal.classList.remove("selected");
	projPreview.innerHTML = "";
	globalFileBuffer = 0;
};

const saveProjTrigger = document.getElementById("save-proj-btn");
const projName = document.getElementById("proj-name-to-save");

//  PROJECT SAVER vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

saveProjTrigger.onclick = () => {
	saveTQRT(globalDataBuffer);
};

// PROJECT SAVER ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// QRT CREATION vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

const canvas = document.getElementById("main");
const overmask = document.getElementById("overmask");
const cnvP = canvas.parentElement, cnvPP = canvas.parentElement.parentElement;

BASE.ctx = canvas.getContext("2d");
BASE.ctx.fillStyle = "#000000";

Controls.mask = new Control("radio", "mask", () => {
	BASE.current.applyFormatOn(Controls.mask.value, Controls.errcor.value, 4).updateCanvas();
});
Controls.errcor = new Control("radio", "errcor", () => {
	BASE.current.applyFormatOn(Controls.mask.value, Controls.errcor.value, 4).updateCanvas();
});
Controls.datatype = new Control("radio", "dtype", () => {
	BASE.current.applyDataTypeOn(Controls.datatype.value).updateCanvas();
});

BASE.arts[0] = new QRT(27, Controls.mask.value, Controls.errcor.value, Controls.datatype.value);
BASE.current = BASE.arts[0];

// QRT CREATION ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

let globalCanvasScaleCoef = Math.floor((cnvPP.clientHeight - 40) / BASE.current.modules);
const gCSCmin = globalCanvasScaleCoef - 2,
		gCSCmax = globalCanvasScaleCoef + 8;
setWorkspaceSize();
BASE.current.updateCanvas();

_gCSC = globalCanvasScaleCoef;

cnvPP.onwheel = function (e) {
	if (e.deltaY > 0 && globalCanvasScaleCoef > gCSCmin) {
		globalCanvasScaleCoef--;
	}
	if (e.deltaY < 0 && globalCanvasScaleCoef < gCSCmax) {
		globalCanvasScaleCoef++;
	}
	const coef = globalCanvasScaleCoef / _gCSC;
	_gCSC = globalCanvasScaleCoef;

	cnvP.style.width = BASE.current.modules * globalCanvasScaleCoef + "px";
	cnvP.style.height = BASE.current.modules * globalCanvasScaleCoef + "px";
	overmask.setAttribute("stroke-width", 2 / globalCanvasScaleCoef);

	cnvP.style.top = (e.clientY - 100 - ((e.clientY - 100 - parseInt(cnvP.style.top)) * coef)) + "px";
	cnvP.style.left = (e.clientX - ((e.clientX - parseInt(cnvP.style.left)) * coef)) + "px";

	// BASE.current.updateCanvas();
	// BASE.current.drawPointOn(e.offsetX, e.offsetY, globalCanvasScaleCoef);
};

let mouseDown = 0;
let _offsetX, _offsetY;
let _phantomX = 1, _phantomY = 1;

cnvP.onmousedown = e => {
	mouseDown = e.button + 1;
	if (mouseDown == 1) {
		const _x = Math.floor(e.offsetX / globalCanvasScaleCoef), _y = Math.floor(e.offsetY / globalCanvasScaleCoef);
		BASE.current.drawPointOn(_x, _y, 1);
		BASE.current.applyPointOn(_x, _y, 1);
	} else if (mouseDown == 3) {
		const _x = Math.floor(e.offsetX / globalCanvasScaleCoef), _y = Math.floor(e.offsetY / globalCanvasScaleCoef);
		BASE.current.drawPointOn(_x, _y, 0);
		BASE.current.applyPointOn(_x, _y, 0);
	} else if (mouseDown == 2) {
		cnvPP.style.cursor = "move";
		_offsetX = e.offsetX;
		_offsetY = e.offsetY;
	}
};

cnvPP.onmousemove = e => {
	if (mouseDown == 2) {
		cnvP.style.top = (e.clientY - 100 - _offsetY) + "px";
		cnvP.style.left = (e.clientX - _offsetX) + "px";
	}
};

cnvP.onmousemove = e => {
	if (mouseDown == 3) {
		const _x = Math.floor(e.offsetX / globalCanvasScaleCoef), _y = Math.floor(e.offsetY / globalCanvasScaleCoef);
		BASE.current.drawPointOn(_x, _y, 0);
		BASE.current.applyPointOn(_x, _y, 0);
	} else {
		const _x = Math.floor(e.offsetX / globalCanvasScaleCoef), _y = Math.floor(e.offsetY / globalCanvasScaleCoef);
		if (mouseDown == 1) {
			BASE.current.drawPointOn(_x, _y, 1);
			BASE.current.applyPointOn(_x, _y, 1);
		} else if (BASE.current.matrix[_y][_x] == 1) {
			BASE.current.drawPointOn(_phantomX, _phantomY, 0);
			_phantomX = 1;
			_phantomY = 1;
		} else {
			BASE.current.drawPointOn(_phantomX, _phantomY, 0);
			BASE.current.drawPointOn(_x, _y, 1);
			_phantomX = _x;
			_phantomY = _y;
		}
	}
};

cnvPP.onmouseup = e => {
	if (mouseDown == 2) {
		cnvPP.style.cursor = "inherit";
		BASE.current.drawPointOn(_phantomX, _phantomY, 0);
	}
	if (mouseDown != 0) {
		_phantomX = 1;
		_phantomY = 1;
	}
	mouseDown = 0;
};

cnvP.onmouseout = e => {
	BASE.current.drawPointOn(_phantomX, _phantomY, 0);
	_phantomX = 1;
	_phantomY = 1;
};

cnvPP.oncontextmenu = e => {
	e.preventDefault();
};

const Tools = {
	move: {
		elem: document.getElementById("move-tool").nextElementSibling,
	},
	brush: {
		elem: document.getElementById("brush-tool").nextElementSibling,
		radius: 1,
	},
	circle: {
		elem: document.getElementById("circle-tool").nextElementSibling,
	},
	line: {
		elem: document.getElementById("line-tool").nextElementSibling,
	},
	select: {
		elem: document.getElementById("select-tool").nextElementSibling,
	},
};

Tools.brush._elemBoundingRect = Tools.brush.elem.getBoundingClientRect();

let wasWheeled = false;

Tools.brush.elem.addEventListener("wheel", e => {
	if (!wasWheeled) {
		OneTitle.show("Brush radius: " + Tools.brush.radius, "right-switch", Tools.brush._elemBoundingRect.x + Tools.brush._elemBoundingRect.width + 9, Tools.brush._elemBoundingRect.y + (Tools.brush._elemBoundingRect.height / 2), 1);
		wasWheeled = true;
	} else {
		OneTitle.log("Brush radius: " + Tools.brush.radius);
	}

	if (e.deltaY > 0 && Tools.brush.radius > 1) {
		Tools.brush.radius--;
	} else if (e.deltaY < 0 && Tools.brush.radius < 10) {
		Tools.brush.radius++;
	}
});

Tools.brush.elem.addEventListener("mouseleave", () => {
	if (wasWheeled) {
		wasWheeled = false;
		OneTitle.hide();
	}
});



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

function setWorkspaceSize () {
	canvas.width = BASE.current.modules;
	canvas.height = BASE.current.modules;
	cnvP.style.width = BASE.current.modules * globalCanvasScaleCoef + "px";
	cnvP.style.height = BASE.current.modules * globalCanvasScaleCoef + "px";
	cnvP.style.top = Math.floor((cnvPP.clientHeight - (globalCanvasScaleCoef * BASE.current.modules)) / 2) + "px";
	cnvP.style.left = Math.floor((cnvPP.clientWidth - (globalCanvasScaleCoef * BASE.current.modules)) / 2) + "px";
	overmask.setAttribute("viewBox", "0 0 " + BASE.current.modules + " " + BASE.current.modules);
	overmask.setAttribute("stroke-width", 2 / globalCanvasScaleCoef);
}

// window.onbeforeunload = e => {
// 	return e.returnValue;
// };

function bitmapToPolygons (xs, ys, separated = false) {
	const _xs = structuredClone(xs).sort((a, b) => a - b);
	const _ys = structuredClone(ys).sort((a, b) => a - b);

	const 	minx = _xs[0],
			maxx = _xs[_xs.length - 1],
			maxy = _ys[_ys.length - 1];
			miny = _ys[0];

	let map = new Array(maxy - miny + 2);

	for (let i = 0; i < xs.length; i++) {
		if (typeof map[ys[i] - miny] == "undefined") {
			map[ys[i] - miny] = new Int8Array(maxx - minx + 2);
		}

		if (typeof map[ys[i] - miny + 1] == "undefined") {
			map[ys[i] - miny + 1] = new Int8Array(maxx - minx + 2);
		}

		map[ys[i] - miny][xs[i] - minx] = 1;
		map[ys[i] - miny + 1][xs[i] - minx] = 1;
		map[ys[i] - miny][xs[i] - minx + 1] = 1;
		map[ys[i] - miny + 1][xs[i] - minx + 1] = 1;
		BASE.current.drawPointOn(xs[i], ys[i], 1);
	}

	let _map = "";
	for (let i = 0; i < map.length; i++) {
		_map += map[i].join(" ").replaceAll("1","#").replaceAll("0",".") + "\n";
	}
	console.log(_map);

	let polygon = [];
	let x = 0, y = map.length - 1, vec = [0, -1];
	let _x = 0, _y = 0;
	let p = 0, _p = p;
	let rn = 0;

	const elem = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
	overmask.appendChild(elem);

	do {
		if (polygon.length == 0 && map[y][x] == 0) {
			if (map[y - 1][x] == 1) {
				_x = x;
				_y = y - 1;
				_p = p;
			} else {
				y--;
				continue;
			}
		}

		if ((y - vec[0]).interval(0, map.length - 1) &&
			(x + vec[1]).interval(0, map[0].length - 1) &&
			map[y - vec[0]][x + vec[1]] == 1
		) {										// TURNING LEFT
			vec = [vec[1], -vec[0]];
			rn = 0;
		}

		if ((y + vec[1]).interval(0, map.length - 1) &&
			(x + vec[0]).interval(0, map[0].length - 1) &&
			map[y + vec[1]][x + vec[0]] == 1
		) {										// IF MOVING IS POSSIBLE
			x += vec[0];
			y += vec[1];
			if (rn++ > 0) {
				polygon.pop();
				polygon.pop();
			}
			polygon.push(x + minx);
			polygon.push(y + miny);
		} else {								// TURNING RIGHT
			vec = [-vec[1], vec[0]];
			x += vec[0];
			y += vec[1];
			polygon.push(x + minx);
			polygon.push(y + miny);
			rn++;
		}

		let str = "";
		for (let i = 0; i < polygon.length; i += 2) {
			str += polygon[i] + "," + polygon[i + 1] + " ";
		}
		elem.setAttribute("points", str);
	} while (!(x == _x && y == _y && p - _p > 1) && ++p < 200);
}

window.onload = () => {
	// bitmapToPolygons([100, 101, 100, 101, 100, 100, 100, 100, 100, 101, 100, 99], [100, 99, 99, 98, 98, 97, 96, 95, 94, 94, 93, 93]);
	bitmapToPolygons([100, 101, 100, 99, 101, 100, 99, 98], [100, 99, 99, 99, 98, 98, 98, 98]);
};
