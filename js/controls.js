class CheckBox {
	constructor (name, trigger = false) {
		this.value = 0;

		this.elem = document.getElementById(name);
		this.setOnChange(trigger);
	}

	setOnChange (trigger) {
		this.value = this.elem.checked;

		this.elem.addEventListener("change", () => {
			this.value = this.elem.checked;
			if (trigger) {
				trigger();
			}
		});
	}
}

class RadioBox {
	constructor (name, trigger = false, toObj = {attr: "", wordi: 0, ignore: "-"}) {
		this.value = 0;
		this.model = 0;

		const _elems = document.getElementsByName(name);

		if (toObj.attr == "") {
			this.elems = _elems;
		} else {
			let address;

			for (let i = 0; i < _elems.length; i++) {
				address = _elems[i].getAttribute(toObj.attr);

				if (toObj.wordi > 0) {
					address = address.split(toObj.ignore)[toObj.wordi - 1];
				} else if (toObj.wordi == 0) {
					address = address.replaceAll(toObj.ignore, "");
				} else {
					address = address.split(toObj.ignore);
					address = address[address.length + toObj.wordi];
				}

				if (address == "elems") console.warn("Setting name \"elems\" of control while converting to object may be consfused with common name elems");

				this[address] = {elem: _elems[i]};
			}

			this.model = 1;
		}

		this.setOnChange(trigger);
	}

	setOnChange (trigger) {
		if (this.model) {
			const keys = Object.keys(this);

			for (let i = 2; i < keys.length; i++) {
				if (this[keys[i]].elem.checked) {
					this.value = this[keys[i]].elem.value;
				}
	
				this[keys[i]].elem.addEventListener("change", () => {
					this.value = this[keys[i]].elem.value;
					if (trigger) {
						trigger();
					}
				});
			}
		} else {
			for (let i = 0; i < this.elems.length; i++) {
				if (this.elems[i].checked) {
					this.value = this.elems[i].value;
				}

				this.elems[i].addEventListener("change", () => {
					this.value = this.elems[i].value;
					if (trigger) {
						trigger();
					}
				});
			}
		}
	}
}

const Controls = {};

// TOOLS vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

let Tools = new RadioBox("tool", false, {attr: "id", wordi: 1, ignore: "-"});

Tools.brush.radius = 1;
Tools.line.width = 1;

Tools.brush.elem.nextElementSibling.addEventListener("wheel", e => {
	if (e.deltaY > 0 && Tools.brush.radius > 1) {
		Tools.brush.radius--;
	} else if (e.deltaY < 0 && Tools.brush.radius < 10) {
		Tools.brush.radius++;
	}

	if (!OneTitle.shown) {
		OneTitle.show(	"Brush radius: " + Tools.brush.radius,
						"blink",
						e.clientX + 6,
						e.clientY - 6,
						2);
	} else {
		OneTitle.log("Brush radius: " + Tools.brush.radius);
	}
});

Tools.brush.elem.nextElementSibling.addEventListener("mouseleave", () => {
	if (OneTitle.shown) {
		OneTitle.hide();
	}
});

Tools.line.elem.nextElementSibling.addEventListener("wheel", e => {
	if (e.deltaY > 0 && Tools.line.width > 1) {
		Tools.line.width--;
	} else if (e.deltaY < 0 && Tools.line.width < 10) {
		Tools.line.width++;
	}

	if (!OneTitle.shown) {
		OneTitle.show(	"Line width: " + Tools.line.width,
						"blink",
						e.clientX + 6,
						e.clientY - 6,
						2);
	} else {
		OneTitle.log("Line width: " + Tools.line.width);
	}
});

Tools.line.elem.nextElementSibling.addEventListener("mouseleave", () => {
	if (OneTitle.shown) {
		OneTitle.hide();
	}
});

// GLOBAL KEYBINDINGS vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

document.onkeydown = e => {
	if (e.ctrlKey) {
		switch (e.key) {
			case "e":
				popupBindings["edit"].popen();
				e.preventDefault();
				break;
			case "1":
				setWorkspaceSize();
				break;
		}
	}

	if (e.keyCode == 45) {
		InterCharMap.changeTypingMode();
		OneTitle.show("Ins " + (InterCharMap.typingMode ? "on" : "off"), "blink", document.documentElement.clientWidth / 2, 20, 3)
	};
};