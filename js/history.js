class History {
	static BitmapArea = class {
		static log (bmarea) {
			if (bmarea instanceof this) {
				let str = "";

				for (let y = 0; y < bmarea.matrix.rows; y += 2) {
					for (let x = 0; x < bmarea.matrix.columns; x++) {
						if (bmarea.matrix.x2get(x, y)) {
							if (bmarea.matrix.x2getD(x, y + 1, 0)) {
								str += "\u2588";
							} else {
								str += "\u2580";
							}
						} else {
							if (bmarea.matrix.x2getD(x, y + 1, 0)) {
								str += "\u2584";
							} else {
								str += "\u00a0";
							}
						}
					}
					str += "\n";
				}

				console.log(str);
			}
		}

		constructor (mx, refmx, rect8) {
			if (mx instanceof Uint8ArrayX2 && refmx instanceof Uint8ArrayX2 && mx.columns === refmx.columns && mx.rows === refmx.rows) {
				if (rect8 instanceof Rect8) {
					this.x0 = rect8[0];
					this.y0 = rect8[1];
					this.width = rect8[2] - rect8[0] + 1;
					this.height = rect8[3] - rect8[1] + 1;
				} else {
					this.x0 = 0;
					this.y0 = 0;
					this.width = mx.columns;
					this.height = mx.rows;
				}

				this.matrix = new Uint8ArrayX2(this.height, this.width);

				if (this.width === 1) {
					for (let i = 0; i < this.height; i++) {
						if (mx.x2get(0, i + this.y0) !== refmx.x2get(0, i + this.y0)) this.matrix.x2set(0, i, 1);
					}
				} else {
					for (let i = 0; i < this.width; i++) {
						for (let j = 0; j < this.height; j++) {
							if (mx.x2get(i + this.x0, j + this.y0) !== refmx.x2get(i + this.x0, j + this.y0)) this.matrix.x2set(i, j, 1);
						}
					}
				}
			} else throw new Error("..."); // <<<
		}
	}

	constructor () {
		this.commits = [];
		this.length = 100;
		this.__index = 0;
		this.__temp = 0;
	}

	push (commit) {
		if (commit instanceof History.BitmapArea) {
			if (this.__index < this.commits.length - 1) {
				this.commits.splice(this.__index, this.commits.length - this.__index);
			}

			this.commits.push(commit);

			if (this.commits.length > this.length) {
				this.commits.shift();
			} else {
				this.__index++;
			}
		} else throw new Error("..."); // <<<
	}

	backup () {
		if (this.__index > 0 && this.commits.length > 0) {
			return this.commits[--this.__index];

		} else return 0;
	}

	nextup () {
		if (this.__index < this.commits.length) {
			return this.commits[this.__index++];

		} else return 0;
	}
}


const hhh = new History();