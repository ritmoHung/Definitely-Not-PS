/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");

const gridAreaAuto = {
	gridArea: "auto",
};
const gridAreaStack = {
	gridArea: "stack",
};

module.exports = {
	content: [
        "./**/*.html",
        "./**/*.js",
    ],
	theme: {
		screens: {
			xs: "360px",
			sm: "576px",
			md: "768px",
			lg: "992px",
			xl: "1200px",
			"2xl": "1400px",
		},
		extend: {
			screens: {
				// Logic opposite to widths
				petite: { raw: "(max-height: 576px)" },
				compact: { raw: "(max-height: 768px)" },
			},
            borderWidth: {
                "1": "1px",
            },
            spacing: {
				"ch": "1ch",
            },
			transitionTimingFunction: {
				"in-quint": "cubic-bezier(0.755, 0.050, 0.855, 0.060)",
				"out-quint": "cubic-bezier(0.230, 1.000, 0.320, 1.000)",
			},
			zIndex: {
				1: "1",
				2: "2",
			},
		},
	},
	plugins: [
		plugin(function ({ addComponents }) {
			const components = {
				".grid-stack-none": {
					gridTemplateAreas: "none",
					"& > *": { ...gridAreaAuto },
				},
				".grid-stack": {
					gridTemplateAreas: '"stack"',
					"& > *": { ...gridAreaStack },
				},
				".grid-area-auto": { ...gridAreaAuto },
				".grid-area-stack": { ...gridAreaStack },
			};
			addComponents(components);
		}),
	],
};
