import {memo, useState, useRef, useReducer} from "react";
import {SVCurvePicker, PaletteScale, compileColors, VerticalPointersScale, HorizontalPointersScale} from "../../tUxUIt/utils/theme-picker";

// camelCase to kebab-case:
//
// str.replace(/[A-Z]/g, m => "-" + m.toLowerCase())

const compileCSSVars = (values, base) => {
	const vars = {};

	for (let i = 0; i < values.length; i++) {

		vars["--" + base + "-" + (i + 1)] = values[i][0] + "," + values[i][1] + "," + values[i][2];
	}

	return vars;
};

const compileHexes = values => {
	let str = "";

	for (let i = 0; i < values.length; i++) {

		str += "#" + ((values[i][0] << 16) + (values[i][1] << 8) + values[i][2]).toString(16).padStart(6, "0") + "\n"
	}

	return str;
};

export const ThemePickerDemoPage = memo(props => {

	const [fc, setFocused] = useState(0);

	const [presets, modifyPresets] = useReducer((_state, data) => {

		const state = Array.from(_state);

		Object.assign(state[fc], data);

		return state;
	}, [
		{
			hue: 210,
			curve: {
				x0: 10,  	y0: 4,
				x1: 62,  	y1: 19,
				x2: 87,  	y2: 56,
				x:  73,  	y:  100
			},
			tints: [0.056, 0.12, 0.24, 0.36, 0.5, 0.6, 0.72, 0.84, 0.92]
		},
		{
			hue: 35,
			curve: {
				x0: 75,  	y0: 0,
				x1: 100,  	y1: 55,
				x2: 0,  	y2: 50,
				x:  73,  	y:  100
			},
			tints: [0.056, 0.12, 0.24, 0.36, 0.5, 0.6, 0.72, 0.84, 0.92]
		},
		{
			hue: 170,
			curve: {
				x0: 9,  	y0: 4,
				x1: 160,  	y1: 38,
				x2: 14,  	y2: 60,
				x:  73,  	y:  100
			},
			tints: [0.056, 0.12, 0.24, 0.36, 0.5, 0.6, 0.69, 0.78, 0.88]
		}
	]);

	// const _modifyPresets = useRef(modifyPresets);

	// console.log(_modifyPresets.current === modifyPresets);

	const {hue, curve, tints} = presets[fc];

	const colors = compileColors(hue, curve, tints);

	// console.log("ThemePickerDemoPage: got updated");

	return (
		<div
			style={compileCSSVars(colors, "color")}
			className="w-100w h-100h flex flex-col items-center justify-center"
		>
			<div className="special-background absolute inset-0 z-0"></div>
			<div className="grid grid-rows-2a grid-cols-4a gap-2r relative before:absolute before:bg-ntr-9 before:content-empty before:inset-0 text-2r p-2r before:clip-rabbet-015">

				<div className="row-start-1 row-end-2 col-start-1 col-end-5 flex flex-wrap">
					{presets.map((p, i) => (
						<div
							key={i}
							className={"Button -Comp" + ((i === fc) ? " -Pressed" : "")}
							onClick={() => setFocused(i)}
						>
							{i}
						</div>
					))}
				</div>

				<VerticalPointersScale
					scaleAction="capture-focused"
					ofValues={[hue / 360]}
					setValuesBy={hues => modifyPresets({hue: hues[0] * 360})}
					onPointerFocus={i => setFocused(i)}
					interfaceSize={2}
					className="w-1e h-100 row-start-2 row-end-3 col-start-1 col-end-2 hue"
				/>
				<SVCurvePicker
					hue={hue}
					ofCurve={curve}
					setCurveBy={curve => modifyPresets({curve})}
					width="200"
					height="180"
					interfaceSize={2}
					className="z-10 row-start-2 row-end-3 col-start-2 col-end-3"
				/>
				<PaletteScale
					direction="vertical"
					curve={curve}
					hue={hue}
					className="absolute w-2e h-100 row-start-2 row-end-3 col-start-4 col-end-5"
				/>
				<div className="relative w-2px h-100 border-ntr-1/25 border-dashed border-r-2 row-start-2 row-end-3 col-start-3 col-end-4"></div>
				<VerticalPointersScale
					scaleAction="create" // create | capture-focused | none
					ofValues={tints}
					setValuesBy={tints => modifyPresets({tints})}
					interfaceSize={2}
					autosort="autosort"
					className="absolute w-2e h-100 row-start-2 row-end-3 col-start-4 col-end-5"
				/>
			</div>
		</div>
	);
});

