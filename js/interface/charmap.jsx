"use strict";

import React from "react";

const Charmap = {

	init (textarea, layout) {
		this.textarea = textarea;
		this.layout = layout.getContext("2d");

		this.ps = [];
		this.is = [];

		this.layout.canvas.width = this.textarea.offsetWidth;
		this.layout.canvas.height = this.textarea.offsetHeight + 4; // !!!!!!
	},

	updateLayout () {
		const ctx = this.layout;

		ctx.fillStyle = "";

		for (let i = 0; i < this.ps.length + this.is.length; i++) {

			const firstRowChars = this.textarea.columns - (this.ps[i].textOffset % this.textarea.columns);
			const fullRowsNumber = Math.floor((this.ps[i].textContent.length - firstRowChars) / this.textarea.columns);
			const lastRowChars = this.ps[i].textEndOffset % this.textarea.columns;

			const x1 = this.ps[i].textOffsetX, y1 = this.ps[i].textOffsetY;

			if (firstRowChars !== this.textarea.columns) {
				
				ctx.fillRect(this.ps[i].textOffset * this.textarea.letterWidth, );
				ctx.clearRect();
			}

			if (fullRowsNumber) {
				
				ctx.fillRect();
				ctx.clearRect();
			}

			if (lastRowChars) {
				
				ctx.fillRect();
				ctx.clearRect();
			}
		}
	},

	loadWithData (dbs) {
		if (this.ps.length < dbs.length) {

			let _offset, _ctrl;

			for (let i = this.ps.length; i < dbs.length; i++) { // CREATING OF LACKING <p>'s

				this.ps[i] = document.createElement("p");
				this.textarea.appendChild(this.ps[i]);

				if (i < dbs.length - 1) {
					this.is[i] = document.createElement("i");
					this.textarea.appendChild(this.is[i]);
				}

				// THE ALTERNATIVE to checking the selection by means of document.getSelection() is to check sameness between textOffset
				// of cursor while mousedown as well as mouseup instead. The sameness means some text was selected*
				// ____________
				// * multiply selections detection needs to store selection statement somewhere and a few other stuffs...

				this.ps[i].onclick = e => {

					this.selections = document.getSelection();

					if (this.selections.rangeCount === 1 && this.selections.getRangeAt(0).startOffset === this.selections.getRangeAt(0).endOffset) {

						this.__focused = this.ps[i];

						if (i > 0)
							this.is[i - 1].classList.add("left");
						if (i < this.is.length)
							this.is[i].classList.add("right");
					} else {
						console.log("selected");

						this.controllers.toAdd.toggleDisabled(false);
					}
				};
			}

		} else if (this.ps.length > dbs.length)
			this.ps.splice(dbs.length, this.ps.length - dbs.length);

		for (let i = 0; i < this.ps.length; i++) {
			if (dbs !== "") {
				this.ps[i].textContent = dbs[i].chars;

				this.ps[i].encoding = dbs[i].encoding;
				this.ps[i].setAttribute("encoding", dbs[i].encoding);
			}
		}
	}
}

export default Charmap;