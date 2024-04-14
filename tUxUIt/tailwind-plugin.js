"use strict";

import plugin from "tailwindcss/plugin";

const formClip = obj => {
	return obj.map(value => {value});
};

export default plugin(({matchUtilities, theme}) => {

	matchUtilities({
		"clip": value => ({
			clipPath: value
		})
	}, {values: theme("clipPath")});

	matchUtilities({
		"self": value => ({
			placeSelf: value
		}, {values: theme("placeSelf")})
	});
}, {
	theme: {
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
		}
	}
})