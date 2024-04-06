import React from "react";

export const $ = new Map();

export const $SelectMenus = new Map();

console.cclog = () => {return $}; // TEMP TEMP TEMP TEMP TEMP TEMP TEMP TEMP

const TextMeasurer = {

	ctx: document.createElement("canvas").getContext("2d"),

	getWidth (string, font) {
		TextMeasurer.ctx.font = font;

		return TextMeasurer.ctx.measureText(string).width;
	}
};

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

export class Form extends React.Component { // UNDONE
	constructor (props) {
		super(props);
		this.state = {
			values: {},
		}

		// for (let i = 0; i < this.props.children.length; i++) {

		// 	switch (this.props.children[i].type.name || this.props.children[i].type) {
		// 		case "Radio":
					
		// 			if (this.props.children[i].state.checked) {

		// 			}
		// 			this.state.values[this.props.children[i].props.name] = this.props.children[i].props.checked && (this.props.children[i].props.value || this.props.children[i].props.id);
		// 			break;
		// 		case "Checkbox":
		// 			this.state.values[this.props.children[i].props.id] = this.props.children[i].props.checked && (this.props.children[i].props.value || true);
		// 	}
		// }

		// console.log(this.state.values);
	}

	// handleChange (key) {
	// 	this.state.values[key] = this.state.value;
	// }

	render () {
		return (
			<div className={this.props.className} id={this.props.id}>
				{this.props.children}
			</div>
		);
	}
}

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

export const CollectionContext = React.createContext();

export const CollectionTemplates = {

	popups: {

	},

	accordion: {

	}
};

export class Collection extends React.Component {

	constructor (props) {
		super(props);

		this.item = this.props.itemPrototype;

		this.trigger = this.props.onTrigger;
	}

	trigger () {
		return this.props.onTrigger(this.items, ...args);
	}

	render () {
		return <CollectionContext.Provider value={this.items}>{this.props.children}</CollectionContext.Provider>;
	}
}

export class CollectionItem extends React.Component {

	static contextType = CollectionContext;

	constructor (props) {
		super(props);

		this.context[this.props.id] = new this.context.itemPrototype(this);
	}

	render () {

		return this.context.render(this.props.children);
	}
}

export class CollectionTrigger extends React.Component {

	static contextType = CollectionContext;

	constructor (props) {
		super(props);

	}

	render () {
		return this.props.children;
	}
}