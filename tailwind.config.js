/** @type {import('tailwindcss').Config} */

import plugin from "tailwindcss/plugin";

export default {
	content: [
		"./pages/**/*.jsx",
		"./*.{html, jsx}"
	],
	theme: {
		colors: {
			trns: "transparent",
			prim: {
				1: "hsl(274, 14%, 60%)",
				2: "hsl(274, 15%, 52%)",
				3: "hsl(274, 19%, 45%)",
				4: "hsl(274, 25%, 39%)",
				5: "hsl(274, 29%, 33%)",
				6: "hsl(274, 32%, 29%)",
				7: "hsl(274, 31%, 25%)",
				8: "hsl(274, 32%, 20%)",
				9: "hsl(274, 32%, 16%)"
			},
			scnd: {
				1: "hsl(9, 88%, 90%)",
				2: "hsl(9, 66%, 85%)",
				3: "hsl(9, 60%, 78%)",
				4: "hsl(9, 58%, 70%)",
				5: "hsl(9, 38%, 57%)",
				6: "hsl(9, 33%, 44%)",
				7: "hsl(9, 33%, 34%)",
				8: "hsl(9, 33%, 23%)",
				9: "hsl(9, 34%, 12%)"
			},
			acct: {

			},
			ntrl: {
				1: "#fff",
				9: "#000"
			}
		},
		spacing: {
			"0": "0",
			"01": "0.11111em",
			"015": "0.16666em",
			"02": "0.22222em",
			"03": "0.33333em",
			"04": "0.44444em",
			"05": "0.55555em",
			"06": "0.66666em",
			"07": "0.77777em",
			"08": "0.88888em",
			"09": "0.99999em",
			"1e": "1em",
			"2e": "2em",
			"3e": "3em",
			"1px": "1px",
			"2px": "2px",
			"3px": "3px",
			"4px": "4px",
			"5px": "5px",
			"6px": "6px",
			"1r": "1rem",
			"2r": "2rem",
			"3r": "3rem",
			"4r": "4rem",
			"5r": "5rem",
			"6r": "6rem",
			"7r": "7rem",
			"8r": "8rem",
			"9r": "9rem",
			"30w": "30vw",
			"30h": "30vh",
			"100w": "100vw",
			"100h": "100vh",
			"100": "100%",
			"min": "min-content",
			"max": "max-content",
			"fit": "fit-content",
			"auto": "auto"
		},
		fontWeight: {
			100: "100",
			200: "200",
			300: "300",
			400: "400",
			500: "500",
			600: "600",
			700: "700",
			800: "800",
			900: "900",
		},
		fontFamily: {
			"base": "pixeloid",
			"deco": "doab8m",
			"mono": "Ubuntu Mono"
		},
		fontSize: {
			"inh": "inherit",
			"0": "0",
			"1r": "1rem",
			"2r": "2rem",
			"3r": "3rem",
			"4r": "4rem",
			"5r": "5rem",
			"6r": "6rem",
			"7r": "7rem",
			"8r": "8rem",
			"9r": "9rem",
			"1e": "1em",
			"2e": "2em",
			"3e": "3em"
		},
		lineHeight: {
			"inh": "inherit",
			"1r": "1rem",
			"2r": "2rem",
			"3r": "3rem",
			"4r": "4rem",
			"5r": "5rem",
			"6r": "6rem",
			"7r": "7rem",
			"8r": "8rem",
			"9r": "9rem",
			"1e": "1em",
			"2e": "2em",
			"3e": "3em"
		},
		flexBasis: {
			"content": "content"
		},
		clipPath: {
			"rebbel-01": "polygon(0 0.11111em, 0.11111em 0.11111em, 0.11111em 0, calc(100% - 0.11111em) 0, calc(100% - 0.11111em) 0.11111em, 100% 0.11111em, 100% calc(100% - 0.11111em), calc(100% - 0.11111em) calc(100% - 0.11111em), calc(100% - 0.11111em) 100%, 0.11111em 100%, 0.11111em calc(100% - 0.11111em), 0 calc(100% - 0.11111em))",
			"rebbel-015": "polygon(0 0.16666em, 0.16666em 0.16666em, 0.16666em 0, calc(100% - 0.16666em) 0, calc(100% - 0.16666em) 0.16666em, 100% 0.16666em, 100% calc(100% - 0.16666em), calc(100% - 0.16666em) calc(100% - 0.16666em), calc(100% - 0.16666em) 100%, 0.16666em 100%, 0.16666em calc(100% - 0.16666em), 0 calc(100% - 0.16666em))",
			"rebbel-r-01": "polygon(0 0, calc(100% - 0.11111em) 0, calc(100% - 0.11111em) 0.11111em, 100% 0.11111em, 100% calc(100% - 0.11111em), calc(100% - 0.11111em) calc(100% - 0.11111em), calc(100% - 0.11111em) 100%, 0 100%)",
			"rebbel-r-015": "polygon(0 0, calc(100% - 0.16666em) 0, calc(100% - 0.16666em) 0.16666em, 100% 0.16666em, 100% calc(100% - 0.16666em), calc(100% - 0.16666em) calc(100% - 0.16666em), calc(100% - 0.16666em) 100%, 0 100%)",
			"rebbel-l-01": "polygon(0.11111em 0, 0.11111em 0.11111em, 0 0.11111em, 0 calc(100% - 0.11111em), 0.11111em calc(100% - 0.11111em), 0.11111em 100%, 100% 100%, 100% 0)",
			"rebbel-l-015": "polygon(0.16666em 0, 0.16666em 0.16666em, 0 0.16666em, 0 calc(100% - 0.16666em), 0.16666em calc(100% - 0.16666em), 0.16666em 100%, 100% 100%, 100% 0)",
			"rebbel-t-01": "polygon(0 0, 100% 0, 100% calc(100% - 0.11111em), calc(100% - 0.11111em) calc(100% - 0.11111em), calc(100% - 0.11111em) 100%, 0.11111em 100%, 0.11111em calc(100% - 0.11111em), 0 calc(100% - 0.11111em))",
			"rebbel-t-015": "polygon(0 0, 100% 0, 100% calc(100% - 0.16666em), calc(100% - 0.16666em) calc(100% - 0.16666em), calc(100% - 0.16666em) 100%, 0.16666em 100%, 0.16666em calc(100% - 0.16666em), 0 calc(100% - 0.16666em))",
			"rebbel-b-01": "polygon(0 0.11111em, 0.11111em 0.11111em, 0.11111em 0, calc(100% - 0.11111em) 0, calc(100% - 0.11111em) 0.11111em, 100% 0.11111em, 100% 100%, 0 100%)",
			"rebbel-b-015": "polygon(0 0.16666em, 0.16666em 0.16666em, 0.16666em 0, calc(100% - 0.16666em) 0, calc(100% - 0.16666em) 0.16666em, 100% 0.16666em, 100% 100%, 0 100%)"
		},
		extend: {},
	},
	plugins: [
		plugin(({matchUtilities, theme}) => {

			matchUtilities({
				"clip": (value) => ({
					clipPath: value
				})
			}, {values: theme("clipPath")});
		})
	],
}

