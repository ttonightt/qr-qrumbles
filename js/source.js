const canvas = document.getElementById("main");

// CWMap.init(document.getElementById("map"));
Charmap.init(document.getElementById("charmap-markup"), document.getElementById("charmap-textarea"));

QRT.init(canvas);

Project.init(
	canvas.parentElement.parentElement,
	canvas.parentElement,
);

// CONTROLS CONNECTING vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

Controls.project = new Controls.RadioBoxForm("project-tabs", "project-tab", value => {
	console.log("e");
});

Controls.mask = new Controls.RadioBoxForm("mask", "mask", value => {
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
}, false);

Controls.errcor = new Controls.RadioBoxForm("errcor", "errcor", false);

Controls.datatype = new Controls.RadioBoxForm("datatype", "dtype", false);

// Controls.cwmapOverlay = new Controls.RadioBoxForm("datablock-overlay", "dtbmapover", value => {
// 	switch (value) {
// 		case "0":
// 			CWMap.canvas.classList.remove("disabled");
// 			CWMap.canvas.classList.remove("active");
// 			break;
// 		case "1":
// 			CWMap.canvas.classList.remove("active");
// 			CWMap.canvas.classList.add("disabled");
// 			break;
// 		case "2":
// 			CWMap.canvas.classList.remove("disabled");
// 			CWMap.canvas.classList.add("active");
// 			break;
// 	}
// }, true);

Controls.toPreview = new Controls.CheckBox("topreview", value => {
	document.documentElement.classList.toggle("preview", value);
});

Controls.toInvert = new Controls.CheckBox("toinvert", value => {
	document.documentElement.classList.toggle("invertion", value);
});

Controls.toDecode = new Controls.Button("updatectrl-fromcanv", () => {
});

Controls.toEncode = new Controls.Button("updatectrl-tocanv", () => {
});

Controls.toEncodeEC = new Controls.Button("ec-toencode", () => {
});

Controls.automaticDecode = new Controls.CheckBox("updatectrl-fromcanv-auto", value => {
	Controls.toDecode.elem.disabled = value;
}, true);

Controls.automaticEncode = new Controls.CheckBox("updatectrl-tocanv-auto", value => {
	Controls.toEncode.elem.disabled = value;
}, true);

Controls.automaticECEncode = new Controls.CheckBox("ec-toencode-auto", value => {
	Controls.toEncodeEC.elem.disabled = value;
}, true);

Controls.savingProjectName = new Controls.InputText("proj-name-to-save");

Controls.saveProject = new Controls.Button("save-proj-btn", () => {
	Project.current.save();
});

Controls.fileInput = new Controls.InputFile("proj-to-open", files => {
	FilePortal.buffer = files;
	alert("file was loaded");
});

Controls.openFile = new Controls.Button("open-proj-btn", () => {
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
});

Controls.rotateWorkbenchRight = new Controls.Button("rotate-workbench-right", () => {
	const match = Project.canvasWrap.style.transform.match(/rotateZ\(\-?[0-9]+/);

	if (match !== null) {
		Project.canvasWrap.style.transform = Project.canvasWrap.style.transform.replace(/rotateZ\(\-?[0-9]+/,
			"rotateZ(" +
			parseInt((parseInt(match[0].slice(8), 10) + 90) % 360, 10)
		);
	} else {
		Project.canvasWrap.style.transform += " rotateZ(90deg)";
	}
});

Controls.rotateWorkbenchLeft = new Controls.Button("rotate-workbench-left", () => {
	const match = Project.canvasWrap.style.transform.match(/rotateZ\(\-?[0-9]+/);

	if (match !== null) {
		Project.canvasWrap.style.transform = Project.canvasWrap.style.transform.replace(/rotateZ\(\-?[0-9]+/,
			"rotateZ(" +
			parseInt((parseInt(match[0].slice(8), 10) - 90) % 360, 10)
		);
	} else {
		Project.canvasWrap.style.transform += " rotateZ(-90deg)";
	}
});

Controls.maskApplication = new Controls.RadioBoxForm("mask-overlay", "mskover", value => {
	Project.current.qrt.maskApplication = parseInt(value, 10);
	Project.current.qrt.updateCanvas(new Rect8(0, 0, 255, 255));
}, false);

const Keybindings = {
	ins: false,
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
				popupBindings["save"].popen();
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

	// console.log(e.keyCode);

	if (e.key === "Insert") {
		Charmap.mode = Charmap.mode ^ 1;

		OneTitle.show(
			document.documentElement.clientWidth / 2,
			20,
			"Edit typing mode is " + (DBMChars.typingMode ? "on" : "off"),
			{pivot: 3, timeOut: 2000}
		);
	} else if (e.keyCode === 9) { // TAB
		if (!datablocksmap.ichars.input.focused) e.preventDefault();
		datablocksmap.ichars.input.focus();
		datablocksmap.ichars.input.selecti(0, 1);
	} else if (e.keyCode === 8 && e.target.tagName !== "INPUT") {
		e.preventDefault();
	}
});

// QRT CREATION vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

Project.add("QRt #" + Project.list.length, {
	version: 20,
	ecdepth: Controls.errcor.value,
	masktype: Controls.mask.value,
	datatype: 7, // Controls.datatype.value
	maskApplication: Controls.maskApplication.value
});

const newTabInput = document.createElement("input");

newTabInput.id = "proj-" + Project.current.name;
newTabInput.value = Project.current.name;
newTabInput.name = "project-tab";
newTabInput.type = "radio";

new Promise(resolve => {
	resolve(
		document.getElementById("project-tabs").appendChild(newTabInput)
	);
}).then(() => {
	const newTabLabel = document.createElement("label");

	newTabInput.checked = true;
	newTabLabel.insertAdjacentHTML("beforeend", `${Project.current.name}<i class="closer">x</i>`);
	newTabLabel.setAttribute("for", newTabInput.id);
	document.getElementById("project-tabs").appendChild(newTabLabel);
});

Controls.project.add(newTabInput);

let datablocksmap;

window.onload = () => {
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

// -------------------------------------------------------------------------------------------

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
	Object.defineProperty(popupElements[i], "onpopen", {
		set: (fnc) => {
			if (isFunction(fnc)) {
				popupElements[i].popen = () => {
					fnc(popupElements[i]);
					popupElements[i].classList.add("active");
					popupElements[0].parentElement.classList.add("visible");
				};
			}
		}
	});

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
		popupBindings[caller.getAttribute("data-popup").replaceAll("-", "")].popen();
		popupElements[0].parentElement.classList.add("visible");
	});
}

popupBindings["save"].onpopen = () => {
	if (Controls.savingProjectName.value !== Project.current.name) Controls.savingProjectName.value = Project.current.name; // ТРЕБА ПЕРЕВІРИТИ ЧИ З IF'ОМ ШВИДШЕ АНІЖ ЮЕЗ НЬОГО
};