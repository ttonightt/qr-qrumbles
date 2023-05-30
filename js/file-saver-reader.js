
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