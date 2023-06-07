const projPortal = document.getElementById("proj-to-open");
const projPreview = document.getElementById("open-proj-preview");
const openProjTrigger = document.getElementById("open-proj-btn");

projPortal.onchange = (e) => {
	globalFileBuffer = e.target.files[0];
	projPreview.innerHTML = globalFileBuffer.name;
	projPortal.classList.add("selected");
};

openProjTrigger.onclick = () => {
	readTQRT(globalFileBuffer);

	openProjTrigger.parentElement.parentElement.classList.remove("active");
	openProjTrigger.parentElement.parentElement.parentElement.classList.remove("visible");

	projPortal.classList.remove("selected");
	projPreview.innerHTML = "";
	globalFileBuffer = 0;
};

const saveProjTrigger = document.getElementById("save-proj-btn");
const projName = document.getElementById("proj-name-to-save");

//  PROJECT SAVER vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

saveProjTrigger.onclick = () => {
	saveTQRT(globalDataBuffer);
};



let globalFileBuffer = 0,
	globalDataBuffer = 0;

const readTQRT = file => { // needs to be asynchronized
    if (!!file) {
		console.log("\"" + file.name + "\" is loading...");

		const reader = new FileReader();
		reader.readAsText(file);

		reader.onload = () => {
			console.log(reader.result);
			console.log("\"" + file.name + "\" was loaded...");
		};
	}
};

const saveTQRT = (data) => {
	let file = new Blob([data], {type: ""});

	let a = document.createElement("a"), url = URL.createObjectURL(file);
	a.href = url;
	a.download = projName.value + ".tqrt";

	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
};