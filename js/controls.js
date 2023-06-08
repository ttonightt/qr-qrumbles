class Control {
	constructor (type, sw, trigger = 0) {
		this.value = 0;
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
				break;
			case "1":
				setWorkspaceSize();
				break;
        }
    }
};

// TOOLS vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

let Tools = new Control("radio", "tool");
Tools.settings = {
	brush: {
		radius: 1,
	}
};
Tools.events = {
	changeRadiusOnWheel: (e) => {
		if (!OneTitle.shown) {
			OneTitle.show(	"Brush radius: " + Tools.settings.brush.radius,
							"blink",
							e.clientX + 6,
							e.clientY - 6,
							2);
		} else {
			OneTitle.log("Brush radius: " + Tools.settings.brush.radius);
		}
	
		if (e.deltaY > 0 && Tools.settings.brush.radius > 1) {
			Tools.settings.brush.radius--;
		} else if (e.deltaY < 0 && Tools.settings.brush.radius < 10) {
			Tools.settings.brush.radius++;
		}
	}
};

Tools.elems[0].nextElementSibling.addEventListener("wheel", e => {
	Tools.events.changeRadiusOnWheel(e);
});

Tools.elems[0].nextElementSibling.addEventListener("mouseleave", () => {
	if (OneTitle.shown) {
		OneTitle.hide();
	}
});