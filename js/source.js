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
const cnvP = canvas.parentElement, cnvPP = canvas.parentElement.parentElement;
const bitovermask = document.getElementById("bitovermask");
const bctx = bitovermask.getContext("2d");

BASE.ctx = canvas.getContext("2d");

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

window.onload = () => {
	bctx.imageSmoothing = false;
	fillBitmask(BASE.current.matrix, 14600, 125);
};

let {point, segment, Polygon} = Flatten;
const pol1 = new Polygon();


function fillBitmask (refermx, len, modules) {
	let x = modules - 1, y = modules - 1, v = 1, j = 1;
	let hue = 0, sat = 80, lit = 40;
	bctx.fillStyle = `hsl(${hue},${sat}%,${lit}%)`;
	bctx.fillRect(x--, y, 1, 1);
	for (let i = 1; i < len; i++) {
		if (j % 11 == 0 && j != 0) {
			hue += 32;
			hue %= 360;
		}
		if (x == 10 && y == modules) {
			y -= 9;
			x -= 2;
			v = -v;
		}

		if (x == 8 && y == 8) {
			// console.log("jump");
			x--;
		}

		if (x == modules - 9 && y == 6) {
			// console.log("jump2");
			x -= 2;
			y -= 6;
			v = -v;
		}
		
		if (y < 0 || y >= modules || (y == 8 && (refermx[y][x] == 4 || refermx[y][x] == 5)) || (x <= 5 && y == modules - 11)) {
			y += v;
			x -= 2;
			v = -v;
			bctx.fillStyle = `hsl(${hue},${sat}%,${lit}%)`;
			bctx.fillRect(x, y, 1, 1);
			j++;
		} else if (refermx[y][x] == 0 || refermx[y][x] == 1) {
			bctx.fillStyle = `hsl(${hue},${sat}%,${lit}%)`;
			bctx.fillRect(x, y, 1, 1);
			j++;
		}
		if (i % 2) {
			x++;
			y -= v;
		} else {
			x--;
		}
	}
}

// QRT CREATION ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

let globalCanvasScaleCoef = Math.floor((cnvPP.clientHeight - 40) / BASE.current.modules);
const gCSCmin = globalCanvasScaleCoef - 2, gCSCmax = globalCanvasScaleCoef + 8;
setWorkspaceSize();
BASE.current.updateCanvasX();

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
	bitovermask.width = BASE.current.modules;
	bitovermask.height = BASE.current.modules;
}

// window.onbeforeunload = e => {
// 	return e.returnValue;
// };