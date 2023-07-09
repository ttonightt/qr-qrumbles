class CheckBox {
	constructor (id, trigger = false, trigImmidiately = false) {
		this.elem = document.getElementById(id);
		this.value = this.elem.checked ? (this.elem.value || 1) : 0;
		this.onchange = trigger;
		if (trigImmidiately && trigger) trigger(this.value);
	}

	set onchange (trigger) {
		this.elem.onchange = () => {
			this.value = this.elem.checked ? (this.elem.value || 1) : 0;
			if (trigger) trigger(this.value);
		};
	}
}

class RadioBox {
	constructor (name, trigger = false, trigImmidiately = false) {
		this.value = 0;
		this.list;

		if (typeof name == "string") {
			this.list = document.getElementsByName(name);

			for (let i = 0; i < this.list.length; i++) {
				if (this.list[i].checked) this.value = this.list[i].value;
			}

			this.model = 0;
		} else if (typeof name == "object") {
			this.list = {};
			this.radioKeys = Object.keys(name);

			for (let i = 0; i < this.radioKeys.length; i++) {
				this.list[this.radioKeys[i]] = {elem: document.getElementById(name[this.radioKeys[i]])};

				if (this.list[this.radioKeys[i]].elem.checked) {
					this.value = this.list[this.radioKeys[i]].elem.value;
				}
			}

			this.model = 1;
		}

		this.onchange = trigger;
		if (trigImmidiately && trigger) trigger(this.value);
	}

	set onchange (trigger) {
		if (this.model) {
			for (let i = 0; i < this.radioKeys.length; i++) {

				this.list[this.radioKeys[i]].elem.onchange = () => {
					this.value = this.list[this.radioKeys[i]].elem.value;
					if (trigger) trigger(this.value);
				};
			}
		} else {
			for (let i = 0; i < this.list.length; i++) {

				this.list[i].onchange = () => {
					this.value = this.list[i].value;
					if (trigger) trigger(this.value);
				};
			}
		}
	}
}

class Button {
	constructor (id, trigger = false) {
		this.elem = document.getElementById(id);
		this.onchange = trigger;
	}

	set onchange (trigger) {
		if (trigger) {
			this.elem.onclick = trigger;
		}
	}
}

const Controls = {};

// TOOLS vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

let Tools = new RadioBox({
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
				setWorkspaceSize();
				break;
		}
	}

	// console.log(e.keyCode);

	if (e.keyCode === 45) { // INS
		InterCharMap.typingMode ^= 1;
		datablocksmap.ichars.input.selecti(0, 1);

		OneTitle.show(
			document.documentElement.clientWidth / 2,
			20,
			"Edit typing mode is " + (InterCharMap.typingMode ? "on" : "off"),
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