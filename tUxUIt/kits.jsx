import {useState} from "react";

export const useCounterKit = ({min, max, step, value}) => {

	const [actual, setActual] = useState(value);

	return [
		actual,
		() => {
			if (actual + step <= max)
				setActual(actual + step)
		},
		() => {
			if (actual - step >= min)
				setActual(actual - step)
		}
	];
};