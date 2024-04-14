import React from "react";

export const $ = new Map();

export const $SelectMenus = new Map();

console.cclog = () => {return $}; // TEMP TEMP TEMP TEMP TEMP TEMP TEMP TEMP

// UTILS - UTILS - UTILS - UTILS - UTILS - UTILS - UTILS - UTILS - UTILS - UTILS - UTILS - UTILS - UTILS - UTILS - UTILS - UTILS

const TextMeasurer = {

	ctx: document.createElement("canvas").getContext("2d"),

	getWidth (string, font) {
		TextMeasurer.ctx.font = font;

		return TextMeasurer.ctx.measureText(string).width;
	}
};

// COUNTER - COUNTER - COUNTER - COUNTER - COUNTER - COUNTER - COUNTER - COUNTER - COUNTER - COUNTER - COUNTER - COUNTER - COUNTER

const CounterContext = React.createContext();

// const Counter = props => {
	
// 	let min = parseInt(props.min, 10),
// 		max = parseInt(props.max, 10),
// 		step = parseInt(props.step, 10) || 1;

// 	if (min === NaN || max === NaN) throw new Error("..."); // <<<

// 	const [value, setValue] = React.useState(props.value || min);

// 	const onWheelAction = props.onWheel || (

// 		e => {
// 			if (Math.sign(e.deltaY) + 1) {
				
// 				return (min <= value - step) ? value - step : value;
// 			} else
// 				return (value + step <= max) ? value + step : value;
// 		}
// 	)

// 	if (props.children) {

// 		return (<CounterContext.Provider value={{value, setValue, min, max, step}}>
// 			<div
// 				{...props} 
// 				onWheel={props.onWheel || (e => {
// 					setValue(onWheelAction(e));
// 				})}
// 			>
// 				{props.children}
// 			</div>
// 		</CounterContext.Provider>);
// 	} else {
// 		return (<>
// 			<div
// 				{...props}
// 				onWheel={props.onWheel || (e => {
// 					setValue(onWheelAction(e));
// 				})}
// 				className="font-base font-400 w-fit"
// 			>
// 				<div
// 					className="w-fit inline select-none cursor-pointer px-02"
// 					onMouseDown={() => setValue(Math.max(value - 1, min))}
// 				>
// 					{"<"}
// 				</div>
// 				{value}
// 				<div
// 					className="w-fit inline select-none cursor-pointer px-02"
// 					onMouseDown={() => setValue(Math.min(value + 1, max))}
// 				>
// 					{">"}
// 				</div>
// 			</div>
// 		</>);
// 	}
// }

// class CounterValue extends React.Component {

// 	static contextType = CounterContext;

// 	render () {
// 		return this.context.value;
// 	}
// }

// class CounterTrigger extends React.Component {

// 	static contextType = CounterContext;

// 	render () {
// 		return (
// 			<div
// 				{...this.props}
// 				onMouseDown={() => this.props.onMouseDown(this.context)}
// 			>
// 				{this.props.children}
// 			</div>
// 		);
// 	}
// }

// MENUS - MENUS - MENUS - MENUS - MENUS - MENUS - MENUS - MENUS - MENUS - MENUS - MENUS - MENUS - MENUS - MENUS - MENUS - MENUS

export class Menu extends React.Component {

	constructor (props) {
		super()
	}

	render () {
		return this.props.menu;
	}
}

export class DropdownMenu extends React.Component {

	constructor (props) {
		super(props);

		this.state = {
			value: props.menu[props.default]
		};
	}

	render () {
		return (<div>{this.state.value}<i onClick={() => this.setState({value})}>v</i></div>);
	}
}

// SWITCHERS - SWITCHERS - SWITCHERS - SWITCHERS - SWITCHERS - SWITCHERS - SWITCHERS - SWITCHERS - SWITCHERS - SWITCHERS - SWITCHERS

export class Checkbox extends React.Component {

	static defaultProps = {
		value: true
	}

	static iconStyleProps = {
		className: "btn -square -ultracomp keybd",
		children: "✓"
	}

	constructor (props) {
		super(props);

		$[this.props.id] = {
			type: "checkbox",
			value: this.props.default ? this.props.value : false,
			element: this
		};
	}

	handleChange () {
		$[this.props.id].value = $[this.props.id].value ? false : this.props.value;
	}

	render () {
		return (
			<>
				<input
					type="checkbox"
					name={this.props.name}
					id={this.props.id}
					onChange={() => this.handleChange()}
				/>
				{(this.props.icon === "no") ? "" : 
					<label
						className={Checkbox.iconStyleProps.className}
						htmlFor={this.props.id}
						title={this.props.title}
					>{Checkbox.iconStyleProps.children}</label>
				}
				<label
					htmlFor={this.props.id}
					title={this.props.title}
				>
					{this.props.children}
				</label>
			</>
		);
	}
}

export class Radio extends React.Component {

	static iconStyleProps = {
		className: "btn -square -ultracomp keybd",
		children: "•"
	}

	constructor (props) {
		super(props);

		if ($[this.props.name]) {

			if (this.props.default)
				$[this.props.name].value = this.props.value || this.props.id;

			$[this.props.name].options[this.props.id] = this;

		} else
			$[this.props.name] = {
				type: "radio",
				value: null,
				options: {
					[this.props.id]: this,
				}
			};
	}

	handleChange () {
		$[this.props.name].value = this.props.value || this.props.id;
	}

	render () {
		return (
			<>
				<input
					type="radio"
					name={this.props.name}
					id={this.props.id}
					onChange={() => this.handleChange()}
				/>
				{(this.props.icon === "no") ? "" : 
					<label
						className={Radio.iconStyleProps.className}
						htmlFor={this.props.id}
						title={this.props.title}
					>{Radio.iconStyleProps.children}</label>
				}
				<label
					className={this.props.className}
					htmlFor={this.props.id}
					title={this.props.title}
				>
					{this.props.children}
				</label>
			</>
		);
	}
}

// INPUTS - INPUTS - INPUTS - INPUTS - INPUTS - INPUTS - INPUTS - INPUTS - INPUTS - INPUTS - INPUTS - INPUTS - INPUTS - INPUTS

export class TextInput extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			value: ""
		}
	}

	render () {
		return (
			<>
				<div className="pushed">
					<input
						type="text"
						className={this.props.className}
						placeholder={this.props.placeholder}
						name={this.props.name}
						id={this.props.id}
						pattern={this.props.pattern}
					/>
				</div>
			</>
		);
	}
}

export const ExpandingInput = props => {

	const initWidth = props.style?.width ?? props.style.minWidth;

	const [width, setWidth] = React.useState(initWidth);
	let font = "";

	const ref = React.createRef();

	const scanComputedStyle = () => {

		font = getComputedStyle(ref.current).font;
	}

	React.useEffect(scanComputedStyle);

	const handleChange = e => {
		setWidth(e.target.value ? Math.ceil(TextMeasurer.getWidth(e.target.value, font)) + "px" : initWidth);
	}

	return (
		<input
			ref={ref}
			style={{...props.style, width}}
			onChange={handleChange}
			className={props.className}
			placeholder={props.placeholder}
			minLength={props.minLength}
			maxLength={props.maxLength}
			pattern={props.pattern}
		/>
	);
}