// filepath: tailwind.config.js
module.exports = {
	content: [
		'./index.html',
		'./node_modules/flowbite-react/**/*.js',
		'./node_modules/flowbite/**/*.js',
		'./src/**/*.{js,ts,jsx,tsx}',
		'./src/**/*.html',
	],
	plugins: [require('flowbite/plugin')],
};
