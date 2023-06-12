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

let canvasScale = Math.floor((cnvPP.clientHeight - 40) / BASE.current().modules);
const 	csMIN = canvasScale - 2,
		csMAX = canvasScale + 8;
setWorkspaceSize();

let _canvasScale = canvasScale;

cnvPP.onwheel = function (e) {
	if (e.shiftKey && Tools.value == "brush") {
		Tools.events.changeRadiusOnWheel(e);
	} else {
		if (e.deltaY > 0 && canvasScale > csMIN) {
			canvasScale--;
		}
		if (e.deltaY < 0 && canvasScale < csMAX) {
			canvasScale++;
		}
		const coef = canvasScale / _canvasScale;
		_canvasScale = canvasScale;
	
		cnvP.style.width = BASE.current().modules * canvasScale + "px";
		cnvP.style.height = BASE.current().modules * canvasScale + "px";
		dbmapPolygonsContainer.setAttribute("stroke-width", 2 / canvasScale);
	
		cnvP.style.top = (e.clientY - 100 - ((e.clientY - 100 - parseInt(cnvP.style.top)) * coef)) + "px";
		cnvP.style.left = (e.clientX - ((e.clientX - parseInt(cnvP.style.left)) * coef)) + "px";
	
		// BASE.current().updateCanvas();
		// BASE.current().drawPointOn(e.offsetX, e.offsetY, canvasScale);
	}
};

let mouseDown = 0;
let _offsetX, _offsetY;
let _phantomX = 1, _phantomY = 1;

cnvPP.onmousedown = e => {

	mouseDown = e.button + 1;
	_offsetX = e.offsetX;
	_offsetY = e.offsetY;

	if (mouseDown == 2) {
		cnvPP.style.cursor = "move";
	} else if (e.target == canvas) {
		_offsetX = Math.floor(_offsetX / canvasScale);
		_offsetY = Math.floor(_offsetY / canvasScale);
		if (Tools.value == "brush") BASE.current().applyPointOn(_offsetX, _offsetY, (mouseDown - 3) / -2);
	}
};

cnvPP.onmousemove = e => {
	const _x = Math.floor(e.offsetX / canvasScale), _y = Math.floor(e.offsetY / canvasScale);

	if (mouseDown == 3) {
		BASE.current().drawPointOn(_x, _y, 0);
		BASE.current().applyPointOn(_x, _y, 0);
	} else if (mouseDown == 2) {
		cnvP.style.top = (e.clientY - 100 - _offsetY) + "px";
		cnvP.style.left = (e.clientX - _offsetX) + "px";
	} else if (e.target == canvas) {
		if (mouseDown % 2) {
			switch (Tools.value) {
				case "brush":
					BASE.current().drawLineOn(_offsetX, _offsetY, _x, _y, (mouseDown - 3) / -2);
					BASE.current().applyLineOn(_offsetX, _offsetY, _x, _y, (mouseDown - 3) / -2);
					_offsetX = _x;
					_offsetY = _y;
					break;
				case "line":
					BASE.current().updateCanvasX();
					BASE.current().drawLineOn(	Math.floor(_offsetX),
												Math.floor(_offsetY),
												_x, _y, (mouseDown - 3) / -2);
					break;
				case "circle":
					BASE.current().updateCanvasX();
					BASE.current().drawEllipseOn(	Math.floor(_offsetX),
													Math.floor(_offsetY),
													_x, _y, e.ctrlKey, (mouseDown - 3) / -2);
			}
			infocorner.textContent = _x + "," + _y + " : " + Math.floor((e.offsetX - _offsetX) / canvasScale) + "," + Math.floor((e.offsetY - _offsetY) / canvasScale);
		} else if (BASE.current().matrix.x2get(_x, _y) == 1) {
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

	if (OneTitle.shown) {
		OneTitle.hide();
	}
};

cnvPP.onmouseup = e => {
	if (mouseDown == 2) {
		cnvPP.style.cursor = "";
		BASE.current().drawPointOn(_phantomX, _phantomY, 0);
	} else {
		switch (Tools.value) {
			case "line":
				BASE.current().applyLineOn(	Math.floor(_offsetX),
											Math.floor(_offsetY),
											Math.floor(e.offsetX / canvasScale),
											Math.floor(e.offsetY / canvasScale),
											1);
				break;
			case "circle":
				BASE.current().applyEllipseOn(	Math.floor(_offsetX),
												Math.floor(_offsetY),
												Math.floor(e.offsetX / canvasScale),
												Math.floor(e.offsetY / canvasScale),
												e.ctrlKey, 1);
				break;
		}
		BASE.current().updateCanvasX();
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
	canvasScale = Math.floor((cnvPP.clientHeight - 40) / BASE.current().modules);
	canvas.width = BASE.current().modules;
	canvas.height = BASE.current().modules;
	cnvP.style.width = BASE.current().modules * canvasScale + "px";
	cnvP.style.height = BASE.current().modules * canvasScale + "px";
	cnvP.style.top = Math.floor((cnvPP.clientHeight - (canvasScale * BASE.current().modules)) / 2) + "px";
	cnvP.style.left = Math.floor((cnvPP.clientWidth - (canvasScale * BASE.current().modules)) / 2) + "px";
	dbmapPolygonsContainer.setAttribute("viewBox", "0 0 " + BASE.current().modules + " " + BASE.current().modules);
	dbmapPolygonsContainer.setAttribute("stroke-width", 2 / canvasScale);
	BASE.current().updateCanvasX();
}

let datablocksmap;

window.onload = () => {
	datablocksmap = new DatablockMap(BASE.current(), dbmapPolygonsContainer);
};

// window.onbeforeunload = e => {
// 	return e.returnValue;
// };