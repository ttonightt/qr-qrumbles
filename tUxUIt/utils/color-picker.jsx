import React from "react";
import "./color-picker.css";

export const ColorPicker = props => {

	const scale = props.scale;

	const [curve, setCurve] = React.useState({
		x0: 0, y0: 0,
		x1: 80, y1: 14,
		x2: 73, y2: 44,
		x: 60, y: 100
	});

	const [pointers, setPointers] = React.useState([0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9])
	// const [colors, setColors] = React.useState(pointers.map(p => ));

	const [mode, setMode] = React.useState(0);
	const [focused, setFocus] = React.useState(1);

	const getX = t => {

		const t1 = 1 - t;
		return ((t1**3) * curve.x0) + (3 * (t1*t1) * t * curve.x1) + (3 * t1 * (t*t) * curve.x2) + ((t**3) * curve.x);
	}

	const getY = t => {

		const t1 = 1 - t;
		return ((t1**3) * curve.y0) + (3 * (t1*t1) * t * curve.y1) + (3 * t1 * (t*t) * curve.y2) + ((t**3) * curve.y);
	}

	const getExtremumsX = () => {
		const a = curve.x0 - (3 * curve.x1) + (3 * curve.x2) - curve.x;
		const b = -2 * (curve.x1 - curve.x2 - curve.x2 + curve.x);

		const D = Math.sqrt((b*b) - (4 * a * (curve.x0 - curve.x1)));

		if (D) {
			const r1 = (-b + D) / (2 * a);
			const r2 = (-b - D) / (2 * a);

			if ((r1 % 0.96) <= 0.05) {

			}

			if ((b / 2) - (a * r1) > 0) {

				return {
					max: r1,
					min: r2
				};
			} else
				return {
					max: r2,
					min: r1
				};
		} else {
		}
	};

	const compiledGradient = new ImageData(100 * scale, 1);
	// const cachedImageData = ctx.getImageData();

	// const compile = () => {

	// 	const step = 1 / compiledGradient.width;

	// 	for (let i = 0; i < compiledGradient.width * 4; i += 4) {
	// 		compiledGradient.data[i + 1]
	// 	}
	// };

	const getExtremumsY = () => {

	};

	return (
		<div className="wrap" style={{
			backgroundColor: props.darkColor || "#111",
			color: props.lightColor || "#eee",
			gridTemplateColumns: `${100 * scale}px ${14 * scale}px ${30 * scale}px`,
			gridTemplateRows: `${100 * scale}px ${scale}rem ${32 * scale}px`,
		}}>
			<svg
				version="1.1" xmlns="http://www.w3.org/2000/svg" className="lightness-saturation-plain"
				width={100 * scale}
				height={100 * scale}
				viewBox="0 0 100 100"
			>
				<defs>
					<mask id="circles">
						<rect x="0" y="0" width="100" height="100" fill="#fff"/>

						{pointers.map((t, i) => (

							<circle key={i} cx={getX(t)} cy={getY(t)} r="4" fill="#000"/>
						))}
					</mask>

					<linearGradient id="hue" gradientTransform="rotate(0)">
						<stop offset="0%" stopColor="#fff"/>
						<stop offset="100%" stopColor="#f00"/>
					</linearGradient>

					<linearGradient id="darkness" gradientTransform="rotate(90)">
						<stop offset="0%" stopColor="#0000"/>
						<stop offset="100%" stopColor="#000"/>
					</linearGradient>

					<linearGradient id="lightness" gradientTransform="rotate(90)">
						<stop offset="0%" stopColor="#fff0"/>
						<stop offset="100%" stopColor="#fff"/>
					</linearGradient>

					<filter id="invert">
						<feFlood x="0" y="0" width="100" height="100" floodColor="white" floodOpacity="1" result="FLOOD"/>
						<feBlend in="SourceGraphic" mode="difference"/>
					</filter>

					<pattern id="ls" viewBox="0,0,100,100" width="100" height="100" patternUnits="userSpaceOnUse">
						<rect x="0" y="0" width="100" height="100" fill="url(#hue)"/>
						<rect x="0" y="0" width="100" height="100" fill="url(#darkness)"/>
					</pattern>

					<pattern id="inverted" viewBox="0,0,100,100" width="100" height="100" patternUnits="userSpaceOnUse">
						<rect x="0" y="0" width="100" height="100" fill="url(#hue)" filter="url(#invert)"/>
						<rect x="0" y="0" width="100" height="100" fill="url(#lightness)"/>
					</pattern>
				</defs>

				<rect x="0" y="0" width="100" height="100" fill="url(#ls)"/>

				<path stroke="url(#inverted)" d={`M ${curve.x0} ${curve.y0} C ${curve.x1} ${curve.y1}, ${curve.x2} ${curve.y2}, ${curve.x} ${curve.y}`} mask="url(#circles)"/>

				{/* {pointers.map((t, i) => (

					<circle stroke="url(#inverted)" key={i} cx={getX(t)} cy={getY(t)} r="4"/>
				))} */}

				<line x1={curve.x0} y1={curve.y0} x2={curve.x1} y2={curve.y1} stroke="url(#inverted)"/>
				<line x1={curve.x} y1={curve.y} x2={curve.x2} y2={curve.y2} stroke="url(#inverted)"/>

				<polygon points={`${curve.x0 - 2},${curve.y0} ${curve.x0},${curve.y0 - 2} ${curve.x0 + 2},${curve.y0} ${curve.x0},${curve.y0 + 2}`}/>
				<polygon points={`${curve.x1 - 2},${curve.y1} ${curve.x1},${curve.y1 - 2} ${curve.x1 + 2},${curve.y1} ${curve.x1},${curve.y1 + 2}`}/>
				<polygon points={`${curve.x2 - 2},${curve.y2} ${curve.x2},${curve.y2 - 2} ${curve.x2 + 2},${curve.y2} ${curve.x2},${curve.y2 + 2}`}/>
				<polygon points={`${curve.x - 2},${curve.y} ${curve.x},${curve.y - 2} ${curve.x + 2},${curve.y} ${curve.x},${curve.y + 2}`}/>
			</svg>
			<div className="hue-scale">
				<i></i>
			</div>
			<div className="compiled-scale">
				{/* <canvas width={100 * scale + "px"} height="1px" style={{height: 34 * scale + "px"}}></canvas> */}
				<i></i>
				<i></i>
				<i></i>
				<i></i>
			</div>
			<div className="palette">
				<div style={{backgroundColor: "#fee"}}></div>
				<div style={{backgroundColor: "#fcc"}}></div>
				<div style={{backgroundColor: "#faa"}}></div>
				<div style={{backgroundColor: "#f88"}}></div>
				<div style={{backgroundColor: "#f66"}}></div>
				<div style={{backgroundColor: "#f44"}}></div>
				<div style={{backgroundColor: "#f22"}}></div>
				<div style={{backgroundColor: "#d00"}}></div>
				<div style={{backgroundColor: "#b00"}}></div>
				<div style={{backgroundColor: "#900"}}></div>
				<div style={{backgroundColor: "#700"}}></div>
				<div style={{backgroundColor: "#500"}}></div>
				<div style={{backgroundColor: "#300"}}></div>
				<div style={{backgroundColor: "#100"}}></div>
			</div>
		</div>
	);
}