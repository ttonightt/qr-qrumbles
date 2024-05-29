import {memo, useState, useRef, useReducer, useEffect, useCallback, useMemo} from "react";
import {
	SVCurvePicker,
	PaletteScale,
	compileRGBs,
	VerticalPointersScale,
	fireglowInitPreset,
	getX,
	getY
} from "../../tUxUIt/utils/theme-picker/components";
import {ExpandingInput} from "../../tUxUIt/components"



const paletteGradient = values => {
	
	let str = "linear-gradient(135deg,";

	const step = 100 / values.length;
	let i = 0

	for (i; i < values.length - 1; i++) {

		str +=
			"rgb(" + values[i][0] + "," +  values[i][1] + "," +  values[i][2] + ") " + (i * step) + "%," +
			"rgb(" + values[i][0] + "," +  values[i][1] + "," +  values[i][2] + ") " + ((i + 1) * step) + "%,";
	}

	str += "rgb(" + values[i][0] + "," +  values[i][1] + "," +  values[i][2] + ") " + (i * step) + "%";

	return str;
};

const CSSVariablesFromRGBs = (colors, base) => {

	const vars = {};

	for (let i = 0; i < colors.length; i++) {

		vars["--" + base + "-" + (i + 1)] = colors[i][0] + " " + colors[i][1] + " " + colors[i][2];
		// vars["--" + base + "-" + (i + 1)] = "#" + ((colors[i][0] << 16) + (colors[i][1] << 8) + colors[i][2]).toString(16).padStart(6, "0");
	}

	return vars;
};



export const ThemePickerDemoPage = memo(props => {

	// console.log("Page render");

	const [fc, setFocused] = useState(0);

	const [scheme, setScheme] = useState("HSV");

	const [presets, setPresets] = useState([
		{
			name: "pri",
			hue: 210,
			curve: {
				x0: 10,  	y0: 4,
				x1: 62,  	y1: 19,
				x2: 87,  	y2: 56,
				x:  73,  	y:  100
			},
			tints: [0.056, 0.12, 0.24, 0.36, 0.5, 0.6, 0.72, 0.84, 0.92],
			required: true
		},
		{
			name: "sec",
			hue: 35,
			curve: {
				x0: 75,  	y0: 0,
				x1: 100,  	y1: 55,
				x2: 0,  	y2: 50,
				x:  73,  	y:  100
			},
			tints: [0.056, 0.12, 0.24, 0.36, 0.5, 0.6, 0.72, 0.84, 0.92],
			required: true
		},
		{
			name: "acc",
			hue: 170,
			curve: {
				x0: 9,  	y0: 4,
				x1: 160,  	y1: 38,
				x2: 14,  	y2: 60,
				x:  73,  	y:  100
			},
			tints: [0.056, 0.12, 0.24, 0.36, 0.5, 0.6, 0.69, 0.78, 0.88],
			required: true
		},
		{
			name: "neu",
			hue: 340,
			curve: {
				x0: 0,  	y0: 0,
				x1: 0,  	y1: 0,
				x2: 30,  	y2: 60,
				x:  30,  	y:  100
			},
			tints: [0.056, 0.12, 0.36, 0.46, 0.56, 0.66, 0.76, 0.88, 0.96],
			required: true
		},
		// {...fireglowInitPreset, name: "thd"}
	]);

	const [editing, setEditing] = useState(-1);

	const ref = useRef();

	const modifyPresets = (index, data) => {

		const presets_ = Array.from(presets);

		Object.assign(presets_[index], data);

		setPresets(presets_);
	};

	const addPreset = prs => {

		const presets_ = Array.from(presets);
		presets_.push(prs);

		setPresets(presets_);
		setFocused(presets.length);
		setEditing(presets.length);
	};

	const [focusedTintIndex, setFocusedTintIndex] = useState();

	useEffect(() => {

		ref.current?.focus();
	}, [editing]);

	const removePreset = index => {

		const presets_ = [];
		let i;

		for (i = 0; i < index; i++) presets_[i] = presets[i];

		for (i++; i < presets.length; i++) presets_[i - 1] = presets[i];

		setPresets(presets_);
		setFocused(index === 0 ? 0 : index - 1);
	};

	const extractHue = useCallback(hues => {

		modifyPresets(fc, {hue: hues[fc] * 360})
	}, [fc]);

	const {hue, curve, tints} = presets[fc];

	const modifyTints = useCallback(tints => {

		modifyPresets(fc, {tints});
	}, [tints]);

	const hues = presets.map(p => p.hue / 360);

	const colors = presets.map(({hue, curve, tints}) => compileRGBs(hue, curve, tints));

	const removeButton = presets[fc].required ? {

		
	} : {

	};

	return (
		<div
			style={{
				...CSSVariablesFromRGBs(colors[0], "color-pri"),
				...CSSVariablesFromRGBs(colors[1], "color-sec"),
				...CSSVariablesFromRGBs(colors[2], "color-acc"),
				...CSSVariablesFromRGBs(colors[3], "color-neu")
			}}
			className="relative w-100w h-100h flex flex-col items-center justify-center overflow-x-hidden gap-2r"
		>
			<div
				style={{backgroundImage: paletteGradient(colors[fc])}}
				className="-inset-x-50h inset-y-0 abs z-0 special-background"
			></div>

			<div className="max-w-50w flex flex-row align-center justify-center">
				<div className="
					Button-Box p-03 leading-1e text-pri-1 drop-03 drop-pri-7 mb-03
					before:inset-0 before:abs before:-z-1 before:clip-rabbet-015 before:bg-pri-5
					active:text-sec-2 active:translate-y-03 active:drop-none
				">
					Button 1
				</div>
				<div className="
					Button-Box font-deco text-sec-7 drop-03 drop-sec-1 mb-03
					before:Underlay before:bg-sec-2 before:clip-rabbet-015
					active:translate-y-03 active:drop-none
				">
					Button 2
				</div>
				<div className="
					Button-Box font-deco text-neu-1 drop-03 drop-pri-7 mb-03
					before:Underlay before:clip-rabbet-015 before:bg-pri-8
					active:text-sec-1 active:translate-y-03 active:drop-none
				">
					Button 3
				</div>
				<div className="
					Button-Box font-deco text-sec-1 drop-03 drop-sec-7 mb-03
					before:Underlay before:bg-sec-5 before:clip-rabbet-015
					active:translate-y-03 active:drop-none
				">
					Button 2
				</div>
				<div className="
					Button-Box font-deco text-acc-1 drop-03 drop-acc-7 mb-03
					before:Underlay before:bg-acc-5 before:clip-rabbet-015
					active:translate-y-03 active:drop-none
				">
					Button 2
				</div>
				<div className="
					Button-Box p-02 font-deco text-acc-1 drop-03 drop-acc-9 mb-03
					before:Underlay before:bg-acc-8 before:clip-rabbet-015
					hover:text-acc-2 active:translate-y-03 active:drop-none
				">
					Button 2
				</div>
				{/* <div className="
					Button-Box font-deco text-neu-1 mb-03
					before:Underlay before:clip-rabbet-prism-015 before:-right-03 before:-bottom-03 before:bg-pri-8
					after:Underlay after:clip-rabbet-015 after:bg-pri-9
					active:text-sec-1 active:translate-y-03 active:translate-x-03 active:before:hidden
				">
					Button 1
				</div> */}
			</div>

			<div className="
				fix right-0 grid grid-rows-2a grid-cols-4a gap-x-2r gap-y-1r z-1 text-neu-1
				before:Underlay before:bg-neu-9 text-2r p-2r before:clip-rabbet-l-015 before:text-4r
			">
				<div className="
					row-start-1 row-end-2 col-start-1 col-end-5 flex flex-wrap items-center
				">
					{presets.map((p, i) => (
						<div
							key={i}
							className={"Button-Box text-neu-1 drop-neu-7 p-03 leading-1e before:bg-neu-8 before:Underlay last-of-type:before:clip-rabbet-r-015 first-of-type:before:clip-rabbet-l-015 active:translate-y-0 active:drop-none" + ((i === fc) ? "" : " drop-03 -translate-y-03")}
							onClick={() => setFocused(i)}
						>
							{i === editing ? (
								<ExpandingInput
									ofRef={ref}
									value={p.name}
									onChange={e => modifyPresets(fc, {name: e.target.value})}
									onBlur={() => setEditing(-1)}
									className="w-1ch max-w-60px leading-1e h-1e"
								/>
							) : p.name}
						</div>
					))}
					<p
						className="Button-Box font-deco text-acc-1 bg-acc-8 clip-rabbet-015 ml-06 leading-1e px-03 py-02 hover:bg-acc-7 active:translate-y-02"
						onClick={() => addPreset({...fireglowInitPreset, name: "new"})}
					>+</p>
					<p
						className="Button-Box text-pri-1 bg-pri-8 clip-rabbet-015 ml-06 leading-07 underline px-03 py-02 hover:bg-pri-7 active:translate-y-02"
						onClick={() => setEditing(fc)}
					>a</p>
					{presets[fc].required ? (
						<p
							className="Button-Box text-neu-5 bg-neu-8 clip-rabbet-015 ml-06 leading-07 px-03 py-02 cursor-auto"
						>x</p>
					) : (
						<p
							className="Button-Box text-sec-1 bg-sec-8 clip-rabbet-015 ml-06 leading-07 px-03 py-02 hover:bg-sec-7 active:translate-y-02"
							onClick={() => removePreset(fc)}
						>x</p>
					)}
				</div>

				<div className="row-start-2 row-end-3 col-start-1 col-end-2 clip-rabbet-015 w-fit justify-self-center cursor-pointer">
					<div
						className="Button-Box hover:bg-neu-8 py-0 px-02 h-07 w-1e overflow-hidden"
					>^</div>
					<div
						className="Button-Box hover:bg-neu-8 py-0 px-02 h-07 w-1e overflow-hidden rotate-180"
					>^</div>
				</div>

				<input
					type="text"
					value={hue}
					onChange={e => modifyPresets(fc, {
						hue: Math.max(Math.min(parseInt(e.target.value) || 0, 360), 0)
					})}
					className="
						row-start-2 row-end-3 col-start-2 col-end-3
						text-neu-1 clip-rabbet-015 box-content w-[3ch] pl-02 pr-01 py-01 -mx-02
						hover:bg-neu-1/10 focus:bg-neu-1/10
					"
					maxLength="3"
				/>

				<div className="row-start-2 row-end-3 col-start-2 col-end-3 justify-self-end -mr-04 cursor-default">
					x:
					<input
						type="text"
						value={tints[focusedTintIndex] * 100}
						onChange={e => {
							const tints_ = Array.from(tints);

							tints_[focusedTintIndex] = Math.max(Math.min(parseInt(e.target.value) || 0, 100), 0) / 100;

							modifyPresets(fc, {tints: tints_})
						}}
						className="
							text-neu-1 clip-rabbet-015 box-content w-[5ch] pl-02 pr-01 py-01 mx-02
							hover:bg-neu-1/10 focus:bg-neu-1/10
						"
						maxLength="5"
					/>
					y:
					<input
						type="text"
						value={getY(tints[focusedTintIndex], curve)}
						onChange={e => modifyPresets(fc, {
							hue: Math.max(Math.min(parseInt(e.target.value) || 0, 360), 0)
						})}
						className="
							text-neu-1 clip-rabbet-015 box-content w-[3ch] pl-02 pr-01 py-01 mx-02
							hover:bg-neu-1/10 focus:bg-neu-1/10
						"
						maxLength="3"
					/>
				</div>

				<div className="row-start-2 row-end-3 col-start-4 col-end-5 clip-rabbet-015 w-fit justify-self-center cursor-pointer">
					<div
						className="Button-Box hover:bg-neu-8 py-0 px-02 h-07 w-1e overflow-hidden"
					>^</div>
					<div
						className="Button-Box hover:bg-neu-8 py-0 px-02 h-07 w-1e overflow-hidden rotate-180"
					>^</div>
				</div>

				<VerticalPointersScale
					name="HUE"
					scaleAction="capture-focused"
					ofValues={hues}
					setValuesBy={extractHue}
					interfaceSize={2}
					onPointerFocus={i => setFocused(i)}
					className="w-1e h-100 row-start-3 row-end-4 col-start-1 col-end-2 hue"
				/>
				<SVCurvePicker
					hue={hue}
					ofPointers={tints}
					ofCurve={curve}
					setCurveBy={curve => modifyPresets(fc, {curve})}
					width="200"
					height="180"
					interfaceSize={2}
					className="z-10 row-start-3 row-end-4 col-start-2 col-end-3"
				/>
				<PaletteScale
					direction="vertical"
					curve={curve}
					hue={hue}
					className="abs w-2e h-100 row-start-3 row-end-4 col-start-4 col-end-5"
				/>
				<div className="relative h-100 border-ntr-1/25 border-dashed border-r-2 row-start-3 row-end-4 col-start-3 col-end-4"></div>
				<VerticalPointersScale
					name="Palette"
					scaleAction="create" // create | capture-focused | none
					ofValues={tints}
					setValuesBy={modifyTints}
					interfaceSize={2}
					onPointerFocus={index => setFocusedTintIndex(index)}
					autosort="autosort"
					className="abs w-2e h-100 row-start-3 row-end-4 col-start-4 col-end-5 cursor-copy"
				/>

				<div className="row-start-4 row-end-5 col-start-2 col-end-4 justify-self-end">
					<div className="Button-Box inline-block py-02 px-01 leading-1e hover:bg-neu-8 clip-rabbet-015 me-02">
						{scheme}
						<p className="inline-block h-07 w-07 leading-12 overflow-hidden rotate-180">^</p>
					</div>
					{Math.floor(hue)} {Math.floor(tints[0] * 1000) / 10} {Math.floor(tints[0] * 1000) / 10}
				</div>

				<div
					className="row-start-4 row-end-5 col-start-4 col-end-5 Button-Box text-sec-1 bg-sec-8 clip-rabbet-015 w-fit leading-07 px-03 py-02 hover:bg-sec-7 justify-self-center"
					// onClick={}
				>x</div>
			</div>
		</div>
	);
});

