import React from "react";
import {Qanvas} from "../../js/qr/qanvas";
import {ExpandingInput} from "../../tUxUIt/components";

// const SizeMenu = (
// 	<Tuxit.Menu>
// 		<Tuxit.MenuItem value={20}/>
// 		<Tuxit.MenuItem value={27}/>
// 		<Tuxit.MenuItem value={34}/>
// 		<Tuxit.MenuItem value={40}/>
// 	</Tuxit.Menu>
// );

// const ErrorCorrectionDepthMenu = (
// 	<Tuxit.Menu>
// 		<Tuxit.MenuItem value={1}><li>Low</li></Tuxit.MenuItem>
// 		<Tuxit.MenuItem value={0}><li>Medium</li></Tuxit.MenuItem>
// 		<Tuxit.MenuItem value={3}><li>Quartile</li></Tuxit.MenuItem>
// 		<Tuxit.MenuItem value={2}><li>High</li></Tuxit.MenuItem>
// 	</Tuxit.Menu>
// );

// const RectSize = props => {

// 	const ref = React.createRef();

// 	return (
// 		<div className="measure-rect">
// 			<div style={{}}>{}</div>
// 			<div style={{}}>{}</div>
// 			{props.children}
// 		</div>
// 	);
// };

export const StartProjectPage = (
	<div className="
		w-100w h-100h
		overflow-x-hidden
		bg-prim-2
		grid grid-cols-cc grid-rows-cr"
	>
		<div className="p-2r col-start-1 col-end-2 row-start-1 row-end-2 justify-self-end self-start">
			<h3>QR Qrumbles</h3>
			<h6>a1.0.0</h6>
		</div>
		<div className="flex flex-col flex-nowrap items-end mt-15h p-2r col-start-1 col-end-2 row-start-2 row-end-3 justify-self-end self-start">
			<h3 className="leading-1e">New Project</h3>
			<div className="relative pb-4r pl-4r w-fit h-fit mr-1px">
				{/* <RectSize measuring="bl" className=""> */}
					<Qanvas modules={153} scale={3} className="bg-ntrl-1"/>
				{/* </RectSize> */}
				{/* <p className="absolute text-ntrl-1 flex flex-row items-center justify-center">97</p> */}
				{/* <p className="absolute text-ntrl-1 flex flex-row items-center justify-center">97</p> */}
			</div>
		</div>
		<em className="p-2r leading-7r col-start-2 col-end-3 row-start-1 row-end-2 justify-self-start self-start">by @ttonightt</em>
		<div className="flex flex-col flex-nowrap items-start max-w-100 overflow-hidden mt-15h p-2r col-start-2 col-end-3 row-start-2 row-end-3 justify-self-start self-start">
			<div className="
				scrollbar-none overflow-y-visible overflow-x-auto
				-mt-1r mr-1r -ml-1r max-w-100 text-4r
				clip-rebbel-015"
			>
				<ExpandingInput type="text" className="
					font-deco text-prim-9
					hover:bg-ntrl-9/25 focus:bg-ntrl-9/25 bg-trns
					p-1r box-content h-1e block"
					style={{width: "4.2ch"}} placeholder="Name"
				/>
			</div>
			<p>Size: </p>
			{/* <Tuxit.DropdownMenu menu={SizeMenu} default={0}/> */}
			<p>Error Correction Depth: </p>
			{/* <Tuxit.DropdownMenu menu={ErrorCorrectionDepthMenu} default={0}/> */}
			<button>Create</button>
			<u>Open existing project instead</u>
		</div>
	</div>
);