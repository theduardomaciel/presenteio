/** @type {import('tailwindcss').Config} */

const plugin = require("tailwindcss/plugin");

module.exports = {
	content: [
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
	],
	darkMode: "class",
	theme: {
		extend: {
			colors: {
				"primary-01": "var(--primary-01)",
				"primary-02": "var(--primary-02)",
				"primary-03": "var(--primary-03)",

				"font-dark": "var(--font-dark)",
				"font-light": "var(--font-light)",
				"font-light-02": "var(--font-light-02)",

				neutral: "var(--neutral)",
				"light-gray": "var(--light-gray)",

				"background-01": "var(--background-01)",
				"background-02": "var(--background-02)",
				"background-modal": "var(--background-modal)",
			},
			padding: {
				wrapper: "var(--wrapper)",
			},
			fontFamily: {
				sans: ["var(--font-inter)"],
				serif: ["var(--font-judson)"],
				title: ["var(--font-gelasio)"],
			},
			animation: {
				fadeIn: "fadeIn 0.5s ease-in-out",
				fadeOut: "fadeOut 0.5s ease-in-out",
			},
			keyframes: {
				fadeIn: {
					"0%": { opacity: 0 },
					"100%": { opacity: 1 },
				},
				fadeOut: {
					"0%": { opacity: 1 },
					"100%": { opacity: 0 },
				},
			},
		},
	},
	plugins: [
		require("tailwindcss-animate"),
		require("tailwindcss-base-font-size")({
			baseFontSize: 10,
		}),
	],
};
