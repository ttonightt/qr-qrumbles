import {useState} from "react";
import {VerticalPointersScale, SVCurvePicker, PaletteScale} from "./components";

export const ThemePicker = ({ofPresets: presets, setPresetsBy, className, style}) => {

	const [fc, focus] = useState(0);

	const modifyPresets = preset => {

		const state = Array.from(presets);

		Object.assign(state[fc], preset);

		setPresetsBy(state);
	};

	const {hue, curve, tints} = presets[fc];

	return (
		<div
			className={
				"grid grid-rows-2a grid-cols-4a gap-2r z-1 text-neu-1 before:Underlay before:bg-neu-9 text-2r p-2r before:clip-rabbet-l-015" +
				(className === "" ? "" : " " + className)
			}
			style={style}
		>

			<div className="row-start-1 row-end-2 col-start-1 col-end-5 flex flex-wrap -mt-03 mb-03">
				{presets.map((p, i) => (
					<div
						key={i}
						className={"Button-Box text-neu-1 drop-neu-7 p-03 leading-1e before:bg-neu-8 before:Underlay last:before:clip-rabbet-r-015 first:before:clip-rabbet-l-015 active:translate-y-03 active:drop-none" + ((i === fc) ? " translate-y-03" : " drop-03")}
						onClick={() => focus(i)}
					>
						{p.code || p.name || i + 1}
					</div>
				))}
			</div>

			<div className="row-start-2 row-end-3 col-start-1 col-end-5 justify-self-start">
				Hue:
				<input
					type="text"
					value={hue}
					onChange={e => modifyPresets({
						hue: Math.max(Math.min(parseInt(e.target.value) || 0, 360), 0)
					})}
					className="
						text-neu-1 clip-rabbet-01 box-content w-[3ch] pl-02 pr-01 ml-02
						hover:bg-neu-1/10 focus:bg-neu-1/10
					"
					maxLength="3"
				/>
			</div>

			<VerticalPointersScale
				scaleAction="capture-focused"
				ofValues={[hue / 360]}
				setValuesBy={hues => modifyPresets({hue: hues[0] * 360})}
				onPointerFocus={i => setFocused(i)}
				interfaceSize={2}
				className="w-1e h-100 row-start-3 row-end-4 col-start-1 col-end-2 hue"
			/>
			<SVCurvePicker
				hue={hue}
				ofPointers={tints}
				ofCurve={curve}
				setCurveBy={curve => modifyPresets({curve})}
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
				scaleAction="create" // create | capture-focused | none
				ofValues={tints}
				setValuesBy={tints => modifyPresets({tints})}
				interfaceSize={2}
				autosort="autosort"
				className="abs w-2e h-100 row-start-3 row-end-4 col-start-4 col-end-5"
			/>

			<div className="row-start-4 row-end-5 col-start-2 col-end-3">
				S:
				<input
					type="text"
					value={hue}
					onChange={e => modifyPresets({
						hue: Math.max(Math.min(parseInt(e.target.value) || 0, 360), 0)
					})}
					className="
						text-neu-1 clip-rabbet-01 box-content w-[3ch] pl-02 pr-01 mx-01
						hover:bg-neu-1/10 focus:bg-neu-1/10
					"
					maxLength="3"
				/>
				&nbsp;V:
				<input
					type="text"
					value={hue}
					onChange={e => modifyPresets({
						hue: Math.max(Math.min(parseInt(e.target.value) || 0, 360), 0)
					})}
					className="
						text-neu-1 clip-rabbet-01 box-content w-[3ch] pl-02 pr-01 mx-01
						hover:bg-neu-1/10 focus:bg-neu-1/10
					"
					maxLength="3"
				/>
			</div>
		</div>
	);
};