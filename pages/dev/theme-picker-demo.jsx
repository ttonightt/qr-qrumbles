"use strict";

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

import {useRouteError, useSearchParams} from "react-router-dom";
import {ExpandingInput, MenuBox, Menu} from "../../tUxUIt/components"

import {downloadFile} from "../../js/file-saver-reader";



const joinHSX = hsx => `${hsx[0].toFixed(0)}, ${hsx[1].toFixed(1)}%, ${hsx[2].toFixed(1)}%`;

const compilePaletteGradient = (presets, fc) => {

	let str = "linear-gradient(135deg,";

	const step = 100 / presets[fc].tints.length;
	const len = presets[fc].tints.length - 1;

	for (let i = 0; i < len; i++) {

		str +=
			"rgb(var(--color-" + (fc + 1) + "-" + (i + 1) + ")) " + (i * step) + "%," +
			"rgb(var(--color-" + (fc + 1) + "-" + (i + 1) + ")) " + ((i + 1) * step) + "%,";
	}

	str += "rgb(var(--color-" + (fc + 1) + "-" + (len + 1) + ")) " + (len * step) + "%";

	return str;
};

const compileCSSVariables = presets => {

	const vars = {};

	for (let i = 0; i < presets.length; i++) {

		const {hue, curve, tints} = presets[i];

		const tints_ = Array.from(tints).sort((a, b) => a - b);

		for (let j = 0; j < tints_.length; j++) {
	
			vars["--color-" + (i + 1) + "-" + (j + 1)] = compileRGB(hue, curve, tints_[j]).join(" ");
		}
	}

	return vars;
};

const compileSingleColorCode = (hue, curve, tint, scheme) => {

	switch (scheme) {
		case "HSV":
			return joinHSX(compileHSV(hue, curve, tint));
		case "HSL":
			return joinHSX(compileHSL(hue, curve, tint));
		case "RGB":
			return compileRGB(hue, curve, tint).join(", ");
		case "Hex":
			return "#" + RGBtoHex(compileRGB(hue, curve, tint));
	}
};

const compileColorCodesList = (presets, scheme) => {

	let str = scheme + "\n";

	for (let i = 0; i < presets.length; i++) {

		const {hue, curve, tints, name} = presets[i];

		const tints_ = Array.from(tints).sort((a, b) => a - b);

		str += "\n" +name + ":\n\n";

		for (let j = 0; j < tints_.length; j++)
			str += compileSingleColorCode(hue, curve, tints_[j], scheme) + "\n";
	}

	return str;
};

const validateDecodedPresets = presets => {

	const err = new Error("..."); // <<<

	for (let i = 0; i < presets.length; i++) {

		const {hue, curve, tints} = presets[i];

		for (let j = 0; j < tints.length; j++) {

			if (tints[j] < 0 || tints[j] > 1)
				throw err;
		}

		if (hue < 0 || hue > 360)
			throw err;

		if (curve[0] < 0 || curve[1] > 100)
			throw err;

		if (curve[6] < 0 || curve[7] > 100)
			throw err;
	}

	return presets;
};



const colorSchemes = ["HSV", "HSL", "RGB", "Hex"];

const focusedPointerProps = {
	stroke: "cyan",
	zIndex: 1
};

const initPresets = [
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
		minTintsNumber: 0,
		tints: [0.056, 0.12, 0.24, 0.36, 0.5, 0.6, 0.72, 0.84, 0.92],
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
		minTintsNumber: 0,
		tints: [0.056, 0.12, 0.24, 0.36, 0.5, 0.6, 0.72, 0.84, 0.92],
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
		minTintsNumber: 0,
		tints: [0.056, 0.12, 0.24, 0.36, 0.5, 0.6, 0.69, 0.78, 0.88],
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
		minTintsNumber: 0,
		tints: [0.056, 0.12, 0.36, 0.46, 0.56, 0.78, 0.84, 0.88, 0.96],
		required: true
	}
];



export const ThemePickerDemoPage = memo(props => {

// INITIALISING STATES

	// URL QUERY PARAMETERS

	const [URLParams, setURLParams] = useSearchParams();

	const URLPresets = URLParams.get("presets");

	const setURLPresets = presets_ => {

		setURLParams({presets: btoa(JSON.stringify(presets_))});

		console.log("URL parameter is updating");
	};

	// PRESET FOCUS

	const [fc, setFocused] = useState(0);

	// PRESETS

	const [presets, setPresets] = useState(
		URLPresets !== null
		?
		validateDecodedPresets(JSON.parse(atob(URLPresets)))
		:
		initPresets
	);

	const {hue, curve, tints, focusedTint} = presets[fc]; // CURRENT HUE, CURVE AND TINTS

		// HUE POINTERS

	const extractFocusedHue = useCallback(hueValues => {

		modifyPreset(fc, {hue: hueValues[fc].value * 360});
	}, [fc]);

	const captureFocusedHuePointer = useCallback((e, {capturePointer, compileValue}) => {

		capturePointer(fc);

		modifyPreset(fc, {hue: compileValue(e) * 360});
	}, [fc]);

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
		setURLPresets(presets_);
	}, [presets.length, fc]);


	const removeFocusedPreset = useCallback(() => {

		const presets_ = [];
		let i;

		for (i = 0; i < fc; i++) presets_[i] = presets[i];

		for (i++; i < presets.length; i++) presets_[i - 1] = presets[i];

		setPresets(presets_);
		setFocused(fc === 0 ? 0 : fc - 1);
		setURLPresets(presets_);
	}, [presets.length]);


	const spreadAmongPresets = useCallback(obj => {

		const presets_ = presets.map(p => Object.assign(p, obj));

		setPresets(presets_);
		setURLPresets(presets_);

	}, [presets.length]);

		// TINTS

	const tintPointers = useMemo(() => tints.map((t, i) => {

		if (i === focusedTint) {

			return {
				...focusedPointerProps,
				value: t
			};
		} else {

			return {value: t};
		}
	}), [fc, tints, focusedTint]);


	const setTintsOfFocusedPreset = useCallback(
		tints => modifyPreset(fc, {tints: tints.map(t => t.value)})
	, [fc]);


	const focusTintOfFocusedPreset = useCallback(index => {

		modifyPreset(fc, {focusedTint: index});
	}, [fc]);


	const pushTintToFocusedPreset = useCallback((e, {value, capturePointer}) => {

		const tints_ = Array.from(tints);

		tints_.push(value);

		modifyPreset(fc, {tints: tints_, focusedTint: tints.length});
		capturePointer(tints.length);
	}, [fc, tints]);

	
	const popFocusedTintFromFocusedPreset = useCallback(() => {

		const tints_ = [];
		let i;

		for (i = 0; i < focusedTint; i++) tints_[i] = tints[i];

		for (i++; i < tints.length; i++) tints_[i - 1] = tints[i];

		modifyPreset(fc, {tints: tints_, focusedTint: 0});

	}, [fc, tints]);

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
		visibility: false,
		value: colorSchemes[0]
	});

	const [exportColorScheme, setExportColorScheme] = useReducer((_state, data) => {

		return Object.assign({}, _state, data);
	}, {
		visibility: false,
		value: colorSchemes[0]
	});

	// REF

	const inputRef = useRef();

	// EFFECTS

	useEffect(() => {

		inputRef.current?.focus();
	}, [nameEditorPosition]);

	useEffect(() => {

		setURLPresets(presets);
	}, []);

// PREPARATIONS BEFORE A RENDER

	// HUE POINTERS

	const huePointers = [];

	for (let i = 0; i < presets.length; i++) {

		if (fc !== i)
			huePointers[i] = {value: presets[i].hue / 360};
	}

	huePointers[fc] = {...focusedPointerProps, value: presets[fc].hue / 360};


	const focusedTintColorCode = compileSingleColorCode(hue, curve, tints[focusedTint], tintPreviewScheme.value);

	return (
		<div
			style={compileCSSVariables(presets)}
			className="relative box-border w-100w h-100h p-40px justify-center overflow-x-hidden gap-2r bg-pri-4"
		>
			<div
				style={{
					backgroundImage: compilePaletteGradient(presets, fc)
				}}
				className="fix -inset-x-50h inset-y-0 z-0 skew-x-[45deg] bg-[length:100%_2%]"
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
				abs top-[25%] left-[50%] grid grid-rows-[auto_auto_auto_auto] grid-cols-[1em_200px_2px_2em] gap-x-2r gap-y-1r z-1 text-2r p-2r
				before:Underlay before:bg-neu-9 before:clip-rabbet-01 before:text-4r
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

										setURLPresets(presets);
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
					onPointerRelease={() => setURLPresets(presets)}
					interfaceSize={2}
					className="w-1e h-100 row-start-2 row-end-3 col-start-1 col-end-2 tUxUIt-theme-picker-hue-gradient"
				/>

				<SVCurvePicker
					hue={hue}
					ofCurve={curve}
					setCurveBy={curve => modifyPreset(fc, {curve})}
					ofPointers={tints}
					width="200"
					height="200"
					interfaceSize={2}
					onControlRelease={() => setURLPresets(presets)}
					className="z-10 row-start-2 row-end-3 col-start-2 col-end-3"
				/>

				<div className="abs z-10 w-06 h-06 hover:h-[30%] hover:w-[30%] row-start-2 bg-neu-1/25 -top-03 -right-03 row-end-3 col-start-2 col-end-3 rounded-[0.33333em_0.33333em_0.33333em_50%] hover:rounded-[0.33333em_0.33333em_0.33333em_100%] hover:bg-trns transition-all duration-300 overflow-hidden">
					<div className="
							abs row-start-2 row-end-3 col-start-2 col-end-3 top-06 right-06
							Button-Box float-right text-neu-2 bg-neu-8/80 hover:bg-neu-8 clip-rabbet-015 w-fit leading-1e px-02 py-02
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
					ofPointers={tintPointers}
					setPointersBy={setTintsOfFocusedPreset}
					onFieldMouseDown={pushTintToFocusedPreset}
					onPointerFocus={focusTintOfFocusedPreset}
					onPointerRelease={() => setURLPresets(presets)}
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
							Button-Box float-right text-neu-2 bg-neu-8/80 hover:bg-neu-8 clip-rabbet-015 w-fit leading-1e px-02 py-02 mt-03
						"
						onClick={() => spreadAmongPresets({tints, focusedTint})}
					>{"<>"}</div>
				</div>

				<div className="row-start-3 row-end-4 col-start-1 col-end-4 justify-self-end z-10 text-neu-2">
					<div className="inline-block">
						<div
							className="
								Button-Box py-02 px-01 me-02 leading-1e
								before:Underlay before:clip-rabbet-015
								hover:before:bg-neu-8
							"
							onClick={() => setTintPreviewScheme({visibility: !tintPreviewScheme.visibility})}
						>
							{tintPreviewScheme.value}
							<p className="inline-block h-07 w-07 leading-12 overflow-hidden rotate-180">^</p>
						</div>
						{tintPreviewScheme.visibility && (
							<menu className="Menu abs z-10 mt-02 text-sec-9">
								{colorSchemes.map(scheme => (
									<li key={scheme} onClick={() => setTintPreviewScheme({
										visibility: false,
										value: scheme
									})}>{scheme}</li>
								))}
							</menu>
						)}
					</div>
					{focusedTintColorCode}
					{clipboardCopyStatus ? (
						<div
							className="Button-Box float-right ml-02 -mr-03 text-neu-5 clip-rabbet-015 w-07 leading-09 px-03 py-02 hover:bg-neu-8 hover:text-neu-1"
							onClick={() => copyToClipboard(focusedTintColorCode)}
						>✓</div>
					) : (
						<div
							className="Button-Box float-right ml-02 -indent-01 text-shadow-neu-5 text-shadow-02 -mr-03 text-neu-1 clip-rabbet-015 w-07 leading-07 px-03 py-02 hover:bg-neu-8 hover:text-neu-1"
							onClick={() => copyToClipboard(focusedTintColorCode)}
						>□</div>
					)}
				</div>

				{0 <= focusedTint && focusedTint < tints.length && tints.length > presets[fc].minTintsNumber ? (

					<div
						className="row-start-3 row-end-4 col-start-4 col-end-5 Button-Box text-sec-1 bg-sec-8 clip-rabbet-015 w-fit leading-07 px-03 py-02 hover:bg-sec-7 justify-self-center"
						onClick={popFocusedTintFromFocusedPreset}
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
						onClick={() => {
							const date = new Date();

							downloadFile(
								new Blob([compileColorCodesList(presets, exportColorScheme.value)], {type: "text/plaintext"}), 
								`theme-${date.getFullYear()}-${date.getMonth()}-${date.getDay()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}.txt`
							)
						}}
					>
						Export colors
					</div>
					<div className="inline-block">
						<div
							className="
								Button-Box leading-1e p-03 text-neu-6 drop-03 drop-neu-7
								before:Underlay before:bg-neu-9 before:clip-rabbet-r-015
								hover:before:bg-neu-8 hover:text-neu-1 active:translate-y-03 active:drop-none
							"
							onClick={() => setExportColorScheme({visibility: !exportColorScheme.visibility})}
						>
							{exportColorScheme.value}
							<p className="
								leading-07 h-07 w-07 float-right overflow-hidden rotate-180
							">^</p>
						</div>

						{exportColorScheme.visibility && (
							<menu className="Menu abs z-10 mt-02 text-sec-9">
								{colorSchemes.map(scheme => (
									<li key={scheme} onClick={() => setExportColorScheme({
										visibility: false,
										value: scheme
									})}>{scheme}</li>
								))}
							</menu>
						)}
					</div>
				</div>
			</div>
		</div>
	);
});

