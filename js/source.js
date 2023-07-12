const canvas = document.getElementById("main");
const dbPolygonMap = document.getElementById("dbmap-polygons-container");
const cnvP = canvas.parentElement, cnvPP = canvas.parentElement.parentElement;

QRT.ctx = canvas.getContext("2d");
QRT.ctx.fillStyle = "#000000";

const infocorner = document.getElementById("infocorner");

// CONTROLS CONNECTING vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

Controls.mask = new RadioBox("mask", () => {
	QRT.current.applyFormatOn(Controls.mask.value, Controls.errcor.value, 4).updateCanvas();
});

Controls.errcor = new RadioBox("errcor", () => {
	QRT.current.applyFormatOn(Controls.mask.value, Controls.errcor.value, 4).updateCanvas();
});

Controls.datatype = new RadioBox("dtype", value => {
	QRT.current.applyDataTypeOn(value).updateCanvas();
});

Controls.datablockMapOverlay = new RadioBox("dtbmapover", value => {
	switch (value) {
		case "0":
			dbPolygonMap.classList.remove("disabled");
			dbPolygonMap.classList.remove("active");
			break;
		case "1":
			dbPolygonMap.classList.remove("active");
			dbPolygonMap.classList.add("disabled");
			break;
		case "2":
			dbPolygonMap.classList.remove("disabled");
			dbPolygonMap.classList.add("active");
			break;
	}
}, true);

Controls.toPreview = new CheckBox("topreview", value => {
	if (value) {
		document.documentElement.classList.add("preview");
	} else {
		document.documentElement.classList.remove("preview");
	}
});

Controls.toInvert = new CheckBox("toinvert", value => {
	if (value) {
		document.documentElement.classList.add("invertion");
	} else {
		document.documentElement.classList.remove("invertion");
	}
});

Controls.toDecode = new Button("updatectrl-fromcanv", () => {
	
});

Controls.toEncode = new Button("updatectrl-tocanv", () => {
	
});

Controls.automaticDecode = new CheckBox("updatectrl-fromcanv-auto", value => {
	Controls.toDecode.elem.disabled = value;
}, true);

Controls.automaticEncode = new CheckBox("updatectrl-tocanv-auto", value => {
	Controls.toEncode.elem.disabled = value;
}, true);

// QRT CREATION vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

new QRT(27, Controls.mask.value, Controls.errcor.value, Controls.datatype.value);

let canvasScale = Math.floor((cnvPP.clientHeight - 40) / QRT.current.modules);
const 	csMIN = canvasScale - 2,
		csMAX = canvasScale + 8;
setWorkspaceSize();

let _canvasScale = canvasScale;

cnvPP.onwheel = function (e) {
	if (e.shiftKey && Tools.value === "brush") {
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
	
		cnvP.style.width = QRT.current.modules * canvasScale + "px";
		cnvP.style.height = QRT.current.modules * canvasScale + "px";
		dbPolygonMap.setAttribute("stroke-width", 2 / canvasScale);

		cnvP.style.top = (e.clientY - 100 - ((e.clientY - 100 - parseInt(cnvP.style.top)) * coef)) + "px";
		cnvP.style.left = (e.clientX - ((e.clientX - parseInt(cnvP.style.left)) * coef)) + "px";
	
		// QRT.current.updateCanvas();
		// QRT.current.drawPointOn(e.offsetX, e.offsetY, canvasScale);
	}
};

let mouseDown = 0;
let _offsetX, _offsetY;
let _phantomX = 1, _phantomY = 1;

cnvPP.onmousedown = e => {

	mouseDown = e.button + 1;
	_offsetX = e.offsetX;
	_offsetY = e.offsetY;

	if (mouseDown === 2) {
		cnvPP.style.cursor = "move";
	} else if (e.target === canvas) {
		_offsetX = Math.floor(_offsetX / canvasScale);
		_offsetY = Math.floor(_offsetY / canvasScale);
		if (Tools.value === "brush") QRT.current.applyPointOn(_offsetX, _offsetY, (mouseDown - 3) / -2);
	}
};

cnvPP.onmousemove = e => {
	let _x = Math.floor(e.offsetX / canvasScale), _y = Math.floor(e.offsetY / canvasScale);

	if (mouseDown === 2) {
		cnvP.style.top = (e.clientY - 100 - _offsetY) + "px";
		cnvP.style.left = (e.clientX - _offsetX) + "px";
	} else if (e.target === canvas) {
		if (mouseDown % 2) {
			switch (Tools.value) {
				case "brush":
					QRT.current.drawLineOn(_offsetX, _offsetY, _x, _y, (mouseDown - 3) / -2, Tools.list.brush.radius, false);
					QRT.current.applyLineOn(_offsetX, _offsetY, _x, _y, (mouseDown - 3) / -2, Tools.list.brush.radius, false);
					_offsetX = _x;
					_offsetY = _y;
					break;
				case "line":
					QRT.current.updateCanvasX();
					QRT.current.drawLineOn(	Math.floor(_offsetX),
												Math.floor(_offsetY),
												_x, _y, (mouseDown - 3) / -2, Tools.list.line.width);
					break;
				case "circle":
					QRT.current.updateCanvasX();
					QRT.current.drawEllipseOn(	Math.floor(_offsetX),
													Math.floor(_offsetY),
													_x, _y, e.ctrlKey, e.shiftKey, (mouseDown - 3) / -2);
			}
			// infocorner.textContent = _x + "," + _y + " : " + Math.floor((e.offsetX - _offsetX) / canvasScale) + "," + Math.floor((e.offsetY - _offsetY) / canvasScale);
		} else if (QRT.current.matrix.x2get(_x, _y) === 1) {
			QRT.current.drawPointOn(_phantomX, _phantomY, 0);
			_phantomX = 1;
			_phantomY = 1;
		} else {
			QRT.current.drawPointOn(_phantomX, _phantomY, 0);
			QRT.current.drawPointOn(_x, _y, 1);
			_phantomX = _x;
			_phantomY = _y;
		}
	}

	if (OneTitle.shown) {
		OneTitle.hide();
	}
};

cnvPP.onmouseup = e => {
	if (mouseDown === 2) {
		cnvPP.style.cursor = "";
		QRT.current.drawPointOn(_phantomX, _phantomY, 0);
	} else {
		switch (Tools.value) {
			case "line":
				QRT.current.applyLineOn(	Math.floor(_offsetX),
											Math.floor(_offsetY),
											Math.floor(e.offsetX / canvasScale),
											Math.floor(e.offsetY / canvasScale),
											(mouseDown - 3) / -2, Tools.list.line.width);
				break;
			case "circle":
				QRT.current.applyEllipseOn(	Math.floor(_offsetX),
												Math.floor(_offsetY),
												Math.floor(e.offsetX / canvasScale),
												Math.floor(e.offsetY / canvasScale),
												e.ctrlKey, e.shiftKey, (mouseDown - 3) / -2);
				break;
		}
		QRT.current.updateCanvasX();
	}
	if (mouseDown != 0) {
		_phantomX = 1;
		_phantomY = 1;
	}
	mouseDown = 0;
};

cnvP.onmouseout = e => {
	QRT.current.drawPointOn(_phantomX, _phantomY, 0);
	_phantomX = 1;
	_phantomY = 1;
};

cnvPP.oncontextmenu = e => {
	e.preventDefault();
};



function setWorkspaceSize () {
	canvasScale = Math.floor((cnvPP.clientHeight - 40) / QRT.current.modules);
	canvas.width = QRT.current.modules;
	canvas.height = QRT.current.modules;
	cnvP.style.width = QRT.current.modules * canvasScale + "px";
	cnvP.style.height = QRT.current.modules * canvasScale + "px";
	cnvP.style.top = Math.floor((cnvPP.clientHeight - (canvasScale * QRT.current.modules)) / 2) + "px";
	cnvP.style.left = Math.floor((cnvPP.clientWidth - (canvasScale * QRT.current.modules)) / 2) + "px";
	dbPolygonMap.setAttribute("viewBox", "0 0 " + QRT.current.modules + " " + QRT.current.modules);
	dbPolygonMap.setAttribute("stroke-width", 2 / canvasScale);
	QRT.current.updateCanvasX();
}

let datablocksmap;

window.onload = () => {
	DBMPolygons.init(dbPolygonMap);
	DBMChars.init(document.getElementById("decoded"), document.getElementById("decoded").parentElement.parentElement);
	new DBMPolygons(
		QRT.current.decodeDataFrom(),
		QRT.current.datatype,
		QRT.current.getTableInfo().dataBytes
	);
	// new DBMChars();
};

// window.onbeforeunload = e => {
// 	return e.returnValue;
// };