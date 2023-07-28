class HistoryCheckPoint {
	constructor (part, data, trigger) {
		switch (part) {
			case "charmap":

				this.belongsTo = part;
				if (data) {

				}

				break;
			case "qrtmatrix":

				this.belongsTo = part;

				break;
			case "preferences":

				this.belongsTo = part;

				break;
			default:
				throw new Error("HistoryCheckPoint must belong to such parts: charmap, qrtmatrix, preferences. You've used: " + part);
		}
	}
}