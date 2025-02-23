/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				'mint': 'hsl(164, 61%, 65%)',
				'mint-up': 'hsl(148, 35%, 74%)',
				'mint-down': 'hsl(163, 36%, 51%)',
				'lilac': 'hsl(264, 51%, 71%)',
				'sea': 'hsl(189, 58%, 65%)',
				'highlight': 'hsl(264, 51%, 71%)',
				'lilac-up': 'hsl(240, 33%, 77%)',
				'sherbet': 'hsl(55, 97%, 85%)',
				'sherbet-fade': 'hsl(55, 100%, 94%)',
				'rose': 'hsl(344, 56%, 69%)',
				'marshmellow': 'hsl(329, 44%, 71%)',
				'peach': 'hsl(4, 65%, 85%)',
				'biscuit': 'hsl(26, 18%, 61%)',
				'oat': 'hsl(17, 12%, 77%)',
				'gritty': 'hsl(12, 87%, 43%)',
			},
		},
	},
	plugins: [
		require('@tailwindcss/typography'),
	],
	darkMode: 'class',
}
