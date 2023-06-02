
class DatablockMap {
	constructor (qr) {
		switch (qr.datatype) {
			case 7:
				this.values = ;
				this.datablocks = ;
				break;
			case 4:
				this.values = new Uint8Array();
				this.datablocks = ;
				break;
			case 2:
				this.values = new Uint16Array();
				this.datablocks = "/u+200d";
				break;
		}
		createMask(qr);
		createChars(qr);
	}

	createMask (qr) {

	}

	createChars (qr) {

	}
}

class valueCell {
	constructor () {

	}
}

class InputFromCluster {
	constructor (value) {
		this.elem = document.createElement("input");
		this.elem.type = "text";
		this.elem.maxLength = 1;
		this.elem.name = "decoded";
		this.elem.value = value;
		this.value = value;

		this.elem.addEventListener("keydown", e => {
			if (e.keyCode == 39 && (this.elem.selectionEnd == 1 || (this.elem.selectionStart == 0 && this.elem.value.length == 0)) && this.elem.nextElementSibling != null) {
				this.elem.nextElementSibling.focus();
			} else if (e.keyCode == 37 && this.elem.selectionStart == 0 && this.elem.previousElementSibling != null) {
				this.elem.previousElementSibling.focus();
			}
		});

		document.querySelector(".decoded-wrap").appendChild(this.elem);
	}
}

let DCD = {
	charios: [],
	scanCharIOs: () => {
		this.charios = [];
		for (let i = 0; i < 12; i++) {
			charios[i] = new InputFromCluster("h");
		}
	},
};

DCD.scanCharIOs();