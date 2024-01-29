"use strict";

import * as Controls from "./controls.js";
import Project from "./prj.js";
import QRT from "./qrt/qrt.js"; // ТРЕБА ЯКОСЬ ПОЗБУТИСЯ ЦЬОГО ІМПОРТУ БО ВОНО ВЖЕ ІМПОРТУЄТЬСЯ У PRJ
import Charmap from "./interface/charmap.jsx";

const canvas = document.getElementById("main");

QRT.init(canvas);

Project.init(QRT.canvas);

Charmap.init(
	document.getElementById("charmap-textarea"),
	document.getElementById("charmap-layout")
);

// Charmap.loadWithData([
// 	{
// 		encoding: "alphanumerical",
// 		chars: "Hello Wordld!"
// 	},
// 	{
// 		encoding: "numerical",
// 		chars: "Hello Wordld!"
// 	},
// 	{
// 		encoding: "byte",
// 		chars: "Hello Wordld!"
// 	},
// 	{
// 		encoding: "windows1251",
// 		chars: "Падав сніг на поріг, Кіт зліпив собі пиріг. Поки смажив, поки пік, а пиріг водою стік. Кіт не знав, що на пиріг треба тісто, а не сніг."
// 	},
// 	{
// 		encoding: "latin2",
// 		chars: "Hello Wordld!"
// 	},
// ]);

// CONTROLS CONNECTING vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

const ControlsCollection = {
	mask:
		new Controls.RadioBoxForm("mask", "mask", value => {
			if (Project.current) {
				const algo = confirm("Would you like to keep current look of this QRT (OK) or its data (Cancel)?");

				if (!algo) {
					Project.current.qrt.maskApplication = !Project.current.qrt.maskApplication * 2;
					Project.current.qrt.masktype = parseInt(value, 10);
					Project.current.qrt.maskApplication = !Project.current.qrt.maskApplication * 2;
				} else {
					Project.current.qrt.masktype = parseInt(value, 10);
				}

				Project.current.qrt.updateCanvas(new Rect8(0, 0, 255, 255));
			}
		}, false),

	errcor:
		new Controls.RadioBoxForm("errcor", "errcor", false),

	toPreview:
		new Controls.CheckBox("topreview", value => {
			document.documentElement.classList.toggle("preview", value);
		}, true),

	toInvert:
		new Controls.CheckBox("toinvert", value => {
			document.documentElement.classList.toggle("invertion", value);
		}),

	savingProjectName:
		new Controls.InputText("proj-name-to-save"),

	saveProject:
		new Controls.Button("save-proj-btn", () => {
			Project.current.save();
		}),

	fileInput:
		new Controls.InputFile("proj-to-open", files => {
			FilePortal.buffer = files;
			alert("file was loaded");
		}),

	openFile:
		new Controls.Button("open-proj-btn", () => {
			if (FilePortal.buffer) {
				QRT.readTQRT(FilePortal.buffer[0]).then((obj) => {

					let str = "\n\n";

					for (let y = 0; y < obj.matrix.rows + 1; y += 2) {
						for (let x = 0; x < obj.matrix.columns; x++) {
							if (obj.matrix.x2getD(x, y, 0) % 2) {
								if (obj.matrix.x2getD(x, y + 1, 0) % 2) {
									str += "\u2588";
								} else {
									str += "\u2580";
								}
							} else {
								if (obj.matrix.x2getD(x, y + 1, 0) % 2) {
									str += "\u2584";
								} else {
									str += "\u00a0";
								}
							}
						}
						str += "\n";
					}

					console.log(str);

					obj.maskApplication = Controls.maskApplication.value; // TEMP SOLVE

					Project.add(obj.name, obj, obj.matrix);
				});

				FilePortal.buffer = 0;
			}
		}),

	rotateWorkbenchRight:
		new Controls.Button("rotate-workbench-right", () => {
			const match = Project.canvasWrap.style.transform.match(/rotateZ\(\-?[0-9]+/);

			if (match !== null) {
				Project.canvasWrap.style.transform = Project.canvasWrap.style.transform.replace(/rotateZ\(\-?[0-9]+/,
					"rotateZ(" +
					parseInt((parseInt(match[0].slice(8), 10) + 90) % 360, 10)
				);
			} else {
				Project.canvasWrap.style.transform += " rotateZ(90deg)";
			}
		}),

	rotateWorkbenchLeft:
		new Controls.Button("rotate-workbench-left", () => {
			const match = Project.canvasWrap.style.transform.match(/rotateZ\(\-?[0-9]+/);

			if (match !== null) {
				Project.canvasWrap.style.transform = Project.canvasWrap.style.transform.replace(/rotateZ\(\-?[0-9]+/,
					"rotateZ(" +
					parseInt((parseInt(match[0].slice(8), 10) - 90) % 360, 10)
				);
			} else {
				Project.canvasWrap.style.transform += " rotateZ(-90deg)";
			}
		}),

	maskApplication:
		new Controls.RadioBoxForm("mask-overlay", "mskover", value => {
			Project.current.qrt.maskApplication = parseInt(value, 10);
			Project.current.qrt.updateCanvas(new Rect8(0, 0, 255, 255));
		}, false)
};

document.addEventListener("keydown", e => {
	if (e.ctrlKey) {
		switch (e.key) {
			case "e":
				popupBindings["edit"].popen();
				e.preventDefault();
				break;
			case "1":
				Project.current.fitCanvasArea();
				break;
			case "o":
				popupBindings["open"].popen();
				e.preventDefault();
				break;
			case "s":
				switch (Project.current.status) {
					case 0:
						popupBindings["save"].popen();
						break;
					case 2:
						Project.current.save();
						break;
				}
				e.preventDefault();
				break;
			case "S":
				console.log("save");
				// popupBindings["save"].popen();
				Project.current.qrt.downloadCanvas();
				e.preventDefault();
				break;
			case "z":
				Project.current.undo();
				e.preventDefault();
				break;
			case "Z":
				Project.current.redo();
				e.preventDefault();
				break;
		}
	}
});

window.addEventListener("load", () => {

	document.documentElement.style.setProperty("--vw-mod2", (window.innerWidth % 2) + "px");

	Project.add("qrt0", {
		version: 20,
		ecdepth: ControlsCollection.errcor.value,
		masktype: ControlsCollection.mask.value,
		maskApplication: ControlsCollection.maskApplication.value
	});
});

// window.onbeforeunload = e => { // ADD BEFORE PUBLICATION ON WEB !!!!!!!!!!
// 	return e.returnValue;
// };