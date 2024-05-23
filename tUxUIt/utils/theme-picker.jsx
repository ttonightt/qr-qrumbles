import {
	useState, useReducer, useRef,
	useCallback, memo,
	useEffect, useLayoutEffect,
	Fragment
} from "react";
import "./theme-picker.css";



const F = (t, p0, p1, p2, p) => {
	const t1 = 1 - t;
	return ((t1**3) * p0) + (3 * (t1*t1) * t * p1) + (3 * t1 * (t*t) * p2) + ((t**3) * p);
};

const getExtremums = (p0, p1, p2, p) => {
	const a = p0 - (3 * p1) + (3 * p2) - p;
	const b = -2 * (p0 - p1 - p1 + p2);

	const D = Math.sqrt((b*b) - (4 * a * (p0 - p1)));

	if (isNaN(D)) {

		if (p0 < p) {

			return {
				maxt: 1,
				mint: 0
			};
		} else {

			return {
				maxt: 0,
				mint: 1
			};
		}
	} else {

		const t1 = (-b + D) / (2 * a);
		const t2 = (-b - D) / (2 * a);

		if ((b / 2) + (a * t1) > 0) {

			return {
				maxt: Math.min(Math.max(t1, 0.01), 1 - 0.01),
				mint: Math.min(Math.max(t2, 0.01), 1 - 0.01)
			};
		} else {

			return {
				maxt: Math.min(Math.max(t2, 0.01), 1 - 0.01),
				mint: Math.min(Math.max(t1, 0.01), 1 - 0.01)
			};
		}
	}
};

const hueToRGB = hue => {

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

const getX = (t, curve) => {
	const t1 = 1 - t;
	return ((t1**3) * curve.x0) + (3 * (t1*t1) * t * curve.x1) + (3 * t1 * (t*t) * curve.x2) + ((t**3) * curve.x);
};

const getY = (t, curve) => {
	const t1 = 1 - t;
	return ((t1**3) * curve.y0) + (3 * (t1*t1) * t * curve.y1) + (3 * t1 * (t*t) * curve.y2) + ((t**3) * curve.y);
};

export const compileColors = (hue, curve, tints) => {

	const colors = [];

	hue /= 60;

	const h1 = Math.floor(hue);
	const f = (h1 % 2) ? hue - h1 : 1 - hue + h1;

	const ni = 2 - ((h1 + 1) % 3);
	const mi = (Math.floor(h1 / 2) + 2) % 3;
	const vi = Math.floor((h1 + 1) / 2) % 3;

	for (let i = 0; i < tints.length; i++) {

		colors[i] = new Uint8ClampedArray(3);

		const s = getX(tints[i], curve) / 100;
		const v = 1 - (getY(tints[i], curve) / 100);

		colors[i][ni] = Math.floor(255 * v * (1 - (s * f)));
		colors[i][mi] = Math.floor(255 * v * (1 - s));
		colors[i][vi] = Math.floor(255 * v);
	}

	return colors;
};

export const SVCurvePicker = props => {

	const width = parseInt(props.width) || 100;
	const height = parseInt(props.height) || 100;
	const wc = width / 100;
	const hc = height / 100;

	const curve = props.ofCurve;

	const cx0 = Math.floor(curve.x0 * wc);
	const cy0 = Math.floor(curve.y0 * hc);
	const cx1 = Math.floor(curve.x1 * wc);
	const cy1 = Math.floor(curve.y1 * hc);
	const cx2 = Math.floor(curve.x2 * wc);
	const cy2 = Math.floor(curve.y2 * hc);
	const cx = Math.floor(curve.x * wc);
	const cy = Math.floor(curve.y * hc);

	const infc = props.interfaceSize > 0 ? parseInt(props.interfaceSize) : 2;
	const poiR = 2 * infc;

	const ref = useRef();

	const focusedPointer = useRef(-1);

	const handleMouseMove = e => {

		const rect = ref.current.getBoundingClientRect();

		switch (focusedPointer.current) {
			case 0: {
				const x = (Math.min(Math.max(e.clientX, rect.left), rect.right) - rect.left) / wc;
				const y = (Math.min(Math.max(e.clientY, rect.top), rect.bottom) - rect.top) / hc;
		
				props.setCurveBy({
					x0: x,
					y0: y,
					x1: curve.x1,
					y1: curve.y1,
					x2: curve.x2,
					y2: curve.y2,
					x: curve.x,
					y: curve.y
				});
				break;
			}
			case 1: {
				const x = (e.clientX - rect.left) / wc;
				const y = (e.clientY - rect.top) / wc;

				props.setCurveBy({
					x0: curve.x0,
					y0: curve.y0,
					x1: x,
					y1: y,
					x2: curve.x2,
					y2: curve.y2,
					x: curve.x,
					y: curve.y
				});
				break;
			}
			case 2: {
				const x = (e.clientX - rect.left) / wc;
				const y = (e.clientY - rect.top) / hc;

				props.setCurveBy({
					x0: curve.x0,
					y0: curve.y0,
					x1: curve.x1,
					y1: curve.y1,
					x2: x,
					y2: y,
					x: curve.x,
					y: curve.y
				});
				break;
			}
			case 3: {
				const x = (Math.min(Math.max(e.clientX, rect.left), rect.right) - rect.left) / wc;
				const y = (Math.min(Math.max(e.clientY, rect.top), rect.bottom) - rect.top) / hc;

				props.setCurveBy({
					x0: curve.x0,
					y0: curve.y0,
					x1: curve.x1,
					y1: curve.y1,
					x2: curve.x2,
					y2: curve.y2,
					x: x,
					y: y
				});
			}
		}
	};

	const handleMouseDown = i => {

		focusedPointer.current = i;
		document.documentElement.style.cursor = "grab";
		window.addEventListener("mousemove", handleMouseMove);
		window.addEventListener("mouseout", handleMouseMove);
	};

	window.addEventListener("mouseup", () => {
		document.documentElement.style.cursor = "";
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
					<stop offset="100%" stopColor={hueToRGB(props.hue)}/>
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
					<feFlood x="0" y="0" width="100%" height="100%" floodColor="white" floodOpacity="1" result="FLOOD"/>
					<feBlend in="SourceGraphic" mode="difference"/>
				</filter>

				<pattern id="inverted" width="100%" height="100%" patternUnits="userSpaceOnUse">
					<rect x="0" y="0" width="100%" height="100%" fill="url(#hue)" filter="url(#invert)"/>
					<rect x="0" y="0" width="100%" height="100%" fill="url(#lightness)"/>
				</pattern>

				<pattern id="SV" width="100%" height="100%" patternUnits="userSpaceOnUse">
					<rect x="0" y="0" width="100%" height="100%" fill="url(#hue)"/>
					<rect x="0" y="0" width="100%" height="100%" fill="url(#darkness)"/>

					<line x1={cx0} y1={cy0} x2={cx1} y2={cy1} stroke="url(#inverted)" strokeWidth={infc * 2 / 3}/>
					<line x1={cx} y1={cy} x2={cx2} y2={cy2} stroke="url(#inverted)" strokeWidth={infc * 2 / 3}/>
				</pattern>

				<polygon points={`${-poiR},${-poiR} ${poiR},0 ${-poiR},${poiR}`} id={"r-triangle-" + infc} className="tUxUIt-theme-picker-svg-pointer"/>
			</defs>

			<line x1={cx0} y1={cy0} x2={cx1} y2={cy1} stroke="white" strokeWidth={infc * 2 / 3}/>
			<line x1={cx} y1={cy} x2={cx2} y2={cy2} stroke="white" strokeWidth={infc * 2 / 3}/>

			<rect x="0" y="0" width="100%" height="100%" fill="url(#SV)"/>

			<path
				d={
					`M ${
						cx0
					} ${
						cy0
					} C ${
						cx1
					} ${
						cy1
					}, ${
						cx2
					} ${
						cy2
					}, ${
						cx
					} ${
						cy
					}`
				}
				stroke="url(#inverted)"
				strokeWidth={infc}
				fill="none"
			/>

			<use x={cx0} y={cy0} href={"#r-triangle-" + infc} onMouseDown={e => handleMouseDown(0)}/>
			<circle
				className="tUxUIt-theme-picker-svg-pointer"
				cx={cx}
				cy={cy}
				r={poiR}
				onMouseDown={e => handleMouseDown(3)}
			/>

			<rect
				x={cx1 - poiR}
				y={cy1 - poiR}
				width={poiR * 2}
				height={poiR * 2}
				className="tUxUIt-theme-picker-svg-pointer"
				onMouseDown={e => handleMouseDown(1)}
			/>
			<rect
				x={cx2 - poiR}
				y={cy2 - poiR}
				width={poiR * 2}
				height={poiR * 2}
				className="tUxUIt-theme-picker-svg-pointer"
				onMouseDown={e => handleMouseDown(2)}
			/>
		</svg>
	);
};

export const VerticalPointersScale = props => {

	const scale = props.interfaceSize > 0 ? parseInt(props.interfaceSize) : 2;

	const fcPointerIndex = useRef(-1);
	const _fcPointer = useRef(); // <<<

	const ref = useRef();

	const handleMouseDown = e => {

		if (ref.current !== e.target)
			return;

		const rect = ref.current.getBoundingClientRect();

		const value_ = (e.clientY - rect.top) / rect.height;

		if (props.autosort === "autosort") {

			const values_ = [];

			let i = 0;

			for (i; value_ > props.ofValues[i]; i++) {

				values_[i] = props.ofValues[i];
			}

			values_[i] = value_;

			for (i; i < props.ofValues.length; i++) {

				values_[i + 1] = props.ofValues[i];
			}

			props.setValuesBy(values_);

			handlePointerMouseDown(i + 1);

		} else {

			const values_ = Array.from(props.ofValues);

			values_.push(value_);

			props.setValuesBy(values_);

			handlePointerMouseDown(values_.length - 1);
		}
	};

	const handlePointerMouseMove = e => {

		if (fcPointerIndex.current < 0)
			return;

		const rect = ref.current.getBoundingClientRect();

		const value_ = (Math.min(Math.max(e.clientY, rect.top), rect.bottom) - rect.top) / rect.height;

		if (_fcPointer.current === value_) // <<<
			return;

		_fcPointer.current = value_; // <<<

		if (props.autosort === "autosort") {

			const values_ = [];

			let i = 0, j = 0;

			for (i; value_ > props.ofValues[i]; i++) {

				if (i === fcPointerIndex.current)
					continue;

				values_[j++] = props.ofValues[i];
			}

			values_[j++] = value_;

			for (i; i < props.ofValues.length; i++) {

				if (i === fcPointerIndex.current)
					continue;

				values_[j++] = props.ofValues[i];
			}

			props.setValuesBy(values_, fcPointerIndex.current);

		} else {

			const values_ = Array.from(props.ofValues);

			values_[fcPointerIndex.current] = value_;

			props.setValuesBy(values_, fcPointerIndex.current);
		}

		console.log("MouseMove");
	};

	const handlePointerMouseDown = useCallback(i => {

		fcPointerIndex.current = i;
		document.documentElement.style.cursor = "grab";
		// console.log("Add", fcPointerIndex);

		// setTimeout(() => handlePointerMouseMove({clientY: 440}), 10);

		window.addEventListener("mousemove", handlePointerMouseMove);

		// setTimeout(() => props.onPointerFocus(i), 1500);
		// props.onPointerFocus(i);
	}, []);

	window.addEventListener("mouseup", () => {

		// fcPointerIndex.current = -1;
		document.documentElement.style.cursor = "";
		window.removeEventListener("mousemove", handlePointerMouseMove);
	});

	return (
		<svg
			version="1.1"
			xmlns="http://www.w3.org/2000/svg"
			className={"tUxUIt-theme-picker-svg " + (props.className ?? "")}
			onMouseDown={handleMouseDown}
			ref={ref}
		>
			<defs>
				<polygon points={`${-3 * scale},${-2 * scale} ${-3 * scale},${2 * scale} ${-scale},${2 * scale} ${scale},0 ${-scale},${-2 * scale}`} id={"right-point-" + scale} className="tUxUIt-theme-picker-svg-pointer"/>
				<polygon points={`${-scale},0 ${scale},${-2 * scale} ${3 * scale},${-2 * scale} ${3 * scale},${2 * scale} ${scale},${2 * scale}`} id={"left-point-" + scale} className="tUxUIt-theme-picker-svg-pointer"/>
			</defs>

			{props.ofValues.map((t, i) => {

				let value;

				if (typeof t.value === "number") {

					value = t.value;
				} else {

					value = t;
				}

				return (
					<Fragment key={i}>
						<use x="0" y={value * 100 + "%"} href={"#right-point-" + scale} opacity={(t.focused ?? 0.5) + 0.5} onMouseDown={() => handlePointerMouseDown(i)}/>
						<use x="100%" y={value * 100 + "%"} href={"#left-point-" + scale} opacity={(t.focused ?? 0.5) + 0.5} onMouseDown={() => handlePointerMouseDown(i)}/>
					</Fragment>
				);
			})}
		</svg>
	);
};

export const HorizontalPointersScale = props => {

	const scale = props.interfaceSize > 0 ? parseInt(props.interfaceSize) : 2;

	const fcPointerIndex = useRef(-1);
	const _fcPointer = useRef();

	const ref = useRef();

	const handleMouseDown = e => {

		if (ref.current !== e.target)
			return;

		const rect = ref.current.getBoundingClientRect();

		const value_ = (e.clientX - rect.left) / rect.width;

		if (props.autosort === "autosort") {

			const values_ = [];

			let i = 0;

			for (i; value_ > props.ofValues[i]; i++) {

				values_[i] = props.ofValues[i];
			}

			values_[i] = value_;

			for (i; i < props.ofValues.length; i++) {

				values_[i + 1] = props.ofValues[i];
			}

			props.setValuesBy(values_);

			handlePointerMouseDown(i + 1);

		} else {

			const values_ = Array.from(props.ofValues);

			values_.push(value_);

			props.setValuesBy(values_);

			handlePointerMouseDown(values_.length - 1);
		}
	};

	const handlePointerMouseMove = e => {

		const rect = ref.current.getBoundingClientRect();

		const value_ = (Math.min(Math.max(e.clientX, rect.left), rect.right) - rect.left) / rect.width;

		if (_fcPointer.current === value_)
			return;

		_fcPointer.current = value_;

		if (props.autosort === "autosort") {

			const values_ = [];

			let i = 0, j = 0;

			for (i; value_ > props.ofValues[i]; i++) {

				if (i === fcPointerIndex.current)
					continue;

				values_[j++] = props.ofValues[i];
			}

			values_[j++] = value_;

			for (i; i < props.ofValues.length; i++) {

				if (i === fcPointerIndex.current)
					continue;

				values_[j++] = props.ofValues[i];
			}

			props.setValuesBy(values_);

		} else {

			const values_ = Array.from(props.ofValues);

			values_[fcPointerIndex.current] = value_;

			props.setValuesBy(values_);
		}
	};

	const handlePointerMouseDown = i => {

		fcPointerIndex.current = i;
		document.documentElement.style.cursor = "grab";
		window.addEventListener("mousemove", handlePointerMouseMove);
	};

	window.addEventListener("mouseup", () => {
		document.documentElement.style.cursor = "";
		window.removeEventListener("mousemove", handlePointerMouseMove);
	});
	
	return (
		<svg
			version="1.1"
			xmlns="http://www.w3.org/2000/svg"
			className={"tUxUIt-theme-picker-svg " + (props.className ?? "")}
			onMouseDown={handleMouseDown}
			ref={ref}
		>
			<defs>
				<polygon points={`${-2 * scale},${-3 * scale} ${2 * scale},${-3 * scale} ${2 * scale},${-scale} 0,${scale} ${-2 * scale},${-scale}`} id={"bottom-point-" + scale} className="tUxUIt-theme-picker-svg-pointer"/>
				<polygon points={`${-2 * scale},${3 * scale} ${2 * scale},${3 * scale} ${2 * scale},${scale} 0,${-scale} ${-2 * scale},${scale}`} id={"top-point-" + scale} className="tUxUIt-theme-picker-svg-pointer"/>
			</defs>

			{props.ofValues.map((t, i) => (<Fragment key={i}>
				<use x={t * 100 + "%"} y="0" href={"#bottom-point-" + scale} onMouseDown={() => handlePointerMouseDown(i)}/>
				<use x={t * 100 + "%"} y="100%" href={"#top-point-" + scale} onMouseDown={() => handlePointerMouseDown(i)}/>
			</Fragment>))}
		</svg>
	);
};

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

// export const ThemePicker = props => {

// 	of
// };