import {Suspense, useState, useReducer} from "react";
import {Link} from "react-router-dom";
import {Qanvas} from "../../js/qr/qanvas";
import {useCounterKit} from "../../tUxUIt/kits";
import {
	ExpandingInput,
	Menu, MenuArea, MenuCaller, MenuItem
} from "../../tUxUIt/components";

import {ThemePicker} from "../../tUxUIt/utils/theme-picker/ready-to-use";



export const StartProjectPage = () => {

	const [presets, setPresets] = useState([
		{
			name: "Primal",
			code: "pri",
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
			name: "Secondary",
			code: "sec",
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
			name: "Accent",
			code: "acc",
			hue: 170,
			curve: {
				x0: 9,  	y0: 4,
				x1: 160,  	y1: 38,
				x2: 14,  	y2: 60,
				x:  73,  	y:  100
			},
			tints: [0.056, 0.12, 0.24, 0.36, 0.5, 0.6, 0.69, 0.78, 0.88]
		},
		{
			name: "Neutral",
			code: "neu",
			hue: 340,
			curve: {
				x0: 0,  	y0: 0,
				x1: 0,  	y1: 0,
				x2: 30,  	y2: 60,
				x:  30,  	y:  100
			},
			tints: [0.056, 0.12, 0.36, 0.46, 0.56, 0.66, 0.76, 0.88, 0.96]
		}
	]);



	const [name, setName] = useState("QRt #1");

	const [QRVersion, incQRVersion, decQRVersion] = useCounterKit({min: 97, max: 177, step: 4, value: 97});
	const [QRErrorCorrectionDepth, setQRErrorCorrectionDepth] = useState([1, " 7% Low"]);

	// console.log("StartProjectPage: is rendering");

	return (
		<div className="
			w-100w h-100h
			overflow-x-hidden
			bg-pri-2
			grid grid-cols-cc grid-rows-cr"
		>
			<ThemePicker
				ofPresets={presets}
				setPresetsBy={setPresets}
				className="fix top-0 left-0"
			/>
			<div className="p-2r col-start-1 col-end-2 row-start-1 row-end-2 justify-self-end self-start">
				<h3>QR Qrumbles</h3>
				<h6>a1.0.0</h6>
			</div>
			<div className="flex flex-col flex-nowrap items-end mt-15h p-2r col-start-1 col-end-2 row-start-2 row-end-3 justify-self-end self-start">
				<h3 className="leading-1e">Create</h3>
				<div className="relative pb-4r pl-4r w-fit h-fit mr-1px">
					<Qanvas modules={QRVersion} scale={3} className="bg-ntr-1"/>
					<p className="absolute text-ntr-1 flex flex-row items-center justify-center">
						{QRVersion}
					</p>
					<p className="absolute text-ntr-1 flex flex-row items-center justify-center">
						{QRVersion}
					</p>
				</div>
			</div>
			<em className="p-2r leading-7r col-start-2 col-end-3 row-start-1 row-end-2 justify-self-start self-start">by @ttonightt</em>
			<div className="flex flex-col flex-nowrap items-start max-w-100 mt-15h p-2r col-start-2 col-end-3 row-start-2 row-end-3 justify-self-start self-start">
				<div className="
					scrollbar-none overflow-y-visible overflow-x-auto
					-mt-1r mr-1r -ml-1r max-w-100 text-4r
					clip-rabbet-015"
				>
					<Suspense fallback={<div className="h-1e w-3e Loading"></div>}>
						<ExpandingInput type="text" className="
							font-deco text-pri-9
							hover:bg-ntr-9/25 focus:bg-ntr-9/25 bg-trns
							p-1r box-content h-1e block"
							placeholder="Name"
							ofValue={name}
							onValueChange={setName}
						/>
					</Suspense>
				</div>

				<p>Size: </p>

				<div>
					<div onClick={decQRVersion} className="Button after:clip-rabbet-l-015 float-left">{"<"}</div>
					{QRVersion}
					<div onClick={incQRVersion} className="Button after:clip-rabbet-r-015 float-right">{">"}</div>
				</div>

				<p>Error Correction Depth: </p>

				<MenuArea>
					<div>
						<div className="Rabbet after:clip-rabbet-l-015">
							{QRErrorCorrectionDepth[1]}
						</div>
						<MenuCaller className="Button after:clip-rabbet-r-015">v</MenuCaller>
					</div>

					<Menu onItemSelect={value => setQRErrorCorrectionDepth(value)}>
						<div className="Menu-box">
							<MenuItem value={[1, " 7% Low"]}> 7% Low</MenuItem>
							<MenuItem value={[0, "15% Medium"]}>15% Medium</MenuItem>
							<MenuItem value={[3, "25% Quartile"]}>25% Quartile</MenuItem>
							<MenuItem value={[2, "30% High"]}>30% High</MenuItem>
						</div>
					</Menu>
				</MenuArea>

				<Link to="/editor" state={{
					name,
					QRVersion,
					QRErrorCorrectionDepth: QRErrorCorrectionDepth[0]
				}}>
					<div className="Button">Create</div>
				</Link>
				<u>Open existing project instead</u>
			</div>
		</div>
	);
};