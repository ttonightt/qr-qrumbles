import {
	useState, useRef,
	createContext, useContext,
	useLayoutEffect
} from "react";

import {useLoad} from "./utils/functions-hooks";
import { createPortal } from "react-dom";

// INNER UTILS

const TextMeasurer = {

	ctx: document.createElement("canvas").getContext("2d"),

	getWidth (string, font) {
		TextMeasurer.ctx.font = font;

		return TextMeasurer.ctx.measureText(string).width;
	}
};

// MENUS & LISTS

// SWITCHERS

// INPUTS

export const ExpandingInput = props => {

	const fonts = useLoad();

	const ref = props.ofRef ?? useRef(null);
	const emptyInputWidth = useRef("auto");

	const [width, setWidth] = useState();

	useLayoutEffect(() => {

		const width_ = props.placeholder ? Math.ceil(
			TextMeasurer.getWidth(
				props.placeholder,
				getComputedStyle(ref.current).font
			)
		) : 0;
		
		emptyInputWidth.current = width_ > 0 ? width_ + "px" : null;

	}, [props.placeholder, props.className]);

	useLayoutEffect(() => {

		const width_ = Math.ceil(
			TextMeasurer.getWidth(
				props.value,
				getComputedStyle(ref.current).font
			)
		);

		setWidth(width_ > 0 ? width_ + "px" : emptyInputWidth.current);
	}, []);

	const handleChange = e => {

		setWidth(
			e.target.value === ""
			?
			emptyInputWidth.current
			:
			Math.ceil(TextMeasurer.getWidth(e.target.value, getComputedStyle(ref.current).font)) + "px"
		);
		props.onChange(e);
	}

	return (<>
		{fonts}
		<input
			ref={ref}
			style={{
				...props.style,
				width
			}}
			value={props.value}
			onChange={handleChange}
			onBlur={props.onBlur}
			className={props.className}
			placeholder={props.placeholder}
			minLength={props.minLength}
			maxLength={props.maxLength}
			pattern={props.pattern}
		/>
	</>);
};