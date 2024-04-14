"use strict";

import React from "react";
import ReactDOM from "react-dom/client";
import {createBrowserRouter, Link, RouterProvider, Outlet} from "react-router-dom";

// import Charmap from "./charmap/charmap";
// import {Project} from "./prj";

import "./tUxUIt/common.css";
// import "../tUxUIt/components";
// import "../css/style.css";

import {StartProjectPage} from "./pages/editor/start-project";
// import {ProjectEditorPage} from "./pages/editor/editor";

// import {DEV_TypographyPage} from "./pages/dev/typography";
// import {DEV_LanguagesPage} from "./pages/dev/languages";
import {ColorPicker} from "./tUxUIt/utils/color-picker";

// Project.init();

// const ErrorPage = (<>

// 	<div className="flex-center-center">
// 		<h3>Oops!</h3>
// 		<p>There are not the page you're looking for :(</p>
// 		<Link to={"start"}><button>Create New QRt</button></Link>
// 	</div>
// </>);

const ROUTER = createBrowserRouter([
	{
		path: "start-project",
		element: StartProjectPage,
		// errorElement: ErrorPage
	},
	{
		path: "dev/color-picker",
		element: (<div className="w-100w h-100h flex items-center justify-center">
			<ColorPicker scale={2}/>
		</div>)
		// errorElement: ErrorPage
	}
	// {
	// 	title: "QR Qrumbler : Editor",
	// 	path: "editor",
	// 	element: ProjectEditorPage
	// }
]);

// Project.createBlank("qrt0", {
// 	version: 20,
// 	errorCorrectionDepth: "L",
// 	maskPattern: 2
// });

// CONTROLS CONNECTING vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

document.addEventListener("keydown", e => {
	if (e.ctrlKey) {
		switch (e.key) {
			case "e":
				popupBindings["edit"].popen();
				e.preventDefault();
				break;
			case "1":
				Project.current.fitCanvasArea();
				break;
			case "o":
				popupBindings["open"].popen();
				e.preventDefault();
				break;
			case "s":
				switch (Project.current.status) {
					case 0:
						popupBindings["save"].popen();
						break;
					case 2:
						Project.current.save();
						break;
				}
				e.preventDefault();
				break;
			case "S":
				console.log("save");
				// popupBindings["save"].popen();
				Project.current.qrt.downloadCanvas();
				e.preventDefault();
				break;
			case "z":
				Project.current.undo();
				e.preventDefault();
				break;
			case "Z":
				Project.current.redo();
				e.preventDefault();
				break;
		}
	}
});

window.addEventListener("load", () => {

	document.documentElement.style.setProperty("--vw-mod2", (window.innerWidth % 2) + "px");

});

// window.onbeforeunload = e => { // ADD BEFORE PUBLICATION ON WEB !!!!!!!!!!
// 	return e.returnValue;
// };

const ROOT = ReactDOM.createRoot(document.getElementById("root"));

ROOT.render(
	<React.StrictMode>
		{/* <LanguageContext.Provider> */}
			<RouterProvider router={ROUTER}/>
		{/* </LanguageContext.Provider> */}
	</React.StrictMode>
);