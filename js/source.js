const canvas = document.getElementById("main");
const dbmapPolygonsContainer = document.getElementById("dbmap-polygons-container");
const cnvP = canvas.parentElement, cnvPP = canvas.parentElement.parentElement;

BASE.ctx = canvas.getContext("2d");
BASE.ctx.fillStyle = "#000000";

const infocorner = document.getElementById("infocorner");

// CONTROLS CONNECTING vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

Controls.mask = new Control("radio", "mask", () => {
	BASE.current().applyFormatOn(Controls.mask.value, Controls.errcor.value, 4).updateCanvas();
});

Controls.errcor = new Control("radio", "errcor", () => {
	BASE.current().applyFormatOn(Controls.mask.value, Controls.errcor.value, 4).updateCanvas();
});

Controls.datatype = new Control("radio", "dtype", () => {
	BASE.current().applyDataTypeOn(Controls.datatype.value).updateCanvas();
});

Controls.datablockMapOverlay = new Control("radio", "dtbmapover", () => {
	switch (Controls.datablockMapOverlay.value) {
		case "0":
			dbmapPolygonsContainer.classList.remove("disabled");
			dbmapPolygonsContainer.classList.remove("active");
			break;
		case "1":
			dbmapPolygonsContainer.classList.remove("active");
			dbmapPolygonsContainer.classList.add("disabled");
			break;
		case "2":
			dbmapPolygonsContainer.classList.remove("disabled");
			dbmapPolygonsContainer.classList.add("active");
			Tools
			break;
	}
});

Controls.toPreview = new Control("checkbox", "topreview", () => {
	if (Controls.toPreview.value) {
		document.documentElement.classList.add("preview");
	} else {
		document.documentElement.classList.remove("preview");
	}
});

Controls.toInvert = new Control("checkbox", "toinvert", () => {
	if (Controls.toInvert.value) {
		document.documentElement.classList.add("invertion");
	} else {
		document.documentElement.classList.remove("invertion");
	}
});

// QRT CREATION vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

BASE.arts[0] = new QRT(27, Controls.mask.value, Controls.errcor.value, Controls.datatype.value);
BASE.eci = 0;

let globalCanvasScaleCoef = Math.floor((cnvPP.clientHeight - 40) / BASE.current().modules);
const gCSCmin = globalCanvasScaleCoef - 2,
		gCSCmax = globalCanvasScaleCoef + 8;
setWorkspaceSize();

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

	cnvP.style.width = BASE.current().modules * globalCanvasScaleCoef + "px";
	cnvP.style.height = BASE.current().modules * globalCanvasScaleCoef + "px";
	dbmapPolygonsContainer.setAttribute("stroke-width", 2 / globalCanvasScaleCoef);

	cnvP.style.top = (e.clientY - 100 - ((e.clientY - 100 - parseInt(cnvP.style.top)) * coef)) + "px";
	cnvP.style.left = (e.clientX - ((e.clientX - parseInt(cnvP.style.left)) * coef)) + "px";

	// BASE.current().updateCanvas();
	// BASE.current().drawPointOn(e.offsetX, e.offsetY, globalCanvasScaleCoef);
};

let mouseDown = 0;
let _offsetX, _offsetY;
let _phantomX = 1, _phantomY = 1;

canvas.onmousedown = e => {
	mouseDown = e.button + 1;
	_offsetX = e.offsetX;
	_offsetY = e.offsetY;
	if (mouseDown == 1) {
		const _x = Math.floor(e.offsetX / globalCanvasScaleCoef), _y = Math.floor(e.offsetY / globalCanvasScaleCoef);
		BASE.current().drawPointOn(_x, _y, 1);
		BASE.current().applyPointOn(_x, _y, 1);
	} else if (mouseDown == 3) {
		const _x = Math.floor(e.offsetX / globalCanvasScaleCoef), _y = Math.floor(e.offsetY / globalCanvasScaleCoef);
		BASE.current().drawPointOn(_x, _y, 0);
		BASE.current().applyPointOn(_x, _y, 0);
	} else if (mouseDown == 2) {
		cnvPP.style.cursor = "move";
	}
};

cnvPP.onmousemove = e => {
	if (mouseDown == 2) {
		cnvP.style.top = (e.clientY - 100 - _offsetY) + "px";
		cnvP.style.left = (e.clientX - _offsetX) + "px";
	}
};

canvas.onmousemove = e => {
	if (mouseDown == 3) {
		const _x = Math.floor(e.offsetX / globalCanvasScaleCoef), _y = Math.floor(e.offsetY / globalCanvasScaleCoef);
		BASE.current().drawPointOn(_x, _y, 0);
		BASE.current().applyPointOn(_x, _y, 0);
	} else {
		const _x = Math.floor(e.offsetX / globalCanvasScaleCoef), _y = Math.floor(e.offsetY / globalCanvasScaleCoef);
		if (mouseDown == 1) {
			BASE.current().drawPointOn(_x, _y, 1);
			BASE.current().applyPointOn(_x, _y, 1);
			infocorner.textContent = _x + "," + _y + " : " + Math.floor((e.offsetX - _offsetX) / globalCanvasScaleCoef) + "," + Math.floor((e.offsetY - _offsetY) / globalCanvasScaleCoef);
		} else if (BASE.current().matrix[_y][_x] == 1) {
			BASE.current().drawPointOn(_phantomX, _phantomY, 0);
			_phantomX = 1;
			_phantomY = 1;
		} else {
			BASE.current().drawPointOn(_phantomX, _phantomY, 0);
			BASE.current().drawPointOn(_x, _y, 1);
			_phantomX = _x;
			_phantomY = _y;
		}
	}
};

cnvPP.onmouseup = e => {
	if (mouseDown == 2) {
		cnvPP.style.cursor = "";
		BASE.current().drawPointOn(_phantomX, _phantomY, 0);
	}
	if (mouseDown != 0) {
		_phantomX = 1;
		_phantomY = 1;
	}
	mouseDown = 0;
};

cnvP.onmouseout = e => {
	BASE.current().drawPointOn(_phantomX, _phantomY, 0);
	_phantomX = 1;
	_phantomY = 1;
};

cnvPP.oncontextmenu = e => {
	e.preventDefault();
};



function setWorkspaceSize () {
	globalCanvasScaleCoef = Math.floor((cnvPP.clientHeight - 40) / BASE.current().modules);
	canvas.width = BASE.current().modules;
	canvas.height = BASE.current().modules;
	cnvP.style.width = BASE.current().modules * globalCanvasScaleCoef + "px";
	cnvP.style.height = BASE.current().modules * globalCanvasScaleCoef + "px";
	cnvP.style.top = Math.floor((cnvPP.clientHeight - (globalCanvasScaleCoef * BASE.current().modules)) / 2) + "px";
	cnvP.style.left = Math.floor((cnvPP.clientWidth - (globalCanvasScaleCoef * BASE.current().modules)) / 2) + "px";
	dbmapPolygonsContainer.setAttribute("viewBox", "0 0 " + BASE.current().modules + " " + BASE.current().modules);
	dbmapPolygonsContainer.setAttribute("stroke-width", 2 / globalCanvasScaleCoef);
	BASE.current().updateCanvas();
}

window.onload = () => {
	const datablocksmap = new DatablockMap(BASE.current(), dbmapPolygonsContainer);
};

// window.onbeforeunload = e => {
// 	return e.returnValue;
// };