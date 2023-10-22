
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

	RadioBoxForm: class {
		constructor (formid, nameOref, trigger = false, trigImmidiately = false) {
			this.form = document.getElementById(formid);

			if (this.form instanceof HTMLFormElement) {

				if (typeof nameOref === "string") {
					const radios = this.form.elements.namedItem(nameOref);

					if (radios instanceof RadioNodeList) {
						this.list = radios;

						for (let i = 0; i < this.list.length; i++) {
							if (this.list[i].checked) {
								this.value = this.list[i].value;
							}
						}
					} else if (radios instanceof HTMLInputElement && radios.type === "radio") {
						this.list = [radios];

						if (this.list[0].checked) this.value = this.list[0].value;
					} else {
						this.list = [];
					}

					this.listModel = 0;

				} else if (typeof nameOref === "object") {
					this.list = {};

					for (const key in nameOref) {
						const radio = this.form.elements.namedItem(key);

						if (radio instanceof HTMLInputElement && radio.type === "radio") {
							this.list[nameOref[key]] = {elem: radio};

							if (radio.checked) {
								this.value = radio.value;
							}
						}
					}

					this.listModel = 1;
				}
			} else throw new Error("..."); // <<<

			this.onchange = trigger;
			if (trigImmidiately && isFunction(trigger)) trigger(this.value);
		}

		set onchange (trigger) {
			if (isFunction(trigger)) {
				this.form.onchange = e => {
					this.value = e.target.value;
					trigger(this.value);
				};
			} else {
				this.form.onchange = e => {
					this.value = e.target.value;
				};
			}
		}

		add (input, id) {
			if (!(input instanceof HTMLInputElement && input.type === "radio")) throw new Error("..."); // <<<
			if (this.listModel === 1) {

				if (id && id !== "") {
					this.list[id] = {elem: input};

				} else throw new Error("..."); // <<<
			} else {
				this.list.push(input);
			}

			if (input.checked) this.value = input.value;

			this.form.appendChild(input);
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
			this.__value = this.elem.value;
			this.onchange = trigger;
			if (trigImmidiately && isFunction(trigger)) trigger(this.__value);
		}

		set onchange (trigger) {
			if (isFunction(trigger)) {
				this.elem.onchange = () => {
					this.__value = this.elem.value;
					trigger(this.value);
				};
			} else {
				this.elem.onchange = () => {
					this.__value = this.elem.value;
				};
			}
		}

		set value (value) {
			if (new RegExp(this.elem.pattern).test(value) && this.elem.minLength <= value.length) {

				if (this.elem.maxLength > 0 && value.length > this.elem.maxLength) value = value.slice(0, this.elem.maxLength);

				this.__value = value;
				this.elem.value = value;
			} else throw new Error("You tried to set invalid value statement of input through js!");
		}

		get value () {
			return this.__value;
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

const Tools = new Controls.RadioBoxForm("tools", {
	"brush-tool": "brush",
	"circle-tool": "circle",
	"line-tool": "line"
}, false, false);

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