const canvas = document.getElementById("main");
const dbPolygonMap = document.getElementById("dbmap-polygons-container");
const cnvP = canvas.parentElement, cnvPP = canvas.parentElement.parentElement;

BASE.ctx = canvas.getContext("2d");
BASE.ctx.fillStyle = "#000000";

const infocorner = document.getElementById("infocorner");

// CONTROLS CONNECTING vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

Controls.mask = new RadioBox("mask", () => {
	BASE.current.applyFormatOn(Controls.mask.value, Controls.errcor.value, 4).updateCanvas();
});

Controls.errcor = new RadioBox("errcor", () => {
	BASE.current.applyFormatOn(Controls.mask.value, Controls.errcor.value, 4).updateCanvas();
});

Controls.datatype = new RadioBox("dtype", value => {
	BASE.current.applyDataTypeOn(value).updateCanvas();
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

BASE.add(new QRT(27, Controls.mask.value, Controls.errcor.value, Controls.datatype.value));

let canvasScale = Math.floor((cnvPP.clientHeight - 40) / BASE.current.modules);
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
	
		cnvP.style.width = BASE.current.modules * canvasScale + "px";
		cnvP.style.height = BASE.current.modules * canvasScale + "px";
		dbPolygonMap.setAttribute("stroke-width", 2 / canvasScale);

		cnvP.style.top = (e.clientY - 100 - ((e.clientY - 100 - parseInt(cnvP.style.top)) * coef)) + "px";
		cnvP.style.left = (e.clientX - ((e.clientX - parseInt(cnvP.style.left)) * coef)) + "px";
	
		// BASE.current.updateCanvas();
		// BASE.current.drawPointOn(e.offsetX, e.offsetY, canvasScale);
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
		if (Tools.value == "brush") BASE.current.applyPointOn(_offsetX, _offsetY, (mouseDown - 3) / -2);
	}
};

cnvPP.onmousemove = e => {
	let _x = Math.floor(e.offsetX / canvasScale), _y = Math.floor(e.offsetY / canvasScale);

	if (mouseDown == 2) {
		cnvP.style.top = (e.clientY - 100 - _offsetY) + "px";
		cnvP.style.left = (e.clientX - _offsetX) + "px";
	} else if (e.target == canvas) {
		if (mouseDown % 2) {
			switch (Tools.value) {
				case "brush":
					BASE.current.drawLineOn(_offsetX, _offsetY, _x, _y, (mouseDown - 3) / -2, Tools.list.brush.radius, false);
					BASE.current.applyLineOn(_offsetX, _offsetY, _x, _y, (mouseDown - 3) / -2, Tools.list.brush.radius, false);
					_offsetX = _x;
					_offsetY = _y;
					break;
				case "line":
					BASE.current.updateCanvasX();
					BASE.current.drawLineOn(	Math.floor(_offsetX),
												Math.floor(_offsetY),
												_x, _y, (mouseDown - 3) / -2, Tools.list.line.width);
					break;
				case "circle":
					BASE.current.updateCanvasX();
					BASE.current.drawEllipseOn(	Math.floor(_offsetX),
													Math.floor(_offsetY),
													_x, _y, e.ctrlKey, e.shiftKey, (mouseDown - 3) / -2);
			}
			// infocorner.textContent = _x + "," + _y + " : " + Math.floor((e.offsetX - _offsetX) / canvasScale) + "," + Math.floor((e.offsetY - _offsetY) / canvasScale);
		} else if (BASE.current.matrix.x2get(_x, _y) == 1) {
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

	if (OneTitle.shown) {
		OneTitle.hide();
	}
};

cnvPP.onmouseup = e => {
	if (mouseDown == 2) {
		cnvPP.style.cursor = "";
		BASE.current.drawPointOn(_phantomX, _phantomY, 0);
	} else {
		switch (Tools.value) {
			case "line":
				BASE.current.applyLineOn(	Math.floor(_offsetX),
											Math.floor(_offsetY),
											Math.floor(e.offsetX / canvasScale),
											Math.floor(e.offsetY / canvasScale),
											(mouseDown - 3) / -2, Tools.list.line.width);
				break;
			case "circle":
				BASE.current.applyEllipseOn(	Math.floor(_offsetX),
												Math.floor(_offsetY),
												Math.floor(e.offsetX / canvasScale),
												Math.floor(e.offsetY / canvasScale),
												e.ctrlKey, e.shiftKey, (mouseDown - 3) / -2);
				break;
		}
		BASE.current.updateCanvasX();
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



function setWorkspaceSize () {
	canvasScale = Math.floor((cnvPP.clientHeight - 40) / BASE.current.modules);
	canvas.width = BASE.current.modules;
	canvas.height = BASE.current.modules;
	cnvP.style.width = BASE.current.modules * canvasScale + "px";
	cnvP.style.height = BASE.current.modules * canvasScale + "px";
	cnvP.style.top = Math.floor((cnvPP.clientHeight - (canvasScale * BASE.current.modules)) / 2) + "px";
	cnvP.style.left = Math.floor((cnvPP.clientWidth - (canvasScale * BASE.current.modules)) / 2) + "px";
	dbPolygonMap.setAttribute("viewBox", "0 0 " + BASE.current.modules + " " + BASE.current.modules);
	dbPolygonMap.setAttribute("stroke-width", 2 / canvasScale);
	BASE.current.updateCanvasX();
}

let datablocksmap;

window.onload = () => {
	// DBMPolygons.init(dbPolygonMap);
	DBMChars.init(document.getElementById("decoded"), document.getElementById("decoded").parentElement.parentElement);
	// new DBMPolygons(
	// 	BASE.current.decodeDataFrom(),
	// 	BASE.current.datatype,
	// 	BASE.current.getTableInfo().dataBytes
	// );

	DBMChars.container.textContent = "";
	
	for (let i = 0; i < 1000; i++) {
		const elem = document.createElement("p");
		elem.textContent = "H";
		elem.onclick = () => {
			DBMChars.input.remove();
			elem.before(DBMChars.input);
			DBMChars.input.value = 0;
			DBMChars.input.focus();
			DBMChars.input.selecti(0,1);
			elem.remove();
		};
		DBMChars.container.append(elem);
	}
};

// window.onbeforeunload = e => {
// 	return e.returnValue;
// };