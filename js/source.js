const canvas = document.getElementById("main");
CWMap.init(document.getElementById("map"));
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

Controls.cwmapOverlay = new RadioBox("dtbmapover", value => {
	switch (value) {
		case "0":
			CWMap.canvas.classList.remove("disabled");
			CWMap.canvas.classList.remove("active");
			break;
		case "1":
			CWMap.canvas.classList.remove("active");
			CWMap.canvas.classList.add("disabled");
			break;
		case "2":
			CWMap.canvas.classList.remove("disabled");
			CWMap.canvas.classList.add("active");
			break;
	}
}, true);

Controls.toPreview = new CheckBox("topreview", value => {
	document.documentElement.classList.toggle("preview", value);
});

Controls.toInvert = new CheckBox("toinvert", value => {
	document.documentElement.classList.toggle("invertion", value);
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

window.canvasScale = Math.floor((cnvPP.clientHeight - 40) / QRT.current.modules);

const 	csMIN = window.canvasScale - 1,
		csMAX = window.canvasScale + 8;
setWorkspaceSize();

let _canvasScale = window.canvasScale;

cnvPP.onwheel = function (e) {
	if (e.shiftKey && Tools.value === "brush") {
		Tools.events.changeRadiusOnWheel(e);
	} else {
		if (e.deltaY > 0 && window.canvasScale > csMIN) {
			window.canvasScale--;
		}
		if (e.deltaY < 0 && window.canvasScale < csMAX) {
			window.canvasScale++;
		}
		const coef = window.canvasScale / _canvasScale;
		_canvasScale = window.canvasScale;
	
		cnvP.style.width = QRT.current.modules * window.canvasScale + "px";
		cnvP.style.height = QRT.current.modules * window.canvasScale + "px";
		
		cnvP.style.top = (e.clientY - 100 - ((e.clientY - 100 - parseInt(cnvP.style.top)) * coef)) + "px";
		cnvP.style.left = (e.clientX - ((e.clientX - parseInt(cnvP.style.left)) * coef)) + "px";

		CWMap.canvas.width = QRT.current.modules * window.canvasScale;
		CWMap.canvas.height = QRT.current.modules * window.canvasScale;
		CWMap.current.updateCanvas();
		
		// QRT.current.updateCanvas();
		// QRT.current.drawPointOn(e.offsetX, e.offsetY, window.canvasScale);
	}
};

let mouseDown = 0;
let _offsetX, _offsetY;
let _phantomX = 1, _phantomY = 1;
let areaToClear = new Uint8Array(4);

cnvPP.onmousedown = e => {

	mouseDown = e.button + 1;
	_offsetX = e.offsetX;
	_offsetY = e.offsetY;

	if (mouseDown === 2) {
		cnvPP.style.cursor = "move";
	} else if (e.target === canvas) {
		_offsetX = Math.floor(_offsetX / window.canvasScale);
		_offsetY = Math.floor(_offsetY / window.canvasScale);
		if (Tools.value === "brush") QRT.current.applyPointOn(_offsetX, _offsetY, (mouseDown - 3) / -2);
	}
};

cnvPP.onmousemove = e => {
	let _x = Math.floor(e.offsetX / window.canvasScale), _y = Math.floor(e.offsetY / window.canvasScale);

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
					QRT.current.updateCanvasX(
						areaToClear[0],
						areaToClear[1],
						areaToClear[2],
						areaToClear[3]
					);

					QRT.current.drawLineOn(
						Math.floor(_offsetX),
						Math.floor(_offsetY),
						_x, _y, (mouseDown - 3) / -2, Tools.list.line.width
					);

					areaToClear[0] = _offsetX;
					areaToClear[1] = _offsetY;
					areaToClear[2] = _x;
					areaToClear[3] = _y;
					
					break;
				case "circle":
					QRT.current.updateCanvasX();

					QRT.current.updateCanvasX(
						areaToClear[0],
						areaToClear[1],
						areaToClear[2],
						areaToClear[3]
					);

					QRT.current.drawEllipseOn(
						Math.floor(_offsetX),
						Math.floor(_offsetY),
						_x, _y, e.ctrlKey, e.shiftKey, (mouseDown - 3) / -2
					);

					areaToClear[0] = _offsetX;
					areaToClear[1] = _offsetY;
					areaToClear[2] = _x;
					areaToClear[3] = _y;
			}
			// infocorner.textContent = _x + "," + _y + " : " + Math.floor((e.offsetX - _offsetX) / window.canvasScale) + "," + Math.floor((e.offsetY - _offsetY) / window.canvasScale);
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
				QRT.current.applyLineOn(Math.floor(_offsetX),
										Math.floor(_offsetY),
										Math.floor(e.offsetX / window.canvasScale),
										Math.floor(e.offsetY / window.canvasScale),
										(mouseDown - 3) / -2, Tools.list.line.width);
				break;
			case "circle":
				QRT.current.applyEllipseOn(	Math.floor(_offsetX),
											Math.floor(_offsetY),
											Math.floor(e.offsetX / window.canvasScale),
											Math.floor(e.offsetY / window.canvasScale),
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
	window.canvasScale = Math.floor((cnvPP.clientHeight - 40) / QRT.current.modules);
	canvas.width = QRT.current.modules;
	canvas.height = QRT.current.modules;
	CWMap.canvas.width = QRT.current.modules * window.canvasScale;
	CWMap.canvas.height = QRT.current.modules * window.canvasScale;
	cnvP.style.width = QRT.current.modules * window.canvasScale + "px";
	cnvP.style.height = QRT.current.modules * window.canvasScale + "px";
	cnvP.style.top = Math.floor((cnvPP.clientHeight - (window.canvasScale * QRT.current.modules)) / 2) + "px";
	cnvP.style.left = Math.floor((cnvPP.clientWidth - (window.canvasScale * QRT.current.modules)) / 2) + "px";
	QRT.current.updateCanvasX();
}

let datablocksmap;

window.onload = () => {
	new CWMap(2, 125 /*, ...*/);
	// DBMChars.init(document.getElementById("decoded"), document.getElementById("decoded").parentElement.parentElement);
	// new DBMPolygons(
	// 	"",
	// 	2,
	// 	QRT.current.info
	// );
	// new DBMChars();
};

// window.onbeforeunload = e => {
// 	return e.returnValue;
// };

// ---------------------------------------------------------------------------------

// (function () {
// 	const g1 = 4, g2 = 3, g1cws = 6, g2cws = 7;
// 	const arr = new Uint8Array((g1 * g1cws) + (g2 * g2cws));

// 	let str = "";

// 	for (let i = 0; i < arr.length; i++) {
// 		arr[i] = Math.round(Math.random() * 255);
// 	}
	
// 	for (let i = 0; i < g1; i++) {
// 		for (let j = 0; j < g1cws; j++) {
// 			str += arr[(i * g1cws) + j].toString(2).padStart(8, "0") + " , ";
// 		}

// 		str += "\n";
// 	}
	
// 	for (let i = 0; i < g2; i++) {
// 		for (let j = 0; j < g2cws; j++) {
// 			str += arr[(g1 * g1cws) + (i * g2cws) + j].toString(2).padStart(8, "0") + " , ";
// 		}

// 		str += "\n";
// 	}

// 	console.log(str);

// 	const _index = 30 * 8;
// 	const li = _index % 8, gi = (_index - li) / 8;
// 	const r = gi % (g1 + g2), c = (gi - r) / (g1 + g2);
// 	const index = (g1cws * Math.min(r, g1)) + (g2cws * Math.max(0, r - g1)) + c;

// 	console.log(r + ", " + c);
// 	console.log(index);
// 	console.logb(arr[index], 8);
// 	console.log((arr[index] >> (7 - li)) % 2);
// })();