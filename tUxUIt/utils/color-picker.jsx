import React from "react";
import "./color-picker.css";

export const ColorPicker = props => {

	const scale = Math.max(props.scale, 1);
	const s100 = 100 * scale, s001 = 0.01 / scale;
	const poiR = 2 * scale, poiD = 4 * scale;

	const __get = (t, crv) => {

		const t1 = 1 - t;
		return ((t1**3) * crv[0]) + (3 * (t1*t1) * t * crv[1]) + (3 * t1 * (t*t) * crv[2]) + ((t**3) * crv[3]);
	};

	const addExtremumsToCurve = crv => {
		const a = crv[0] - (3 * crv[1]) + (3 * crv[2]) - crv[3];
		const b = -2 * (crv[0] - crv[1] - crv[1] + crv[2]);

		const D = Math.sqrt((b*b) - (4 * a * (crv[0] - crv[1])));

		if (isNaN(D)) {

			if (crv[0] < crv[3]) {

				crv.maxt = 0.95;
				crv.mint = 0.05;
			} else {
				crv.maxt = 0.05;
				crv.mint = 0.95;
			}
		} else {

			const t1 = (-b + D) / (2 * a);
			const t2 = (-b - D) / (2 * a);
	
			if ((b / 2) + (a * t1) > 0) {
	
				crv.maxt = Math.min(Math.max(
					t1, s001), 1 - s001);
				crv.mint = Math.min(Math.max(
					t2, s001), 1 - s001);
			} else {
				crv.maxt = Math.min(Math.max(
					t2, s001), 1 - s001);
				crv.mint = Math.min(Math.max(
					t1, s001), 1 - s001);
			}
		}

		crv.maxf = __get(crv.maxt, crv);
		crv.minf = __get(crv.mint, crv);

		return crv;
	};

	// STATES STATES STATES STATES STATES STATES STATES STATES

	const [hue, setHue] = React.useState(0);

	const [curveX, setCurveX] = React.useReducer((_curveX, params) => {
				
		const curveX_ = addExtremumsToCurve(Object.assign({}, _curveX, {
			[params.pointerId]: params.x
		}));

		if (curveX_.minf > 0 && curveX_.maxf < s100) {

			return curveX_;
		} else {

			return _curveX;
		}
	}, addExtremumsToCurve({
		0: 20 * scale,
		1: 10 * scale,
		2: 42 * scale,
		3: 90 * scale
	}));

	const [curveY, setCurveY] = React.useReducer((_curveY, params) => {
				
		const curveY_ = addExtremumsToCurve(Object.assign({}, _curveY, {
			[params.pointerId]: params.y
		}));

		if ((curveY_[0] > 0 && curveY_[0] < s100 && curveY_[3] > 0 && curveY_[3] < s100) &&
			(curveY_.minf > 0 && curveY_.maxf < s100)
		) {

			return curveY_;
		} else {

			return _curveY;
		}
	}, addExtremumsToCurve({
		0: 100 * scale,
		1: 80 * scale,
		2: 44 * scale,
		3: 100 * scale
	}));

	const [pointers, setPointers] = React.useState([0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]);

	const [mode, setMode] = React.useState(0);

	const SVRef = React.createRef(); // Saturation-Value
	const PPRef = React.createRef(); // Pre-Palette
	const HueRef = React.createRef(); // Pre-Palette

	// CURVE CURVE CURVE CURVE CURVE CURVE CURVE CURVE CURVE CURVE CURVE CURVE

	const getX = t => {

		const t1 = 1 - t;
		return ((t1**3) * curveX[0]) + (3 * (t1*t1) * t * curveX[1]) + (3 * t1 * (t*t) * curveX[2]) + ((t**3) * curveX[3]);
	}

	const getY = t => {

		const t1 = 1 - t;
		return ((t1**3) * curveY[0]) + (3 * (t1*t1) * t * curveY[1]) + (3 * t1 * (t*t) * curveY[2]) + ((t**3) * curveY[3]);
	}

	// CANVAS CANVAS CANVAS CANVAS CANVAS CANVAS CANVAS CANVAS CANVAS

	const SVBase = new ImageData(s100, s100);
	for (let i = 3; i < SVBase.data.length; i += 4) SVBase.data[i] = 255;

	const PPBase = new ImageData(s100, 1);
	for (let i = 3; i < PPBase.data.length; i += 4) PPBase.data[i] = 255;

	const updateSVBase = () => {

		for (let i = 0; i < s100; i++) {
			for (let j = 0; j < s100; j++) {

				const s = i / s100;
				const v = 1 - (j / s100);

				const h1 = Math.floor(hue);
				const f = (h1 % 2) ? hue - h1 : 1 - hue + h1; // <<<

				const m = v * (1 - s);
				const n = v * (1 - (s * f));

				const k = (i + (j * s100)) * 4;

				SVBase.data[k + 2 - ((h1 + 1) % 3)] = Math.floor(255 * n);
				SVBase.data[k + ((Math.floor(h1 / 2) + 2) % 3)] = Math.floor(255 * m);
				SVBase.data[k + (Math.floor((h1 + 1) / 2) % 3)] = Math.floor(255 * v);
			}
		}
	};

	const updatePPBase = () => {

		const klen = s100 * 4;
		const tstep = 1 / s100;

		for (let k = 0, t = 0; k < klen; k += 4, t += tstep) {

			const s = getX(t) / s100;
			const v = 1 - (getY(t) / s100);

			const h1 = Math.floor(hue);
			const f = (h1 % 2) ? hue - h1 : 1 - hue + h1; // <<<

			const m = v * (1 - s);
			const n = v * (1 - (s * f));

			PPBase.data[k + 2 - ((h1 + 1) % 3)] = Math.floor(255 * n);
			PPBase.data[k + ((Math.floor(h1 / 2) + 2) % 3)] = Math.floor(255 * m);
			PPBase.data[k + (Math.floor((h1 + 1) / 2) % 3)] = Math.floor(255 * v);
		}
	};

	const mergeAndInvert = (mx0, mx) => {

		for (let i = 0; i < mx0.length; i += 4) {

			const alpha = mx0[i + 3] / 255;

			mx0[  i  ] = (mx[  i  ] * (1 - alpha)) + ((255 - mx[  i  ]) * ((mx[  i  ] ^ mx0[  i  ]) * alpha / 255));
			mx0[i + 1] = (mx[i + 1] * (1 - alpha)) + ((255 - mx[i + 1]) * ((mx[i + 1] ^ mx0[i + 1]) * alpha / 255));
			mx0[i + 2] = (mx[i + 2] * (1 - alpha)) + ((255 - mx[i + 2]) * ((mx[i + 2] ^ mx0[i + 2]) * alpha / 255));

			mx0[i + 3] = 255;
		}
	};

	let SVCurvePath, SVGuidesPath, saturPath, valuePath;

	const updateSVPaths = () => {
		SVCurvePath = new Path2D();
		SVGuidesPath = new Path2D();

		SVCurvePath.moveTo(curveX[0], curveY[0]);
		SVCurvePath.bezierCurveTo(curveX[1], curveY[1], curveX[2], curveY[2], curveX[3], curveY[3]);

		SVGuidesPath.moveTo(curveX[0], curveY[0]);
		SVGuidesPath.lineTo(curveX[1], curveY[1]);
		SVGuidesPath.moveTo(curveX[3], curveY[3]);
		SVGuidesPath.lineTo(curveX[2], curveY[2]);
	};

	const updateSaturPath = () => {
		saturPath = new Path2D();

		saturPath.moveTo(curveX[0], 0);
		saturPath.bezierCurveTo(curveX[1], s100 / 3, curveX[2], s100 * 2 / 3, curveX[3], s100);
	};

	const updateValuePath = () => {
		valuePath = new Path2D();

		valuePath.moveTo(0, curveY[0]);
		valuePath.bezierCurveTo(s100 / 3, curveY[1], s100 * 2 / 3, curveY[2], s100, curveY[3]);
	};

	const updateSV = () => {

		svx.clearRect(0, 0, s100, s100);

		switch (mode) {
			case 0:
				svx.strokeStyle = "#fff";
				svx.lineWidth = 2;
				svx.stroke(SVCurvePath);
				svx.lineWidth = 1;
				svx.stroke(SVGuidesPath);
				break;
			case 1:
				svx.strokeStyle = "#fff4";
				svx.lineWidth = 2;
				svx.stroke(saturPath);
				// svx.strokeStyle = "#fff";
				svx.stroke(valuePath);
				break;
		}

		const cmx = svx.getImageData(0, 0, s100, s100);

		mergeAndInvert(cmx.data, SVBase.data);

		svx.putImageData(cmx, 0, 0);
	};

	const updatePP = () => {

		ppx.putImageData(PPBase, 0, 0);
	};

	let svx, ppx,
		SVBoundingRect, PPBoundingRect, HueBoundingRect,
		th = 0;

	React.useEffect(() => {
		if (th === 0) {
			th++;

			SVBoundingRect = SVRef.current.getBoundingClientRect();
			PPBoundingRect = PPRef.current.getBoundingClientRect();
			HueBoundingRect = HueRef.current.getBoundingClientRect();

			svx = SVRef.current.getContext("2d");
			ppx = PPRef.current.getContext("2d");

			updateSVPaths();
			updateSaturPath();
			updateValuePath();

			updateSVBase();
			updateSV();

			updatePPBase();
			updatePP();
		}
	});

	// HANDLES HANDLES HANDLES HANDLES HANDLES HANDLES HANDLES HANDLES HANDLES HANDLES

	let _x, _y, pressed = -1;

	const handlePointerMouseDown = (id, e) => {

		_x = e.clientX - SVBoundingRect.x;
		_y = e.clientY - SVBoundingRect.y;
		pressed = id;
	};

	const handleHueScaleMouseDown = e => {

		pressed = 5;
		setHue((e.clientY - HueBoundingRect.y) * 6 / s100);
	};

	window.addEventListener("mousemove", e => {

		switch (pressed) {
			case 0: case 1: case 2: case 3:

				setCurveX({
					pointerId: pressed,
					x: e.clientX - SVBoundingRect.x
				});

				setCurveY({
					pointerId: pressed,
					y: e.clientY - SVBoundingRect.y
				});
				break;
			case 5:
				setHue(
					Math.min(
						Math.max(
							e.clientY - HueBoundingRect.y,
							0
						),
						HueBoundingRect.height
					) * 6 / s100
				);
				break;
			case 8: case 9:
				setCurveX({
					pointerId: pressed - 7,
					x: curveX[pressed - 7] + (e.clientX - SVBoundingRect.x - _x)
				});
				setCurveX({
					pointerId: (pressed ^ 1) - 7,
					x: curveX[(pressed ^ 1) - 7] - ((e.clientX - SVBoundingRect.x - _x) / 3)
				});
				break;
			case 10: case 11:
				setCurveY({
					pointerId: pressed - 9,
					y: curveY[pressed - 9] + (e.clientY - SVBoundingRect.y - _y)
				});
				setCurveY({
					pointerId: (pressed ^ 1) - 9,
					y: curveY[(pressed ^ 1) - 9] - ((e.clientY - SVBoundingRect.y - _y) / 3)
				});
				break;
		}
	});

	window.addEventListener("mouseup", () => {

		pressed = -1;
	});

	// RENDER RENDER RENDER RENDER RENDER RENDER RENDER RENDER RENDER RENDER RENDER

	return (
		<div className="wrap" style={{
			backgroundColor: props.darkColor || "#111",
			color: props.lightColor || "#eee",
			gridTemplateColumns: `${s100}px ${14 * scale}px ${30 * scale}px`,
			fontSize: 7 * scale + "px",
			gridTemplateRows: `1em ${s100}px 1em ${20 * scale}px`
		}}>
			<div className="switcher">
				S/V:
				<div className={(mode === 0) ? "active" : ""} onClick={() => setMode(0)}>Unified</div>
				<div className={(mode === 1) ? "active" : ""} onClick={() => setMode(1)}>Separately</div>
			</div>

			<canvas ref={SVRef} width={s100} height={s100} className="lightness-saturation-plain"></canvas>
			<svg
				version="1.1" xmlns="http://www.w3.org/2000/svg" className="lightness-saturation-plain"
				width={s100}
				height={s100}
				strokeWidth={scale}
			>
				<defs>
					<polygon points={`${-poiR},0 0,${-3 * scale} ${poiR},0 0,${3 * scale}`} id="x-rhombus" className="cursor-y-resize"/>
					<polygon points={`${-3 * scale},0 0,${-poiR} ${3 * scale},0 0,${poiR}`} id="y-rhombus" className="cursor-x-resize"/>
					<polygon points={`${-poiR},${-3 * scale} ${poiR},0 ${-poiR},${3 * scale}`} id="r-triangle"/>
				</defs>
				{!mode ? (<>
					<use x={curveX[0]} y={curveY[0]} href="#r-triangle" onMouseDown={e => handlePointerMouseDown(0, e)}/>
					<rect
						x={curveX[1] - poiR} width={poiD}
						y={curveY[1] - poiR} height={poiD}
						onMouseDown={e => handlePointerMouseDown(1, e)}
					/>
					<rect
						x={curveX[2] - poiR} width={poiD}
						y={curveY[2] - poiR} height={poiD}
						onMouseDown={e => handlePointerMouseDown(2, e)}
					/>
					<circle
						cx={curveX[3]}
						cy={curveY[3]}
						r={poiR}
						onMouseDown={e => handlePointerMouseDown(3, e)}
					/>
				</>) : (<>
					<use x={curveX[0]} y="0" href="#r-triangle" onMouseDown={e => handlePointerMouseDown(0, e)}/>
					<use x="0" y={curveY[0]} href="#r-triangle" onMouseDown={e => handlePointerMouseDown(0, e)}/>

					<use x={getX(0.25)} y={50} href="#y-rhombus" onMouseDown={e => handlePointerMouseDown(8, e)}/>
					<use x={getX(0.75)} y={150} href="#y-rhombus" onMouseDown={e => handlePointerMouseDown(9, e)}/>
					<use x={50} y={getY(0.25)} href="#x-rhombus" onMouseDown={e => handlePointerMouseDown(10, e)}/>
					<use x={150} y={getY(0.75)} href="#x-rhombus" onMouseDown={e => handlePointerMouseDown(11, e)}/>

					<rect
						x={-poiR} width={poiD}
						y={curveY[1] - poiR} height={poiD}
					/>
					<rect
						x={s100 - poiR} width={poiD}
						y={curveY[2] - poiR} height={poiD}
					/>

					<circle
						cx={curveX[3]}
						cy={s100}
						r={poiR}
						onMouseDown={e => handlePointerMouseDown(3, e)}
					/>
					<circle
						cx={s100}
						cy={curveY[3]}
						r={poiR}
						onMouseDown={e => handlePointerMouseDown(3, e)}
					/>
				</>)}
			</svg>

			<div className="hue-scale" ref={HueRef} onMouseDown={handleHueScaleMouseDown}>
				<i style={{top: Math.floor(hue * s100 / 6) + "px"}} onMouseDown={e => handlePointerMouseDown(5, e)}></i>
			</div>

			<div className="pre-palette-title">Pre-Palette:</div>

			<canvas ref={PPRef} width={s100} height="1" style={{width: s100 + "px", height: 20 * scale + "px"}} className="compiled-scale"></canvas>
			<svg
				version="1.1" xmlns="http://www.w3.org/2000/svg" className="compiled-scale"
				width={s100}
				height={20 * scale}
				strokeWidth={scale}
			>
				<defs>
					<polygon points={`${-poiR},${-scale * 3} ${poiR},${-scale * 3} ${poiR},${-scale} 0,${scale} ${-poiR},${-scale}`} id="bottom-point"/>
				</defs>

				{pointers.map((t, i) => (
					<use key={i} x={Math.floor(t * s100)} y="0" href="#bottom-point"/>
				))}
			</svg>

			<div className="palette">
			</div>
		</div>
	);
}