import {
	useState, useReducer, useRef,
	useCallback, memo,
	useEffect, useLayoutEffect,
	Fragment, createElement
} from "react";
import {minmax} from "../../../js/tiny-usefuls";

import "./styles.css";



const useMetronome = () => {

	const _metronome = useRef(0);
	const [metronome, toggle] = useReducer(_state => {

		_metronome.current = _state;

		return _state ^ 1;
	}, 0);

	useEffect(() => {

		_metronome.current = metronome;
	}, []);

	return [metronome, toggle, () => _metronome.current === metronome];
};



// const F = (t, p0, p1, p2, p) => {
// 	const t1 = 1 - t;
// 	return ((t1**3) * p0) + (3 * (t1*t1) * t * p1) + (3 * t1 * (t*t) * p2) + ((t**3) * p);
// };

const getX = (t, curve) => {
	const t1 = 1 - t;
	return ((t1**3) * curve[0]) + (3 * (t1*t1) * t * curve[2]) + (3 * t1 * (t*t) * curve[4]) + ((t**3) * curve[6]);
};

const getY = (t, curve) => {
	const t1 = 1 - t;
	return ((t1**3) * curve[1]) + (3 * (t1*t1) * t * curve[3]) + (3 * t1 * (t*t) * curve[5]) + ((t**3) * curve[7]);
};

const getExtremums = (p0, p1, p2, p) => {
	const a = p0 - (3 * p1) + (3 * p2) - p;
	const b = -2 * (p0 - p1 - p1 + p2);

	const D = Math.sqrt((b*b) - (4 * a * (p0 - p1)));

	if (isNaN(D)) { // negative discriminant

		if (p0 < p) {

			return [0, 1];
		} else {

			return [1, 0];
		}
	} else {

		const t1 = (-b + D) / (2 * a);
		const t2 = (-b - D) / (2 * a);

		if ((b / 2) + (a * t1) > 0) { // defines maximum and minimum from two extremums

			return [t2, t1];
		} else {

			return [t1, t2];
		}
	}
};



export const compileRGB = (hue, curve, tint) => {

	hue /= 60;

	const h1 = Math.floor(hue);
	const f = (h1 % 2) ? hue - h1 : 1 - hue + h1;

	const s = getX(tint, curve) / 100;
	const _v = 1 - (getY(tint, curve) / 100);

	const n = Math.floor(255 * _v * (1 - (s * f)));
	const m = Math.floor(255 * _v * (1 - s));
	const v = Math.floor(255 * _v);

	switch (h1 % 6) {
		case 0:
			return [v, n, m];
		case 1:
			return [n, v, m];
		case 2:
			return [m, v, n];
		case 3:
			return [m, n, v];
		case 4:
			return [n, m, v];
		case 5:
			return [v, m, n];
	}
};

export const compileHSV = (hue, curve, tint) => [
	hue,
	getX(tint, curve),
	100 - getY(tint, curve)
];

export const compileHSL = (hue, curve, tint) => {

	const v = 100 - getY(tint, curve);
	const l = v - (v * getX(tint, curve) / 200);
	const m = Math.min(l, 100 - l);

	return [hue, m ? (v - l) / m : 0, l];
};

export const RGBtoHex = (r, g, b) => ((r << 16) + (g << 8) + b).toString(16).padStart(6, "0");

const pureHueToRGB = hue => {

	hue /= 60;

	const h1 = Math.floor(hue);
	const n = Math.floor(
		255 * (
			(h1 % 2) ? 1 - hue + h1 : hue - h1
		)
	);

	switch (h1 % 6) {
		case 0:
			return "rgb(255," + n + ",0)";
		case 1:
			return "rgb(" + n + ",255,0)";
		case 2:
			return "rgb(0,255," + n + ")";
		case 3:
			return "rgb(0," + n + ",255)";
		case 4:
			return "rgb(" + n + ",0,255)";
		case 5:
			return "rgb(255,0," + n + ")";
	}
};



export const SVCurvePicker = props => {

	const width = parseInt(props.width) || 100;
	const height = parseInt(props.height) || 100;
	const wc = width / 100;
	const hc = height / 100;

	const curve = props.ofCurve;

	const cx0 = Math.floor(curve[0] * wc), cx1 = Math.floor(curve[2] * wc), cx2 = Math.floor(curve[4] * wc), cx = Math.floor(curve[6] * wc);
	const cy0 = Math.floor(curve[1] * hc), cy1 = Math.floor(curve[3] * hc), cy2 = Math.floor(curve[5] * hc), cy = Math.floor(curve[7] * hc);

	const infc = props.interfaceSize > 0 ? parseInt(props.interfaceSize) : 2;
	const poiR = 2 * infc;

	const ref = useRef();

	const focusedPointer = useRef(-1);

	const handleMouseMove = e => {

		const rect = ref.current.getBoundingClientRect();

		const curve_ = Array.from(curve);
		// x
		curve_[focusedPointer.current * 2] = (Math.min(Math.max(e.clientX, rect.left), rect.right) - rect.left) / wc;
		// y
		curve_[(focusedPointer.current * 2) + 1] = (Math.min(Math.max(e.clientY, rect.top), rect.bottom) - rect.top) / hc;

		props.setCurveBy(curve_);
	};

	const handleMouseDown = i => {

		focusedPointer.current = i;
		document.documentElement.style.cursor = "grabbing";
		document.body.style.setProperty("pointer-events", "none", "important");
		window.addEventListener("mousemove", handleMouseMove);
		window.addEventListener("mouseout", handleMouseMove);
	};

	window.addEventListener("mouseup", () => {
		document.documentElement.style.cursor = "";
		document.body.style.setProperty("pointer-events", "");
		window.removeEventListener("mousemove", handleMouseMove);
		window.removeEventListener("mouseout", handleMouseMove);
	});

	return (
		<svg
			ref={ref}
			version="1.1"
			xmlns="http://www.w3.org/2000/svg"
			className={"tUxUIt-theme-picker-svg " + (props.className ?? "")}
			width={width}
			height={height}
			viewBox={"0 0 " + width + " " + height}
			preserveAspectRatio="none"
			style={props.style}
		>
			<defs>
				<linearGradient id="hue" gradientTransform="rotate(0)">
					<stop offset="0%" stopColor="#fff"/>
					<stop offset="100%" stopColor={pureHueToRGB(props.hue)}/>
				</linearGradient>

				<linearGradient id="ihue" gradientTransform="rotate(0)">
					<stop offset="0%" stopColor="#000"/>
					<stop offset="100%" stopColor={pureHueToRGB(props.hue + 180)}/>
				</linearGradient>

				<linearGradient id="darkness" gradientTransform="rotate(90)">
					<stop offset="0%" stopColor="#0000"/>
					<stop offset="100%" stopColor="#000"/>
				</linearGradient>

				<linearGradient id="lightness" gradientTransform="rotate(90)">
					<stop offset="0%" stopColor="#fff0"/>
					<stop offset="100%" stopColor="#fff"/>
				</linearGradient>

				<pattern id="inverted" width="100%" height="100%" patternUnits="userSpaceOnUse">
					<rect x="0" y="0" width="100%" height="100%" fill="url(#ihue)"/>
					<rect x="0" y="0" width="100%" height="100%" fill="url(#lightness)"/>
				</pattern>

				<pattern id="SV" width="100%" height="100%" patternUnits="userSpaceOnUse">
					<rect x="0" y="0" width="100%" height="100%" fill="url(#hue)"/>
					<rect x="0" y="0" width="100%" height="100%" fill="url(#darkness)"/>

					<line x1={cx0} y1={cy0} x2={cx1} y2={cy1} stroke="url(#inverted)" strokeWidth={infc * 2 / 3}/>
					<line x1={cx} y1={cy} x2={cx2} y2={cy2} stroke="url(#inverted)" strokeWidth={infc * 2 / 3}/>
				</pattern>

				<mask id="mask">
					<rect x="0" y="0" width="100%" height="100%" fill="white" stroke="none"/>

					{props.ofPointers.map((t, i) => (
						<circle key={i} cx={getX(t, curve) * wc} cy={getY(t, curve) * hc} r={3 * infc} fill="black" stroke="none"/>
					))}
				</mask>

				<polygon points={`${-poiR + 1},${-poiR - 1} ${poiR + 1},0 ${-poiR + 1},${poiR + 1}`} id={"r-triangle-" + infc}/>
			</defs>

			<line x1={cx0} y1={cy0} x2={cx1} y2={cy1} stroke="white" strokeWidth={infc * 2 / 3}/>
			<line x1={cx} y1={cy} x2={cx2} y2={cy2} stroke="white" strokeWidth={infc * 2 / 3}/>

			<rect x="0" y="0" width="100%" height="100%" fill="url(#SV)"/>

			<path
				d={`M ${cx0} ${cy0} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${cx} ${cy}`}
				mask="url(#mask)"
				stroke="url(#inverted)"
				strokeWidth={infc}
				fill="none"
			/>

			{props.ofPointers.map((t, i) => (
				<circle
					key={i}
					cx={getX(t, curve) * wc}
					cy={getY(t, curve) * hc}
					r={3 * infc}
					strokeWidth={infc}
					fill="none"
					stroke="url(#inverted)"
					// stroke="white"
					// filter="drop-shadow(0 0 1.5px black)"
				/>
			))}

			<use
				x={cx0}
				y={cy0}
				href={"#r-triangle-" + infc}
				fill="white"
				stroke="black"
				cursor="grab"
				strokeWidth={infc}
				onMouseDown={e => handleMouseDown(0)}
			/>
			<circle
				cx={cx}
				cy={cy}
				r={poiR}
				fill="white"
				stroke="black"
				cursor="grab"
				strokeWidth={infc}
				onMouseDown={e => handleMouseDown(3)}
			/>

			<rect
				x={cx1 - poiR}
				y={cy1 - poiR}
				width={poiR * 2}
				height={poiR * 2}
				fill="white"
				stroke="black"
				cursor="grab"
				strokeWidth={infc}
				onMouseDown={e => handleMouseDown(1)}
			/>
			<rect
				x={cx2 - poiR}
				y={cy2 - poiR}
				width={poiR * 2}
				height={poiR * 2}
				fill="white"
				stroke="black"
				cursor="grab"
				strokeWidth={infc}
				onMouseDown={e => handleMouseDown(2)}
			/>
		</svg>
	);
};

const VerticalPointer = props => {

	return (
		<Fragment>
			<use
				fill="white"
				stroke="black"
				cursor="grab"
				{...props}
				x="0"
				y={props.value * 100 + "%"}
				href={"#right-point-" + props.interfaceSize}
			/>
			<use
				fill="white"
				stroke="black"
				cursor="grab"
				{...props}
				x="100%"
				y={props.value * 100 + "%"}
				href={"#left-point-" + props.interfaceSize}
			/>
		</Fragment>
	);
};

export const VerticalPointersScale = memo(props => {

	const pointers = props.ofPointers;

	const zs = props.zLayers;

	const scale = props.interfaceSize > 0 ? parseInt(props.interfaceSize) : 2;

	const [fc, setFocus] = useState();

	const [metro, toggleMetro, isMetroTheSame] = useMetronome();

	const _value = useRef();
	const _y = useRef();

	const ref = useRef();

	const compileValue = useCallback(e =>{

		const rect = ref.current.getBoundingClientRect();

		return (minmax(e.clientY, rect.top, rect.bottom) - rect.top) / rect.height;
	});

	const handleFieldMouseDown = e => {

		if (ref.current !== e.target)
			return;

		const _rect = ref.current.getBoundingClientRect();

		props.onFieldMouseDown(e, {

			value: (e.clientY - _rect.top) / _rect.height,

			capturePointer: handlePointerMouseDown,
			compileValue
		});
	};

	const handlePointerMouseDown = index => {

		setFocus(index);
		toggleMetro();

		document.documentElement.classList.add("tUxUIt-cursor-grabbing-modifier");
	};

	const handlePointerMouseMove = e => {

		const value_ = compileValue(e);

		if (_value.current === value_)
			return;

		_value.current = value_;

		const values_ = Array.from(pointers);

		values_[fc].value = value_;

		props.setPointersBy(values_);
	};

	const handlePointerMouseUp = () => {

		document.documentElement.classList.remove("tUxUIt-cursor-grabbing-modifier");
		window.removeEventListener("mousemove", handlePointerMouseMove);
		// window.addEventListener("mousedown", unfocus);
	};

	useEffect(() => {

		if (isMetroTheSame()) return;

		window.addEventListener("mousemove", handlePointerMouseMove);
		window.addEventListener("mouseup", handlePointerMouseUp);

		return () => {
			window.removeEventListener("mouseup", handlePointerMouseUp);
			window.removeEventListener("mousemove", handlePointerMouseMove); // <<<
		};
	}, [metro]);

	const preceding = [];
	const subsequent = [];

	let c = 0, i = 0, j;

	for (i; i < zs.length; i++) {

		const z = zs[i];

		for (j = 0; j < pointers.length; j++) {

			if (pointers[j].zIndex === z) {

				const keyId = j;

				subsequent[c++] = (
					<VerticalPointer
						key={keyId}
						{...pointers[j]}
						interfaceSize={scale}
						onMouseDown={() => {
							handlePointerMouseDown(keyId);

							if (props.onPointerFocus)
								props.onPointerFocus(keyId);
						}}
					/>
				);
			}
		}
	}

	if (pointers.length - c > 0) {

		c = 0;

		const zmax = zs[0], zmin = zs[zs.length - 1];

		for (j = 0; j < pointers.length; j++) {

			if (!(zmin <= pointers[j] && pointers[j] <= zmax)) {

				const keyId = j;

				preceding[c++] = (
					<VerticalPointer
						key={keyId}
						{...pointers[j]}
						interfaceSize={scale}
						onMouseDown={() => {
							handlePointerMouseDown(keyId);

							if (props.onPointerFocus)
								props.onPointerFocus(keyId);
						}}
					/>
				);
			}
		}
	}

	return (<>
		<svg
			version="1.1"
			xmlns="http://www.w3.org/2000/svg"
			className={"tUxUIt-theme-picker-svg " + (props.className ?? "")}
			onMouseDown={handleFieldMouseDown}
			strokeWidth={scale}
			ref={ref}
		>
			<defs>
				<polygon points={`${-3 * scale},${-2 * scale} ${-3 * scale},${2 * scale} ${-scale},${2 * scale} ${scale},0 ${-scale},${-2 * scale}`} id={"right-point-" + scale}/>
				<polygon points={`${-scale},0 ${scale},${-2 * scale} ${3 * scale},${-2 * scale} ${3 * scale},${2 * scale} ${scale},${2 * scale}`} id={"left-point-" + scale}/>
			</defs>

			{preceding}
			{subsequent}
		</svg>
	</>);
});

export const PaletteScale = props => {

	const resolution = props.resolution || 200;

	let w, h;

	if (props.direction === "vertical") {

		h = resolution;
		w = 1;
	} else {
		w = resolution;
		h = 1
	}

	const ref = useRef();
	const ctx = useRef(null);

	const hue = props.hue / 60;

	const curve = props.curve;

	useEffect(() => {

		ctx.current = ref.current.getContext("2d");
	}, []);

	useEffect(() => {

		const imd = new ImageData(w, h);

		const len4 = resolution * 4;
		const tstep = 1 / resolution;

		for (let k = 0, t = 0; k < len4; k += 4, t += tstep) {

			const s = getX(t, curve) / 100;
			const v = 1 - (getY(t, curve) / 100);

			const h1 = Math.floor(hue);
			const f = (h1 % 2) ? hue - h1 : 1 - hue + h1; // <<<

			const m = v * (1 - s);
			const n = v * (1 - (s * f));

			imd.data[k + 2 - ((h1 + 1) % 3)] = Math.floor(255 * n);
			imd.data[k + ((Math.floor(h1 / 2) + 2) % 3)] = Math.floor(255 * m);
			imd.data[k + (Math.floor((h1 + 1) / 2) % 3)] = Math.floor(255 * v);
			imd.data[k + 3] = 255;
		}

		ctx.current.putImageData(imd, 0, 0);

	}, [props.curve, props.hue, props.direction]);

	return (
		<canvas
			width={w}
			height={h}
			style={props.style}
			className={"tUxUIt-theme-picker-canvas " + (props.className ?? "")}
			ref={ref}
		></canvas>
	);
};