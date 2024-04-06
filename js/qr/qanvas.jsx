import React from "react";

export class Qanvas extends React.Component {

	static defaultProps = {
		className: "qanvas",
	}

	constructor (props) {
		super(props);

		this.state = {
			modules: props.modules,
            scale: props.scale
		}

		this.imageData = new ImageData(props.modules, props.modules);

		this.ref = React.createRef();
	}

	scale (value) {
		this.setState({scale: value});
	}

	resize (modules) {

		this.imageData = new ImageData(modules, modules);
		this.setState({modules: modules});
	}

	updateCanvasContext ({x, y, width, height}) {

		this.ctx.putImageData(this.imageData, 0, 0, x, y, width, height);
	}

	componentDidMount () {
		this.ctx = this.ref.current.getContext("2d");
	}

	render () {
		return (
			<canvas
				ref={this.ref}
				width={this.state.modules + "px"}
				height={this.state.modules + "px"}
				style={{
					...this.props.style,
					width: this.state.modules * this.state.scale + "px",
					height: this.state.modules * this.state.scale + "px"
				}}
				className={this.props.className}
				id={this.props.id}
			></canvas>
		);
	}
}