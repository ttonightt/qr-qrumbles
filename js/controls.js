
const Controls = {
	CheckBox: class {
		constructor (id, trigger = false, trigImmidiately = false) {
			this.elem = document.getElementById(id);
			this.value = this.elem.checked ? (this.elem.value || 1) : 0;
			this.onchange = trigger;
			if (trigImmidiately && trigger) trigger(this.value);
		}
	
		set onchange (trigger) {
			if (isFunction(trigger)) {
				this.elem.onchange = () => {
					this.value = this.elem.checked ? (this.elem.value || 1) : 0;
					trigger(this.value);
				};
			} else {
				this.elem.onchange = () => {
					this.value = this.elem.checked ? (this.elem.value || 1) : 0;
				};
			}
		}
	},
	
	RadioBox: class {
		constructor (name, trigger = false, trigImmidiately = false) {
			this.value = 0;
			this.list;
	
			if (typeof name === "string") {
				this.list = document.getElementsByName(name);
	
				for (let i = 0; i < this.list.length; i++) {
					if (this.list[i].checked) this.value = this.list[i].value;
				}
	
				this.model = 0;
	
			} else if (typeof name === "object") {
				this.list = {};
	
				for (let key in name) {
					this.list[key] = {
						elem: document.getElementById(name[key])
					};
	
					if (this.list[key].elem.checked) {
						this.value = this.list[key].elem.value;
					}
				}
	
				this.model = 1;
			}
	
			this.onchange = trigger;
			if (trigImmidiately && isFunction(trigger)) trigger(this.value);
		}
	
		set onchange (trigger) {
			if (this.model) {
				for (let key in this.list) {
	
					if (isFunction(trigger)) {
	
						this.list[key].elem.onchange = () => {
	
							this.value = this.list[key].elem.value;
							trigger(this.value);
						};
					} else {
						this.list[key].elem.onchange = () => {
							this.value = this.list[key].elem.value;
						};
					}
				}
			} else {
				for (let i = 0; i < this.list.length; i++) {
	
					if (isFunction(trigger)) {
	
						this.list[i].onchange = () => {
							this.value = this.list[i].value;
							trigger(this.value)
						};
					} else {
						this.list[i].onchange = () => {
							this.value = this.list[i].value;
						};
					}
				}
			}
		}
	},
	
	Button: class {
		constructor (id, trigger = false) {
			this.elem = document.getElementById(id);
			this.onchange = trigger;
		}
	
		set onchange (trigger) {
			if (isFunction(trigger)) {
				this.elem.onclick = trigger;
			}
		}
	},
	
	InputText: class {
		constructor (id, trigger = false, trigImmidiately = false) {
			this.elem = document.getElementById(id);
			this.value = this.elem.value;
			this.onchange = trigger;
			if (trigImmidiately && isFunction(trigger)) trigger(this.value);
		}
	
		set onchange (trigger) {
			if (isFunction(trigger)) {
				this.elem.onchange = () => {
					this.value = this.elem.value;
					trigger(this.value);
				};
			} else {
				this.elem.onchange = () => {
					this.value = this.elem.value;
				};
			}
		}
	},
	
	InputFile: class {
		constructor (id, trigger) {
			this.elem = document.getElementById(id);
			this.onchange = trigger;
		}
	
		set onchange (trigger) {
			if (isFunction(trigger)) {
				this.elem.onchange = e => {
					trigger(e.target.files);
				};
			} else throw new Error("The only argument of InputFile.prototype.onchange must be a function!");
		}
	}
};

// TOOLS vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

let Tools = new Controls.RadioBox({
	brush: "brush-tool",
	line: "line-tool",
	circle: "circle-tool"
}, false);

Tools.list.brush.radius = 1;
Tools.list.line.width = 1;

Tools.list.brush.elem.nextElementSibling.addEventListener("wheel", e => {
	if (e.deltaY > 0 && Tools.list.brush.radius > 1) {
		Tools.list.brush.radius--;
	} else if (e.deltaY < 0 && Tools.list.brush.radius < 10) {
		Tools.list.brush.radius++;
	}

	if (!OneTitle.shown) {
		OneTitle.show(	e.clientX + 6,
						e.clientY - 6,
						"Brush radius: " + Tools.list.brush.radius,
						{pivot: 2});
	} else {
		OneTitle.log("Brush radius: " + Tools.list.brush.radius);
	}
});

Tools.list.brush.elem.nextElementSibling.addEventListener("mouseleave", () => {
	if (OneTitle.shown) {
		OneTitle.hide();
	}
});

Tools.list.line.elem.nextElementSibling.addEventListener("wheel", e => {
	if (e.deltaY > 0 && Tools.list.line.width > 1) {
		Tools.list.line.width--;
	} else if (e.deltaY < 0 && Tools.list.line.width < 10) {
		Tools.list.line.width++;
	}

	if (!OneTitle.shown) {
		OneTitle.show(	e.clientX + 6,
						e.clientY - 6,
						"Line width: " + Tools.list.line.width,
						{pivot: 2});
	} else {
		OneTitle.log("Line width: " + Tools.list.line.width);
	}
});

Tools.list.line.elem.nextElementSibling.addEventListener("mouseleave", () => {
	if (OneTitle.shown) {
		OneTitle.hide();
	}
});

// GLOBAL KEYBINDINGS vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

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
				popupBindings["save"].popen();
				e.preventDefault();
				break;
			case "z":
				Project.current.undo();
				break;
			case "Z":
				Project.current.redo();
				break;
		}
	}

	// console.log(e.keyCode);

	if (e.keyCode === 45) { // INS
		DBMChars.toggleTypingMode();
		datablocksmap.ichars.input.selecti(0, 1);

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