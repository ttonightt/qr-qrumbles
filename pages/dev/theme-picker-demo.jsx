import {memo, useState, useRef, useReducer, useEffect, useCallback, useMemo} from "react";
import {
	SVCurvePicker,
	PaletteScale,
	VerticalPointersScale,
	compileRGB,
	compileHSV,
	compileHSL,
	RGBtoHex
} from "../../tUxUIt/utils/theme-picker/components";
import {fireglowInitPreset} from "../../tUxUIt/utils/theme-picker/presets";
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

const CSSVariablesFromRGBs = (rgbs, base) => {

	const vars = {};

	for (let i = 0; i < rgbs.length; i++) {

		vars["--" + base + "-" + (i + 1)] = rgbs[i][0] + " " + rgbs[i][1] + " " + rgbs[i][2];
		// vars["--" + base + "-" + (i + 1)] = "#" + ((rgbs[i][0] << 16) + (rgbs[i][1] << 8) + rgbs[i][2]).toString(16).padStart(6, "0");
	}

	return vars;
};



const colorSchemes = ["Hex", "HSV", "HSL", "RGB"];

const focusedPointerProps = {
	stroke: "cyan",
	zIndex: 1
};



export const ThemePickerDemoPage = memo(props => {

// INITIALISING STATES

	// PRESET FOCUS

	const [fc, setFocused] = useState(0);

	// PRESETS

	const [presets, setPresets] = useState([
		{
			name: "Primal",
			hue: 261,
			curve: [
				15,  	5,
				86,  	9,
				90,  	40,
				62,  	100
			],
			focusedTint: 4,
			tints: [
				{value: 0.056},
				{value: 0.12},
				{value: 0.24},
				{value: 0.36},
				{
					value: 0.5,
					...focusedPointerProps
				},
				{value: 0.6},
				{value: 0.72},
				{value: 0.84},
				{value: 0.92}
			],
			required: true
		},
		{
			name: "Secondary",
			hue: 340,
			curve: [
				15,  	5,
				86,  	9,
				90,  	40,
				62,  	100
			],
			focusedTint: 4,
			tints: [
				{value: 0.056},
				{value: 0.12},
				{value: 0.24},
				{value: 0.36},
				{
					value: 0.5,
					...focusedPointerProps
				},
				{value: 0.6},
				{value: 0.72},
				{value: 0.84},
				{value: 0.92}
			],
			required: true
		},
		{
			name: "Accent",
			hue: 170,
			curve: [
				15,  	5,
				86,  	9,
				90,  	40,
				62,  	100
			],
			focusedTint: 4,
			tints: [
				{value: 0.056},
				{value: 0.12},
				{value: 0.24},
				{value: 0.36},
				{
					value: 0.5,
					...focusedPointerProps
				},
				{value: 0.6},
				{value: 0.69},
				{value: 0.78},
				{value: 0.88}
			],
			required: true
		},
		{
			name: "Neutral",
			hue: 9,
			curve: [
				0,  	0,
				2,  	33,
				3,  	80,
				9,  	100
			],
			focusedTint: 4,
			tints: [
				{value: 0.056},
				{value: 0.12},
				{value: 0.36},
				{value: 0.46},
				{
					value: 0.56,
					...focusedPointerProps
				},
				{value: 0.78},
				{value: 0.84},
				{value: 0.88},
				{value: 0.96}
			],
			required: true
		}
	]);

	const {hue, curve, tints} = presets[fc]; // CURRENT HUE, CURVE AND TINTS

		// HUE POINTERS

	const extractFocusedHue = useCallback(hueValues => {

		modifyPreset(fc, {hue: hueValues[fc].value * 360})
	}, [fc]);

	const captureFocusedHuePointer = (e, {capturePointer, compileValue}) => {

		capturePointer(fc);

		modifyPreset(fc, {hue: compileValue(e) * 360});
	};

		// BASIC OPERATIONS WITH PRESETS

	const modifyPreset = useCallback((index, data) => {

		const presets_ = Array.from(presets);

		Object.assign(presets_[index], data);

		setPresets(presets_);
	}, [presets.length]);


	const dublicateFocusedPreset = useCallback(() => {

		const presets_ = Array.from(presets);
		presets_.push(Object.assign(
			{},
			presets[fc],
			{
				name: "New Preset",
				hue: (presets[fc].hue + 180) % 360,
				required: false
			}
		));

		setPresets(presets_);
		setFocused(presets.length);
		setNameEditorPosition(presets.length);
	}, [presets.length, fc]);


	const removeFocusedPreset = useCallback(() => {

		const presets_ = [];
		let i;

		for (i = 0; i < fc; i++) presets_[i] = presets[i];

		for (i++; i < presets.length; i++) presets_[i - 1] = presets[i];

		setPresets(presets_);
		setFocused(fc === 0 ? 0 : fc - 1);
	}, [presets.length]);


	const spreadAmongPresets = useCallback(obj => {

		setPresets(presets.map(p => Object.assign(p, obj)));

	}, [presets.length]);

		// TINTS

	const focusTintOfFocusedPreset = useCallback(index => {

		const tints_ = [];
		
		for (let i = 0; i < tints.length; i++) {

			if (i !== index)
				tints_[i] = {value: tints[i].value};
		}

		tints_[index] = {
			...focusedPointerProps,
			value: tints[index].value
		};

		modifyPreset(fc, {tints: tints_});
	}, [tints]);


	const pushTintToFocusedPreset = useCallback((e, {value, capturePointer}) => {

		const tints_ = [];
		
		for (let i = 0; i < tints.length; i++) {

			tints_[i] = {value: tints[i].value};
		}

		tints_[tints.length] = {
			...focusedPointerProps,
			value
		};

		modifyPreset(fc, {tints: tints_});
		capturePointer(tints.length);
	}, [fc, tints.length]);

	// INPUT

	const [nameEditorPosition, setNameEditorPosition] = useState(-1);

	// CLIPBOARD COPY

	const [clipboardCopyStatus, setClipboardCopyStatus] = useState(0);

	const _timer = useRef();

	const copyToClipboard = useCallback(data => {

		navigator.clipboard.writeText(data).then(() => {

			setClipboardCopyStatus(1);

			clearTimeout(_timer.current);

			_timer.current = setTimeout(() => {

				setClipboardCopyStatus(0);
			}, 1800);
		});
	}, [_timer.current]);

	// MENUS

	const [tintPreviewScheme, setTintPreviewScheme] = useReducer((_state, data) => {

		return Object.assign({}, _state, data);
	}, {
		menuVisibility: false,
		value: colorSchemes[0]
	});

	const [exportColorScheme, setExportColorScheme] = useReducer((_state, data) => {

		return Object.assign({}, _state, data);
	}, {
		menuVisibility: false,
		value: colorSchemes[0]
	});

	// REF

	const inputRef = useRef();

	// EFFECTS

	useEffect(() => {

		inputRef.current?.focus();
	}, [nameEditorPosition]);

// PREPARATIONS BEFORE A RENDER

	// HUE POINTERS

	const huePointers = [];

	for (let i = 0; i < presets.length; i++) {

		if (fc !== i)
			huePointers[i] = {value: presets[i].hue / 360};
	}

	huePointers[fc] = {...focusedPointerProps, value: presets[fc].hue / 360};

	// RGBS

	const rgbs = presets.map(({hue, curve, tints}) => {

		const tints_ = Array.from(tints).sort((a, b) => a.value - b.value);

		return tints_.map(tint => compileRGB(hue, curve, tint.value));
	});

	// FOCUSED TINT

	let focusedTintValue;

	const focusedTintIndex = -1; // FAST FIX!!!!!!!!!!!!!!!!!!!

	// switch (tintPreviewScheme.value.toUpperCase()) {
	// 	case "HSV": {
	// 		const [h, s, v] = compileHSV(hue, curve, tints[focusedTintIndex]);
	// 		focusedTintValue = `${h.toFixed(0)}, ${s.toFixed(1)}%, ${v.toFixed(1)}%`;
	// 		break;
	// 	}
	// 	case "HSL": {
	// 		const [h, s, l] = compileHSL(hue, curve, tints[focusedTintIndex]);
	// 		focusedTintValue = `${h.toFixed(0)}, ${s.toFixed(1)}%, ${l.toFixed(1)}%`;
	// 		break;
	// 	}
	// 	case "HEX": {
	// 		focusedTintValue = RGBtoHex(...compileRGB(hue, curve, tints[focusedTintIndex]));
	// 		break;
	// 	}
	// 	case "RGB": {
	// 		focusedTintValue = compileRGB(hue, curve, tints[focusedTintIndex]).join(", ");
	// 		break;
	// 	}
	// }

	const compileAll = useCallback(() => {

		let str = "";

		switch (exportColorScheme) {

			case "Hex":



			case "HSV": case "HSL": case "RGB":

				const prefix = exportColorScheme.toLowerCase();

				for (let i = 0; i < presets.length; i++) {

					str += presets[i].name + ":\n\r";
		
					const tints = presets[i].tints;
		
					for (let j = 0; j < tints.length; j++) {
		
						str += "\t" + prefix + "(" + exportColorScheme + tints[j] + ")\n\r";
					}
				}
		}

		return str;
	}, [presets.length]);

	return (
		<div
			style={{
				...CSSVariablesFromRGBs(rgbs[0], "color-pri"),
				...CSSVariablesFromRGBs(rgbs[1], "color-sec"),
				...CSSVariablesFromRGBs(rgbs[2], "color-acc"),
				...CSSVariablesFromRGBs(rgbs[3], "color-neu")
			}}
			className="relative box-border w-100w h-100h p-40px justify-center overflow-x-hidden gap-2r bg-pri-4"
		>
			<div
				style={{
					backgroundImage: paletteGradient(rgbs[fc])
				}}
				className="-inset-x-50h inset-y-0 abs z-0 skew-x-[45deg] bg-[length:100%_2%]"
			></div>

			<div>
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
					Button-Box font-deco text-acc-7 drop-03 drop-acc-7 mb-03
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
			</div>

			<div className="
				fix bottom-0 right-0 grid grid-rows-[auto_auto_auto_auto] grid-cols-[1em_200px_2px_2em] gap-x-2r gap-y-1r z-1
				before:Underlay before:bg-neu-9 text-2r p-2r before:clip-rabbet-l-015 before:text-4r
			">
				<div className="
					row-start-1 row-end-2 col-start-1 col-end-5 flex flex-wrap items-center max-w-100 -mx-015 -mt-015 mb-1r clip-rabbet-015
				">
					{presets.map((p, i) => (
						<div
							key={i}
							className={"Button-Box font-deco py-03 px-02 hover:bg-neu-8 last-of-type:clip-rabbet-r-015 last-of-type:mr-04 flex-shrink overflow-hidden" + ((i === fc) ? " underline text-neu-2" : " text-neu-5")}
							onClick={() => setFocused(i)}
						>
							{i === nameEditorPosition ? (
								<ExpandingInput
									ofRef={inputRef}
									value={p.name}
									placeholder="name"
									onChange={e => modifyPreset(fc, {name: e.target.value})}
									onBlur={e => {
										setNameEditorPosition(-1);

										if (e.target.value === "")
											modifyPreset(fc, {name: "new"});
									}}
									className="leading-1e box-content h-1e py-03 -my-03 max-w-100 placeholder:text-neu-5"
								/>
							) : p.name}
						</div>
					))}

					<p className="leading-1e my-02">
						<i
							className="Button-Box inline-block not-italic font-deco text-acc-1 bg-acc-8 clip-rabbet-01 leading-1e px-02 py-01 hover:bg-acc-7 active:translate-y-02"
							onClick={dublicateFocusedPreset}
						>+</i>
						<i
							className="Button-Box inline-block not-italic text-pri-1 bg-pri-8 clip-rabbet-01 ml-04 leading-07 underline px-02 py-01 hover:bg-pri-7 active:translate-y-02"
							onClick={() => setNameEditorPosition(fc)}
						>a</i>
						{presets[fc].required ? (
							<i
								className="Button-Box inline-block not-italic text-neu-5 bg-neu-8 clip-rabbet-01 ml-04 leading-07 px-02 py-01 cursor-auto"
							>x</i>
						) : (
							<i
								className="Button-Box inline-block not-italic text-sec-1 bg-sec-8 clip-rabbet-01 ml-04 leading-07 px-02 py-01 hover:bg-sec-7 active:translate-y-02"
								onClick={removeFocusedPreset}
							>x</i>
						)}
					</p>
				</div>

				<VerticalPointersScale
					zLayers={[0,1]}
					ofPointers={huePointers}
					setPointersBy={extractFocusedHue}
					onPointerFocus={setFocused}
					onFieldMouseDown={captureFocusedHuePointer}
					interfaceSize={2}
					className="w-1e h-100 row-start-2 row-end-3 col-start-1 col-end-2 tUxUIt-theme-picker-hue-gradient"
				/>

				<SVCurvePicker
					hue={hue}
					ofCurve={curve}
					setCurveBy={curve => modifyPreset(fc, {curve})}
					ofPointers={tints.map(t => t.value)}
					width="200"
					height="200"
					interfaceSize={2}
					className="z-10 row-start-2 row-end-3 col-start-2 col-end-3"
				/>

				<div className="abs z-10 w-06 h-06 hover:h-[30%] hover:w-[30%] row-start-2 bg-neu-1/25 -top-03 -right-03 row-end-3 col-start-2 col-end-3 rounded-[0.33333em_0.33333em_0.33333em_50%] hover:rounded-[0.33333em_0.33333em_0.33333em_100%] hover:bg-trns transition-all duration-300 overflow-hidden">
					<div className="
							abs row-start-2 row-end-3 col-start-2 col-end-3 top-06 right-06
							Button-Box float-right text-pri-2 bg-pri-8/80 hover:bg-pri-8 clip-rabbet-015 w-fit leading-1e px-02 py-02
						"
						onClick={() => spreadAmongPresets({curve})}
					>{"<>"}</div>
				</div>

				<div className="relative h-100 border-neu-5 border-dashed border-r-2 row-start-2 row-end-3 col-start-3 col-end-4"></div>

				<PaletteScale
					hue={hue}
					curve={curve}
					direction="vertical"
					className="abs w-2e h-100 row-start-2 row-end-3 col-start-4 col-end-5"
				/>

				<VerticalPointersScale
					zLayers={[0,1]}
					ofPointers={tints}
					setPointersBy={tints => modifyPreset(fc, {tints})}
					onFieldMouseDown={pushTintToFocusedPreset}
					onPointerFocus={focusTintOfFocusedPreset}
					interfaceSize={2}
					className="abs w-2e h-100 row-start-2 row-end-3 col-start-4 col-end-5 cursor-copy"
				/>

				<div className="
					row-start-2 row-end-3 col-start-4 col-end-5 justify-self-center transition-all duration-300 overflow-hidden
					flex flex-col items-center
					abs z-10 -top-03 w-06 h-06 bg-neu-1/25 rounded-[0.33333em]
					hover:h-3e hover:w-100 hover:rounded-[0.33333em_0.33333em_50%_50%] hover:bg-trns
				">
					<div className="
							abs row-start-2 row-end-3 col-start-2 col-end-3 top-03
							Button-Box float-right text-pri-2 bg-pri-8/80 hover:bg-pri-8 clip-rabbet-015 w-fit leading-1e px-02 py-02 mt-03
						"
						onClick={() => spreadAmongPresets({tints})}
					>{"<>"}</div>
				</div>

				<div className="row-start-3 row-end-4 col-start-1 col-end-4 justify-self-end z-10 text-neu-2">
					<div
						className="Button-Box inline-block py-02 px-01 leading-1e hover:before:bg-neu-8 before:Underlay before:clip-rabbet-015 me-02"
						onClick={() => setTintPreviewScheme({menuVisibility: !tintPreviewScheme.menuVisibility})}
					>
						{tintPreviewScheme.value}
						<p className="inline-block h-07 w-07 leading-12 overflow-hidden rotate-180">^</p>
						{tintPreviewScheme.menuVisibility ? (
							<div className="
								abs top-100 -left-01 -right-01 z-10 bg-neu-8 clip-rabbet-015
								before:Underlay before:bg-neu-9 before:inset-01 before:clip-rabbet-015
							">
								{colorSchemes.map(sch => (
									<div
										key={sch}
										className="p-02 text-left text-neu-5 hover:underline hover:text-neu-2"
										onClick={() => setTintPreviewScheme({value: sch})}
									>{sch}</div>
								))}
							</div>
						) : ""}
					</div>
					{focusedTintValue}
					{clipboardCopyStatus ? (
						<div
							className="Button-Box float-right ml-02 -mr-03 text-neu-5 clip-rabbet-015 w-07 leading-09 px-03 py-02 hover:bg-neu-8 hover:text-neu-1"
							onClick={() => copyToClipboard(focusedTintValue)}
						>✓</div>
					) : (
						<div
							className="Button-Box float-right ml-02 -indent-01 [text-shadow:_0.22222em_0.22222em_0_white] -mr-03 text-neu-5 clip-rabbet-015 w-07 leading-07 px-03 py-02 hover:bg-neu-8 hover:text-neu-1"
							onClick={() => copyToClipboard(focusedTintValue)}
						>□</div>
					)}
				</div>

				{0 <= focusedTintIndex && focusedTintIndex < tints.length && tints.length > 9 ? (

					<div
						className="row-start-3 row-end-4 col-start-4 col-end-5 Button-Box text-sec-1 bg-sec-8 clip-rabbet-015 w-fit leading-07 px-03 py-02 hover:bg-sec-7 justify-self-center"
						onClick={() => {
							const tints_ = [];
							let i;
					
							for (i = 0; i < focusedTintIndex; i++) tints_[i] = tints[i];
					
							for (i++; i < tints.length; i++) tints_[i - 1] = tints[i];

							modifyPreset(fc, {tints: tints_});
						}}
					>x</div>
				) : (
					<div
						className="row-start-3 row-end-4 col-start-4 col-end-5 Button-Box text-neu-5 bg-neu-8 clip-rabbet-015 w-fit leading-07 px-03 py-02 cursor-auto justify-self-center"
					>x</div>
				)}

				<div className="row-start-4 row-end-5 col-start-1 col-end-5 -mx-015 flex">
					<div
						className="
							Button-Box leading-1e flex-1 p-03 text-neu-6 drop-03 drop-neu-7
							before:Underlay before:bg-neu-9 before:clip-rabbet-l-015
							hover:before:bg-neu-8 hover:text-neu-4 active:translate-y-03 active:drop-none
						"
						onClick={() => navigator.clipboard.writeText(Math.floor(hue))}
					>
						Export colors
					</div>
					<div
						className="
							Button-Box leading-1e p-03 text-neu-6 drop-03 drop-neu-7
							before:Underlay before:bg-neu-9 before:clip-rabbet-r-015
							hover:before:bg-neu-8 hover:text-neu-1 active:translate-y-03 active:drop-none
						"
						onClick={() => setExportColorScheme({menuVisibility: !exportColorScheme.menuVisibility})}
					>
						{exportColorScheme.value}
						<p className="
							leading-07 h-07 w-07 float-right overflow-hidden rotate-180
						">^</p>
						{exportColorScheme.menuVisibility ? (
							<div className="
								abs top-100 -left-01 -right-01 z-10 bg-neu-8 clip-rabbet-015
								before:Underlay before:bg-neu-9 before:inset-01 before:clip-rabbet-015
							">
								{colorSchemes.map(sch => (
									<div
										key={sch}
										className="p-02 text-left text-neu-5 hover:underline hover:text-neu-2"
										onClick={() => setExportColorScheme({value: sch})}
									>{sch}</div>
								))}
							</div>
						) : ""}
					</div>
				</div>
			</div>
		</div>
	);
});

