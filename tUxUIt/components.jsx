"use strict";

import React from "./react";

export const OneTitle = {
    init (container) {
        if (document.getElementById("onetitle") === null) {
            
        } else throw new Error("An element with id \"onetitle\" already exist! Make sure whether you've not initialized OneTitle already or created other element with the same id")
    },

	elem: document.getElementById("onetitle"),
	content: document.querySelector("#onetitle > span"),
	shown: 0,
	pivot: 0,
	__timer: 0,
	show: (x, y, message, prefs = {}) => {
		OneTitle.pivot = prefs.pivot || OneTitle.pivot;
		const anim = prefs.anim || "blink";
		const timeOut = prefs.timeOut || 0;

		OneTitle.elem.setAttribute("data-anim", anim);
		if (message) OneTitle.content.textContent = message;
		OneTitle.elem.classList.add("visible");

		if (typeof x === "number" && typeof y === "number") {
			OneTitle.elem.style.left = x - (Math.floor(OneTitle.pivot / 3) * OneTitle.elem.clientWidth / 2) + "px";
			OneTitle.elem.style.top = y - ((OneTitle.pivot % 3) * OneTitle.elem.clientHeight / 2) + "px";
		}

		if (OneTitle.__timer) {
			clearTimeout(OneTitle.__timer);
		}

		if (parseInt(timeOut, 10) > 50) {
			OneTitle.__timer = setTimeout(() => {
				OneTitle.hide();
			}, timeOut);
			return;
		}

		OneTitle.shown = 1;
	},
	move: (x, y) => {
		OneTitle.elem.style.left = x - (Math.floor(OneTitle.pivot / 3) * OneTitle.elem.clientWidth / 2) + "px";
		OneTitle.elem.style.top = y - ((OneTitle.pivot % 3) * OneTitle.elem.clientHeight / 2) + "px";
	},
	log: message => {
		OneTitle.content.textContent = message;
	},
	hide: () => {
		OneTitle.elem.classList.remove("visible");
		OneTitle.shown = 0;
	},
};

// POPUPS vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

const popupElements = document.querySelectorAll("#popups .popup");
let popupBindings = {};

const popupCallers = document.querySelectorAll(".call-popup");

for (let i = 0; i < popupElements.length; i++) {
	Object.defineProperty(popupElements[i], "onpopen", {
		set: (fnc) => {
			if (isFunction(fnc)) {
				popupElements[i].popen = () => {
					fnc(popupElements[i]);
					popupElements[i].classList.add("active");
					popupElements[0].parentElement.classList.add("visible");
				};
			}
		}
	});

	popupElements[i].popen = () => {
		popupElements[i].classList.add("active");
		popupElements[0].parentElement.classList.add("visible");
	};

	popupBindings[popupElements[i].getAttribute("data-popup").replaceAll("-", "")] = popupElements[i];
	popupElements[i].querySelector("i#this-close").addEventListener("click", () => {
		popupElements[i].classList.remove("active");
		popupElements[0].parentElement.classList.remove("visible");
	});
}

for (let i = 0; i < popupCallers.length; i++) {
	const caller = popupCallers[i];
	caller.addEventListener("click", () => {
		popupBindings[caller.getAttribute("data-popup").replaceAll("-", "")].popen();
		popupElements[0].parentElement.classList.add("visible");
	});
}

popupBindings["save"].onpopen = () => {
	if (Controls.savingProjectName.value !== Project.current.name) Controls.savingProjectName.value = Project.current.name; // ТРЕБА ПЕРЕВІРИТИ ЧИ З IF'ОМ ШВИДШЕ АНІЖ ЮЕЗ НЬОГО
};

const Globalist = {
	lists: {
		add (elem, prop) {
			Globalist.lists[prop || elem.getAttribute("data-globalist") || undefined] = elem;
		},

		scan (classname = "global-list") {
			const lists = document.getElementsByClassName(classname);

			for (let i = 0; i < lists.length; i++) {
				Globalist.lists[lists[i].getAttribute("data-globalist")] = lists[i];
			}
		}
	},

	callers: {
		// add (elem, prop) {
		// 	Globalist.lists[prop || elem.getAttribute("data-globalist") || undefined] = elem;
		// },

		// scan (classname = "global-list") {
		// 	// ...
		// }
	}
};