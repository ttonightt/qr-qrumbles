import React from "react";
import {LanguageContext} from "../../js/tiny-usefuls";
import testJson from "@pages/dev/_local/eng.json";

console.log(testJson);

const _menu = [
	{
		greetings: "Hi!",
		key: "English",
		autonym: "English",
		path: "./_local/eng.json"
	},
	{
		greetings: "Živjo!",
		key: "Slovenian",
		autonym: "Slovenščina",
		path: "@pages/dev/_local/_slv.json"
	},
	{
		greetings: "Привіт!",
		key: "Ukrainian",
		autonym: "Українська",
		path: "./_local/ukr.json"
	}
];

export const DEV_LanguagesPage = () => {

	// const [langMap, setLangMap] = React.useState(React.useContext(LanguageContext));

	// const handleChange = e => {

	// 	fetch(_menu[e.target.value].path)
	// 	.then(res => res.json())
	// 	.then(data => setLangMap(data));
	// };

	return (<div>

		<select onChange={e => {

			const obj = _menu[e.target.value];

			fetch(obj.path).then(res => res).then(data => console.log(data));
		}}>
			{_menu.map((obj, i) => {
				return <option key={i} value={i}>{obj.greetings}</option>
			})}
		</select>

		{/* <h3>{langMap.language.autonym}</h3>
		<h3>{langMap.labels.canvasSize}</h3>
		<h3>{langMap.labels.errorCorrectionDepth.Info}</h3>
		<h3>{langMap.labels.errorCorrectionDepth.Title}</h3> */}
	</div>);
};