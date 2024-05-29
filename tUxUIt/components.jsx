import {
	useState, useRef,
	createContext, useContext,
	useLayoutEffect
} from "react";

import {useLoad} from "./utils/react";

// INNER UTILS

const TextMeasurer = {

	ctx: document.createElement("canvas").getContext("2d"),

	getWidth (string, font) {
		TextMeasurer.ctx.font = font;

		return TextMeasurer.ctx.measureText(string).width;
	}
};

// MENUS & LISTS

const MenuAreaContext = createContext();

export const MenuArea = props => {

	const [isVisible, setVisibility] = useState(false);

	return (
		<MenuAreaContext.Provider value={{isVisible, setVisibility}}>
			<div className="relative flex flex-col">
				{props.children}
			</div>
		</MenuAreaContext.Provider>
	);
}

export const MenuCaller = props => {

	const {isVisible, setVisibility} = useContext(MenuAreaContext);

	return <div {...props} onClick={() => setVisibility(!isVisible)}>{props.children}</div>;
};

const MenuContext = createContext();

export const Menu = props => {

	const {isVisible} = useContext(MenuAreaContext);

	if (isVisible)
		return (
			<MenuContext.Provider value={props.onItemSelect}>
				{props.children}
			</MenuContext.Provider>
		);
};

export const MenuItem = props => {

	const onItemSelect = useContext(MenuContext);
	const {setVisibility} = useContext(MenuAreaContext);

	return (
		<div
			className={props.className}
			onClick={() => {
				onItemSelect(props.value);
				setVisibility(false);
			}}
		>
			{props.children}
		</div>
	);
};

// SWITCHERS

// export class Checkbox extends React.Component {

// 	static defaultProps = {
// 		value: true
// 	}

// 	static iconStyleProps = {
// 		className: "btn -square -ultracomp keybd",
// 		children: "✓"
// 	}

// 	constructor (props) {
// 		super(props);

// 		$[this.props.id] = {
// 			type: "checkbox",
// 			value: this.props.default ? this.props.value : false,
// 			element: this
// 		};
// 	}

// 	handleChange () {
// 		$[this.props.id].value = $[this.props.id].value ? false : this.props.value;
// 	}

// 	render () {
// 		return (
// 			<>
// 				<input
// 					type="checkbox"
// 					name={this.props.name}
// 					id={this.props.id}
// 					onChange={() => this.handleChange()}
// 				/>
// 				{(this.props.icon === "no") ? "" : 
// 					<label
// 						className={Checkbox.iconStyleProps.className}
// 						htmlFor={this.props.id}
// 						title={this.props.title}
// 					>{Checkbox.iconStyleProps.children}</label>
// 				}
// 				<label
// 					htmlFor={this.props.id}
// 					title={this.props.title}
// 				>
// 					{this.props.children}
// 				</label>
// 			</>
// 		);
// 	}
// }

// export class Radio extends React.Component {

// 	static iconStyleProps = {
// 		className: "btn -square -ultracomp keybd",
// 		children: "•"
// 	}

// 	constructor (props) {
// 		super(props);

// 		if ($[this.props.name]) {

// 			if (this.props.default)
// 				$[this.props.name].value = this.props.value || this.props.id;

// 			$[this.props.name].options[this.props.id] = this;

// 		} else
// 			$[this.props.name] = {
// 				type: "radio",
// 				value: null,
// 				options: {
// 					[this.props.id]: this,
// 				}
// 			};
// 	}

// 	handleChange () {
// 		$[this.props.name].value = this.props.value || this.props.id;
// 	}

// 	render () {
// 		return (
// 			<>
// 				<input
// 					type="radio"
// 					name={this.props.name}
// 					id={this.props.id}
// 					onChange={() => this.handleChange()}
// 				/>
// 				{(this.props.icon === "no") ? "" : 
// 					<label
// 						className={Radio.iconStyleProps.className}
// 						htmlFor={this.props.id}
// 						title={this.props.title}
// 					>{Radio.iconStyleProps.children}</label>
// 				}
// 				<label
// 					className={this.props.className}
// 					htmlFor={this.props.id}
// 					title={this.props.title}
// 				>
// 					{this.props.children}
// 				</label>
// 			</>
// 		);
// 	}
// }

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