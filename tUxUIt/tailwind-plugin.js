"use strict";

import plugin from "tailwindcss/plugin";
import flattenColorPalette from "tailwindcss/lib/util/flattenColorPalette";

const pushClip = (path, x, y, overlay) => {

	return path;
};

export default plugin(({addUtilities, matchUtilities, addVariant, matchComponents, addComponents, theme, remove}) => {

	matchUtilities({
		"clip": value => ({
			clipPath: value
		})
	}, {
		values: flattenColorPalette(theme("clipPath")),
		supportsNegativeValues: false
	});


	// addVariant("disabled", "&[disabled]");


	matchUtilities({
		"prism-x": value => ({
			"--tuxit-prism-shift-x": value
		}),

		"prism-y": value => ({
			"--tuxit-prism-shift-y": value
		})
	}, {
		values: theme("spacing"),
		supportsNegativeValues: true
	});


	matchUtilities({
		"prism": value => ({
			clipPath: value
		})
	}, {
		values: pushClip(theme("clipPath")),
		supportsNegativeValues: false
	});


	matchUtilities({
		"drop": value => ({
			"--tw-drop-shadow": value ? "drop-shadow(" + value + " var(--tuxit-drop-shadow-color))" : "",
			filter: "var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)"
		})
	}, {
		values: theme("drop"),
		type: "shadow"
	});

	matchUtilities({
		"drop": value => ({
			"--tuxit-drop-shadow-color": value
		})
	}, {
		values: flattenColorPalette(theme("colors")),
		type: "color"
	});
}, {
	theme: {
		clipPath: {
			"none": "none",
			"rabbet": {
				"01": "polygon(0 0.11111em, 0.11111em 0.11111em, 0.11111em 0, calc(100% - 0.11111em) 0, calc(100% - 0.11111em) 0.11111em, 100% 0.11111em, 100% calc(100% - 0.11111em), calc(100% - 0.11111em) calc(100% - 0.11111em), calc(100% - 0.11111em) 100%, 0.11111em 100%, 0.11111em calc(100% - 0.11111em), 0 calc(100% - 0.11111em))",
				"015": "polygon(0 0.16666em, 0.16666em 0.16666em, 0.16666em 0, calc(100% - 0.16666em) 0, calc(100% - 0.16666em) 0.16666em, 100% 0.16666em, 100% calc(100% - 0.16666em), calc(100% - 0.16666em) calc(100% - 0.16666em), calc(100% - 0.16666em) 100%, 0.16666em 100%, 0.16666em calc(100% - 0.16666em), 0 calc(100% - 0.16666em))",
				"r-01": "polygon(0 0, calc(100% - 0.11111em) 0, calc(100% - 0.11111em) 0.11111em, 100% 0.11111em, 100% calc(100% - 0.11111em), calc(100% - 0.11111em) calc(100% - 0.11111em), calc(100% - 0.11111em) 100%, 0 100%)",
				"r-015": "polygon(0 0, calc(100% - 0.16666em) 0, calc(100% - 0.16666em) 0.16666em, 100% 0.16666em, 100% calc(100% - 0.16666em), calc(100% - 0.16666em) calc(100% - 0.16666em), calc(100% - 0.16666em) 100%, 0 100%)",
				"l-01": "polygon(0.11111em 0, 0.11111em 0.11111em, 0 0.11111em, 0 calc(100% - 0.11111em), 0.11111em calc(100% - 0.11111em), 0.11111em 100%, 100% 100%, 100% 0)",
				"l-015": "polygon(0.16666em 0, 0.16666em 0.16666em, 0 0.16666em, 0 calc(100% - 0.16666em), 0.16666em calc(100% - 0.16666em), 0.16666em 100%, 100% 100%, 100% 0)",
				"t-01": "polygon(0 0, 100% 0, 100% calc(100% - 0.11111em), calc(100% - 0.11111em) calc(100% - 0.11111em), calc(100% - 0.11111em) 100%, 0.11111em 100%, 0.11111em calc(100% - 0.11111em), 0 calc(100% - 0.11111em))",
				"t-015": "polygon(0 0, 100% 0, 100% calc(100% - 0.16666em), calc(100% - 0.16666em) calc(100% - 0.16666em), calc(100% - 0.16666em) 100%, 0.16666em 100%, 0.16666em calc(100% - 0.16666em), 0 calc(100% - 0.16666em))",
				"b-01": "polygon(0 0.11111em, 0.11111em 0.11111em, 0.11111em 0, calc(100% - 0.11111em) 0, calc(100% - 0.11111em) 0.11111em, 100% 0.11111em, 100% 100%, 0 100%)",
				"b-015": "polygon(0 0.16666em, 0.16666em 0.16666em, 0.16666em 0, calc(100% - 0.16666em) 0, calc(100% - 0.16666em) 0.16666em, 100% 0.16666em, 100% 100%, 0 100%)",
			},
			"rabbet-prism": {
				"01": "polygon(0 0.11111em, 0.11111em 0.11111em, 0.11111em 0, calc(100% - 0.11111em - 1rem) 0, 100% calc(0.11111em + 1rem), 100% calc(100% - 0.11111em), calc(100% - 0.11111em) calc(100% - 0.11111em), calc(100% - 0.11111em) 100%, calc(0.11111em + 1rem) 100%, 0 calc(100% - 0.11111em - 1rem))",
				"015": "polygon(0 0.16666em, 0.16666em 0.16666em, 0.16666em 0, calc(100% - 0.16666em - 1rem) 0, 100% calc(0.16666em + 1rem), 100% calc(100% - 0.16666em), calc(100% - 0.16666em) calc(100% - 0.16666em), calc(100% - 0.16666em) 100%, calc(0.16666em + 1rem) 100%, 0 calc(100% - 0.16666em - 1rem))"
			}
		},

		drop: {
			"none": ""
		},

		components: {
			"Rabbet-Box": ["rabbet"]
		},

		extend: {
			zIndex: {
				1: "1",
				2: "2",
				3: "3",
				4: "4",
				5: "5",
				6: "6",
				7: "7",
				8: "8",
				9: "9",
			}
		}
	}
})