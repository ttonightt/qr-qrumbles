
export const promise = prom => { // <<< the name of the funciton should be changed to the "promise"
	let sts = "pending",
		res_;

	const prom_ = prom.then(
		res => {
			sts = "success";
			res_ = res;
		},
		err => {
			sts = "error";
			res_ = err;
		}
	);

	const read = () => {

		switch (sts) {
			case "pending":
				throw prom_;
			case "error":
				throw res_;
			default:
				return res_;
		}
	};

	return {read};
};

// export const useFonts = usePromise(document.fonts.ready).read;
export const useLoad = promise(new Promise(res => window.onload = () => res())).read;
