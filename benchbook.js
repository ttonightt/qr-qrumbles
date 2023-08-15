const ctx = document.createElement("canvas").getContext("2d");

function rrr () {
	return Math.round(1 + (Math.random() * 99)) * ((Math.random > 0.5) ? 1 : -1);
}

function rr () {
	return Math.round(Math.random() * 100);
}

class Uint8ArrayX2 extends Uint8Array {
	constructor (arrOrows, columns) {
		if (!columns) {
			if (arrOrows instanceof Uint8ArrayX2) {
				super(arrOrows.rows * arrOrows.columns);
				this.rows = arrOrows.rows;
				this.columns = arrOrows.columns;

				for (let i = 0; i < arrOrows.length; i++) {
					this[i] = arrOrows[i];
				}
			}
		} else if (typeof columns === "number" && columns > 0) {

			if (typeof arrOrows === "number" && 0 < arrOrows) {
				super(arrOrows * columns);
				this.rows = arrOrows;
				this.columns = columns;

			} else if (
				// arrOrows.length > columns &&
				(arrOrows instanceof Array ||
				arrOrows instanceof Uint8ArrayX2 ||
				arrOrows instanceof Int8Array ||
				arrOrows instanceof Uint8Array ||
				arrOrows instanceof Uint8ClampedArray)
				) {
				super(Math.ceil(arrOrows.length / columns) * columns);
				this.rows = Math.ceil(arrOrows.length / columns);
				this.columns = columns;
				for (let i = 0; i < arrOrows.length; i++) {
					this[i] = arrOrows[i];
				}
			} else throw new Error("First argument is invalid or was lost!");

		} else throw new Error("..."); // <<<
	}

	x2get (x = 0, y = 0) {
		return this[(y * this.columns) + x];
	}

	x2getD (x = 0, y = 0, wrong) {
		if (0 <= x && x < this.columns && 0 <= y && y < this.rows) {
			return this[(y * this.columns) + x];
		} else {
			return wrong;
		}
	}

	x2set (x = 0, y = 0, int) {
		this[(y * this.columns) + x] = int;
	}

	x2setD (x = 0, y = 0, int) {
		if (0 <= x && x < this.columns && 0 <= y && y < this.rows) {
			this[(y * this.columns) + x] = int;
		}
	}
}

const circles = {
    2: new Uint8ArrayX2([
        1,1,
        1,1,
    ], 2),

    3: new Uint8ArrayX2([
        0,1,0,
        1,1,1,
        0,1,0
    ], 3),

    4: new Uint8ArrayX2([
        0,1,1,0,
        1,1,1,1,
        1,1,1,1,
        0,1,1,0
    ], 4),

    5: new Uint8ArrayX2([
        0,1,1,1,0,
        1,1,1,1,1,
        1,1,1,1,1,
        1,1,1,1,1,
        0,1,1,1,0
    ], 5),

    6: new Uint8ArrayX2([
        0,1,1,1,1,0,
        1,1,1,1,1,1,
        1,1,1,1,1,1,
        1,1,1,1,1,1,
        1,1,1,1,1,1,
        0,1,1,1,1,0
    ], 6),

    7: new Uint8ArrayX2([
        0,0,1,1,1,0,0,
        0,1,1,1,1,1,0,
        1,1,1,1,1,1,1,
        1,1,1,1,1,1,1,
        1,1,1,1,1,1,1,
        0,1,1,1,1,1,0,
        0,0,1,1,1,0,0
    ], 7),

    8: new Uint8ArrayX2([
        0,0,1,1,1,1,0,0,
        0,1,1,1,1,1,1,0,
        1,1,1,1,1,1,1,1,
        1,1,1,1,1,1,1,1,
        1,1,1,1,1,1,1,1,
        1,1,1,1,1,1,1,1,
        0,1,1,1,1,1,1,0,
        0,0,1,1,1,1,0,0
    ], 8),

    9: new Uint8ArrayX2([
        0,0,0,1,1,1,0,0,0,
        0,1,1,1,1,1,1,1,0,
        0,1,1,1,1,1,1,1,0,
        1,1,1,1,1,1,1,1,1,
        1,1,1,1,1,1,1,1,1,
        1,1,1,1,1,1,1,1,1,
        0,1,1,1,1,1,1,1,0,
        0,1,1,1,1,1,1,1,0,
        0,0,0,1,1,1,0,0,0
    ], 9),

    10: new Uint8ArrayX2([
        0,0,0,1,1,1,1,0,0,0,
        0,0,1,1,1,1,1,1,0,0,
        0,1,1,1,1,1,1,1,1,0,
        1,1,1,1,1,1,1,1,1,1,
        1,1,1,1,1,1,1,1,1,1,
        1,1,1,1,1,1,1,1,1,1,
        1,1,1,1,1,1,1,1,1,1,
        0,1,1,1,1,1,1,1,1,0,
        0,0,1,1,1,1,1,1,0,0,
        0,0,0,1,1,1,1,0,0,0
    ], 10)
};

const fcircles = {
    2: new Uint8ArrayX2([
        1,1,
        1,1,
    ], 2),

    3: new Uint8ArrayX2([
        0,1,0,
        1,1,1,
        0,1,0
    ], 3),

    4: new Uint8ArrayX2([
        0,1,1,0,
        1,1,1,1,
        1,1,1,1,
        0,1,1,0
    ], 4),

    5: new Uint8ArrayX2([
        0,1,1,1,0,
        1,1,0,1,1,
        1,0,0,0,1,
        1,1,0,1,1,
        0,1,1,1,0
    ], 5),

    6: new Uint8ArrayX2([
        0,1,1,1,1,0,
        1,1,0,0,1,1,
        1,0,0,0,0,1,
        1,0,0,0,0,1,
        1,1,0,0,1,1,
        0,1,1,1,1,0
    ], 6),

    7: new Uint8ArrayX2([
        0,0,1,1,1,0,0,
        0,1,1,0,1,1,0,
        1,1,0,0,0,1,1,
        1,0,0,0,0,0,1,
        1,1,0,0,0,1,1,
        0,1,1,0,1,1,0,
        0,0,1,1,1,0,0
    ], 7),

    8: new Uint8ArrayX2([
        0,0,1,1,1,1,0,0,
        0,1,1,0,0,1,1,0,
        1,1,0,0,0,0,1,1,
        1,0,0,0,0,0,0,1,
        1,0,0,0,0,0,0,1,
        1,1,0,0,0,0,1,1,
        0,1,1,0,0,1,1,0,
        0,0,1,1,1,1,0,0
    ], 8),

    9: new Uint8ArrayX2([
        0,0,0,1,1,1,0,0,0,
        0,1,1,1,0,1,1,1,0,
        0,1,0,0,0,0,0,1,0,
        1,1,0,0,0,0,0,1,1,
        1,0,0,0,0,0,0,0,1,
        1,1,0,0,0,0,0,1,1,
        0,1,0,0,0,0,0,1,0,
        0,1,1,1,0,1,1,1,0,
        0,0,0,1,1,1,0,0,0
    ], 9),

    10: new Uint8ArrayX2([
        0,0,0,1,1,1,1,0,0,0,
        0,0,1,1,0,0,1,1,0,0,
        0,1,1,0,0,0,0,1,1,0,
        1,1,0,0,0,0,0,0,1,1,
        1,0,0,0,0,0,0,0,0,1,
        1,0,0,0,0,0,0,0,0,1,
        1,1,0,0,0,0,0,0,1,1,
        0,1,1,0,0,0,0,1,1,0,
        0,0,1,1,0,0,1,1,0,0,
        0,0,0,1,1,1,1,0,0,0
    ], 10)
};

// --------------------------------------

let x0 = rr();
let y0 = rr();
let x = x0 + rrr();
let y = y0 + rrr();

// --------------------------------------

const brush = circles[Math.round(2 + (Math.random() * 8))];

let dx = (x - x0), dy = (y - y0);

let apply;

if (brush instanceof Uint8ArrayX2) {
    const bw2 = Math.floor(brush.columns / 2);
    const bh2 = Math.floor(brush.rows / 2);

    const _bw = Math.abs(((dy || 1) / dx) * brush.rows);
    const _bh = Math.abs(brush.columns / ((dy || 1) / dx));

    let bw, bh, bx, by;

    if (_bw / brush.columns < _bh / brush.rows) {
        if (dx > 0) {
            bw = brush.columns;
            bx = Math.floor((brush.columns - _bw) / 2);
        } else {
            bw = Math.ceil((brush.columns + _bw) / 2);
            bx = 0;
        }

        bh = brush.rows;
        by = 0;
    } else {
        if (dy > 0) {
            bh = brush.rows;
            by = Math.floor((brush.rows - _bh) / 2);
        } else {
            bh = Math.ceil((brush.rows + _bh) / 2);
            by = 0;
        }

        bw = brush.columns;
        bx = 0;
    }

    apply = (x, y) => {
        for (let i = bx; i < bw; i++) {
            for (let j = by; j < bh; j++) {
                if (brush.x2get(i, j) === 1 && 1 < 2) {
                    ctx.fillRect(x - bw2 + i, y - bh2 + j, 1, 1);
                }
            }
        }
    };
} else {
    apply = (x, y) => {
        if (1 < 2) {
            ctx.fillRect(x, y, 1, 1);
        }
    };
}

if (Math.abs(dx) < Math.abs(dy)) {
    if (dy < 0) {
        x = -dx;
        y = -dy;
        x0 += dx;
        y0 += dy;
        dx = -dx;
        dy = -dy;
    }

    const k = dx / dy;
    for (y = 1; y <= dy; y++) {
        apply(Math.round(y * k) + x0, y + y0);
    }
} else {
    if (dx < 0) {
        x = -dx;
        y = -dy;
        x0 += dx;
        y0 += dy;
        dx = -dx;
        dy = -dy;
    }

    const k = dy / dx;
    for (x = 1; x <= dx; x++) {
        apply(x + x0, Math.round(x * k) + y0);
    }
}

// -------------------------------------------

const brush = fcircles[Math.round(2 + (Math.random() * 8))];

let dx = (x - x0), dy = (y - y0);

let apply;

if (brush instanceof Uint8ArrayX2) {
    const bw2 = Math.floor(brush.columns / 2);
    const bh2 = Math.floor(brush.rows / 2);

    const _bw = Math.abs(((dy || 1) / dx) * brush.rows);
    const _bh = Math.abs(brush.columns / ((dy || 1) / dx));

    let bw, bh, bx, by;

    if (_bw / brush.columns < _bh / brush.rows) {
        if (dx > 0) {
            bw = brush.columns;
            bx = Math.floor((brush.columns - _bw) / 2);
        } else {
            bw = Math.ceil((brush.columns + _bw) / 2);
            bx = 0;
        }

        bh = brush.rows;
        by = 0;
    } else {
        if (dy > 0) {
            bh = brush.rows;
            by = Math.floor((brush.rows - _bh) / 2);
        } else {
            bh = Math.ceil((brush.rows + _bh) / 2);
            by = 0;
        }

        bw = brush.columns;
        bx = 0;
    }

    apply = (x, y) => {
        for (let i = bx; i < bw; i++) {
            for (let j = by; j < bh; j++) {
                if (brush.x2get(i, j) === 1 && 1 < 2) {
                    ctx.fillRect(x - bw2 + i, y - bh2 + j, 1, 1);
                }
            }
        }
    };
} else {
    apply = (x, y) => {
        if (1 < 2) {
            ctx.fillRect(x, y, 1, 1);
        }
    };
}

if (Math.abs(dx) < Math.abs(dy)) {
    if (dy < 0) {
        x = -dx;
        y = -dy;
        x0 += dx;
        y0 += dy;
        dx = -dx;
        dy = -dy;
    }

    const k = dx / dy;
    for (y = 1; y <= dy; y++) {
        apply(Math.round(y * k) + x0, y + y0);
    }
} else {
    if (dx < 0) {
        x = -dx;
        y = -dy;
        x0 += dx;
        y0 += dy;
        dx = -dx;
        dy = -dy;
    }

    const k = dy / dx;
    for (x = 1; x <= dx; x++) {
        apply(x + x0, Math.round(x * k) + y0);
    }
}

// -------------------------------------------

const brush = circles[Math.round(2 + (Math.random() * 8))];

let dx = (x - x0), dy = (y - y0);

let apply;

if (brush instanceof Uint8ArrayX2) {
    const bw2 = Math.floor(brush.columns / 2);
    const bh2 = Math.floor(brush.rows / 2);

    apply = (x, y) => {
        for (let i = 0; i < brush.columns; i++) {
            for (let j = 0; j < brush.rows; j++) {
                if (brush.x2get(i, j) === 1 && 1 < 2) {
                    ctx.fillRect(x - bw2 + i, y - bh2 + j, 1, 1);
                }
            }
        }
    };
} else {
    apply = (x, y) => {
        if (1 < 2) {
            ctx.fillRect(x, y, 1, 1);
        }
    };
}

if (Math.abs(dx) < Math.abs(dy)) {
    if (dy < 0) {
        x = -dx;
        y = -dy;
        x0 += dx;
        y0 += dy;
        dx = -dx;
        dy = -dy;
    }

    const k = dx / dy;
    for (y = 1; y <= dy; y++) {
        apply(Math.round(y * k) + x0, y + y0);
    }
} else {
    if (dx < 0) {
        x = -dx;
        y = -dy;
        x0 += dx;
        y0 += dy;
        dx = -dx;
        dy = -dy;
    }

    const k = dy / dx;
    for (x = 1; x <= dx; x++) {
        apply(x + x0, Math.round(x * k) + y0);
    }
}

// -------------------------------------------

const brush = fcircles[Math.round(2 + (Math.random() * 8))];

let dx = (x - x0), dy = (y - y0);

let apply;

if (brush instanceof Uint8ArrayX2) {
    const bw2 = Math.floor(brush.columns / 2);
    const bh2 = Math.floor(brush.rows / 2);

    apply = (x, y) => {
        for (let i = 0; i < brush.columns; i++) {
            for (let j = 0; j < brush.rows; j++) {
                if (brush.x2get(i, j) === 1 && 1 < 2) {
                    ctx.fillRect(x - bw2 + i, y - bh2 + j, 1, 1);
                }
            }
        }
    };
} else {
    apply = (x, y) => {
        if (1 < 2) {
            ctx.fillRect(x, y, 1, 1);
        }
    };
}

if (Math.abs(dx) < Math.abs(dy)) {
    if (dy < 0) {
        x = -dx;
        y = -dy;
        x0 += dx;
        y0 += dy;
        dx = -dx;
        dy = -dy;
    }

    const k = dx / dy;
    for (y = 1; y <= dy; y++) {
        apply(Math.round(y * k) + x0, y + y0);
    }
} else {
    if (dx < 0) {
        x = -dx;
        y = -dy;
        x0 += dx;
        y0 += dy;
        dx = -dx;
        dy = -dy;
    }

    const k = dy / dx;
    for (x = 1; x <= dx; x++) {
        apply(x + x0, Math.round(x * k) + y0);
    }
}