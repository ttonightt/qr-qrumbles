class Control {
	constructor (type, sw, trigger = 0) {
		switch (type) {
			case "radio":
				this.elems = document.getElementsByName(sw);
				this._addEventToRB(trigger);
				break;
			case "checkbox":
				this.elem = document.getElementById(sw);
				this._addEventToCB(trigger);
				break;
		}
	}

	_addEventToRB (trigger) {
		for (let i = 0; i < this.elems.length; i++) {
			if (this.elems[i].checked) {
				this.value = this.elems[i].value;
			}

			this.elems[i].addEventListener("change", () => {
				this.value = this.elems[i].value;
				if (trigger != 0) {
					trigger();
				}
			});
		}
	}

	_addEventToCB (trigger) {
		this.value = this.elem.checked;

		this.elem.addEventListener("change", () => {
			this.value = this.elem.checked;
			if (trigger != 0) {
				trigger();
			}
		});
	}
}

const Controls = {};

document.onkeydown = e => {
    if (e.ctrlKey) {
        switch (e.key) {
            case "e":
                popupBindings["edit"].popen();
                e.preventDefault();
        }
    }
};