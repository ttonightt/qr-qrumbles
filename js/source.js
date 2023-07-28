const canvas = document.getElementById("main");
CWMap.init(document.getElementById("map"));

Project.init(
	document.getElementById("tab-navs"),
	canvas.parentElement.parentElement,
	canvas.parentElement,
	canvas
);

// CONTROLS CONNECTING vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

Controls.mask = new RadioBox("mask", value => {
	if (QRT.current) {
		const res = confirm("Would you like to keep current look of this QRT?");
		if (res) {
			for (let i = 0; i < QRT.current.modules; i++) {
				for (let j = 0; j < QRT.current.modules; j++) {
					if (QRT.current.matrix.x2get(i, j) % 6 < 2) {
						QRT.current.matrix.x2set(i, j,
							QRT.current.matrix.x2get(i, j) ^ QRT.current.getMaskBit(i, j)
						);
					}
				}
			}

			QRT.current.masktype = parseInt(value, 10);

			for (let i = 0; i < QRT.current.modules; i++) {
				for (let j = 0; j < QRT.current.modules; j++) {
					if (QRT.current.matrix.x2get(i, j) % 6 < 2) {
						QRT.current.matrix.x2set(i, j,
							QRT.current.matrix.x2get(i, j) ^ QRT.current.getMaskBit(i, j)
						);
					}
				}
			}

			QRT.current.updateCanvasX();

			// if (QRT.maskApplication === 2) {
			// 	QRT.current.updateCanvasX();
			// }
		}
	}
}, false);

Controls.errcor = new RadioBox("errcor", false);

Controls.datatype = new RadioBox("dtype", false);

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

Controls.savingProjectName = new InputText("proj-name-to-save");

Controls.saveProject = new Button("save-proj-btn", () => {
	FilePortal.save(QRT.current.buildTQRT());
});

Controls.fileInput = new InputFile("proj-to-open", files => {
	FilePortal.buffer = files;
});

Controls.openFile = new Button("open-proj-btn", () => {
	if (FilePortal.buffer) {
		QRT.readTQRT(FilePortal.buffer[0]).then((obj) => {
			new QRT("tttt", obj);
		});

		FilePortal.buffer = 0;
	}
});

Controls.rotateWorkbenchRight = new Button("rotate-workbench-right", () => {
	const match = cnvP.style.transform.match(/rotateZ\(\-?[0-9]+/);

	if (match !== null) {
		cnvP.style.transform = cnvP.style.transform.replace(/rotateZ\(\-?[0-9]+/,
			"rotateZ(" +
			parseInt((parseInt(match[0].slice(8), 10) + 90) % 360, 10)
		);
	} else {
		cnvP.style.transform += " rotateZ(90deg)";
	}
});

Controls.rotateWorkbenchLeft = new Button("rotate-workbench-left", () => {
	const match = cnvP.style.transform.match(/rotateZ\(\-?[0-9]+/);

	if (match !== null) {
		cnvP.style.transform = cnvP.style.transform.replace(/rotateZ\(\-?[0-9]+/,
			"rotateZ(" +
			parseInt((parseInt(match[0].slice(8), 10) - 90) % 360, 10)
		);
	} else {
		cnvP.style.transform += " rotateZ(-90deg)";
	}
});

Controls.maskApplication = new RadioBox("mskover", value => {
	QRT.maskApplication = parseInt(value, 10);
	if (QRT.current) QRT.current.updateCanvasX();
}, true);

// QRT CREATION vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

Project.add("NewQRT", {
	version: 34,
	ecdepth: Controls.errcor.value,
	masktype: Controls.mask.value,
	datatype: Controls.datatype.value
});

// window.canvasScale = Math.floor((cnvPP.clientHeight - 40) / QRT.current.modules);

// const csMIN = window.canvasScale - 1, csMAX = window.canvasScale + 8;
// setWorkspaceSize();

// let _canvasScale = window.canvasScale;

// cnvPP.onwheel = function (e) {
// 	if (e.deltaY > 0 && window.canvasScale > csMIN) {
// 		window.canvasScale--;
// 	}
// 	if (e.deltaY < 0 && window.canvasScale < csMAX) {
// 		window.canvasScale++;
// 	}
// 	const coef = window.canvasScale / _canvasScale;
// 	_canvasScale = window.canvasScale;

// 	cnvP.style.width = QRT.current.modules * window.canvasScale + "px";
// 	cnvP.style.height = QRT.current.modules * window.canvasScale + "px";
	
// 	cnvP.style.top = (e.clientY - 100 - ((e.clientY - 100 - parseInt(cnvP.style.top)) * coef)) + "px";
// 	cnvP.style.left = (e.clientX - ((e.clientX - parseInt(cnvP.style.left)) * coef)) + "px";

// 	CWMap.canvas.width = QRT.current.modules * window.canvasScale;
// 	CWMap.canvas.height = QRT.current.modules * window.canvasScale;
// };

// let mouseDown = 0;
// let _offsetX, _offsetY;
// let _phantomX = 1, _phantomY = 1;
// let areaToClear = 0;
// let _color;

// cnvPP.onmousedown = e => {

// 	mouseDown = e.button + 1;
// 	_offsetX = e.offsetX;
// 	_offsetY = e.offsetY;

// 	if (mouseDown === 2) {
// 		cnvPP.style.cursor = "move";
// 	} else if (e.target === canvas) {
// 		_offsetX = Math.floor(_offsetX / window.canvasScale);
// 		_offsetY = Math.floor(_offsetY / window.canvasScale);
// 		if (Tools.value === "brush") QRT.current.applyPointOn(_offsetX, _offsetY, (mouseDown - 3) / -2);
// 	}
// };

// cnvPP.onmousemove = e => {
// 	let _x = Math.floor(e.offsetX / window.canvasScale), _y = Math.floor(e.offsetY / window.canvasScale);

// 	if (mouseDown === 2) {
// 		cnvP.style.top = (e.clientY - 100 - _offsetY) + "px";
// 		cnvP.style.left = (e.clientX - _offsetX) + "px";
// 	} else if (e.target === canvas) {
// 		if (mouseDown % 2) {
// 			switch (Tools.value) {
// 				case "brush":
// 					QRT.current.drawLineOn(_offsetX, _offsetY, _x, _y, (mouseDown - 3) / -2, Tools.list.brush.radius, false);
// 					QRT.current.applyLineOn(_offsetX, _offsetY, _x, _y, (mouseDown - 3) / -2, Tools.list.brush.radius, false);
// 					_offsetX = _x;
// 					_offsetY = _y;
// 					break;
// 				case "line":
// 					if (areaToClear) QRT.current.updateCanvasX(areaToClear);

// 					areaToClear = QRT.current.drawLineOn(
// 						Math.floor(_offsetX),
// 						Math.floor(_offsetY),
// 						_x, _y, (mouseDown - 3) / -2, Tools.list.line.width
// 					);

// 					break;
// 				case "circle":
// 					if (areaToClear) QRT.current.updateCanvasX(areaToClear);

// 					areaToClear = QRT.current.drawEllipseOn(
// 						Math.floor(_offsetX),
// 						Math.floor(_offsetY),
// 						_x, _y, e.ctrlKey, e.shiftKey, (mouseDown - 3) / -2
// 					);
// 			}
// 		} else if ((QRT.current.matrix.x2get(_x, _y) ^ QRT.current.getMaskBit(_x, _y)) === 1) {
// 			QRT.current.drawPointOn(_phantomX, _phantomY, 0);
// 			_phantomX = 1;
// 			_phantomY = 1;
// 		} else {
// 			QRT.current.drawPointOn(_phantomX, _phantomY, 0);
// 			QRT.current.drawPointOn(_x, _y, 1);
// 			_phantomX = _x;
// 			_phantomY = _y;
// 		}
// 	}

// 	if (OneTitle.shown) {
// 		OneTitle.hide();
// 	}
// };

// cnvPP.onmouseup = e => {
// 	if (mouseDown === 2) {
// 		cnvPP.style.cursor = "";
// 		QRT.current.drawPointOn(_phantomX, _phantomY, 0);
// 	} else {
// 		switch (Tools.value) {
// 			case "line":
// 				QRT.current.applyLineOn(Math.floor(_offsetX),
// 										Math.floor(_offsetY),
// 										Math.floor(e.offsetX / window.canvasScale),
// 										Math.floor(e.offsetY / window.canvasScale),
// 										(mouseDown - 3) / -2, Tools.list.line.width);
// 				break;
// 			case "circle":
// 				QRT.current.applyEllipseOn(	Math.floor(_offsetX),
// 											Math.floor(_offsetY),
// 											Math.floor(e.offsetX / window.canvasScale),
// 											Math.floor(e.offsetY / window.canvasScale),
// 											e.ctrlKey, e.shiftKey, (mouseDown - 3) / -2);
// 				break;
// 		}
// 	}
// 	if (mouseDown != 0) {
// 		_phantomX = 1;
// 		_phantomY = 1;
// 	}
// 	mouseDown = 0;
// };

// cnvP.onmouseleave = () => {
// 	QRT.current.drawPointOn(_phantomX, _phantomY, 0);
// 	_phantomX = 1;
// 	_phantomY = 1;
// };

// cnvPP.oncontextmenu = e => {
// 	e.preventDefault();
// };

// function setWorkspaceSize () {
	// window.canvasScale = Math.floor((cnvPP.clientHeight - 40) / QRT.current.modules);
	// canvas.width = QRT.current.modules;
	// canvas.height = QRT.current.modules;
	// cnvP.style.width = QRT.current.modules * window.canvasScale + "px";
	// cnvP.style.height = QRT.current.modules * window.canvasScale + "px";
	// cnvP.style.top = Math.floor((cnvPP.clientHeight - (window.canvasScale * QRT.current.modules)) / 2) + "px";
	// cnvP.style.left = Math.floor((cnvPP.clientWidth - (window.canvasScale * QRT.current.modules)) / 2) + "px";
// }

let datablocksmap;

window.onload = () => {
	// new CWMap(QRT.current);
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