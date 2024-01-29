
// А ЦЕЙ ОБ'ЄКТ ВЗАГАЛІ ПОТРІБЕН???

const FilePortal = {
	saver: document.createElement("a"),

	save (file) {
		if (!(file instanceof Blob)) throw new Error("Received argument is neither a File's nor a Blob's instance!");

		const url = URL.createObjectURL(file);
		this.saver.href = url;
		this.saver.download = file.name; // <<< UNSUITABLE FOR BLOB !!
		this.saver.click();
		URL.revokeObjectURL(url);
	}
};

export default FilePortal;