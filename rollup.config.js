const pkg = require('./package.json')

export default {
	input: 'src/index.js',
	external: ['compute-gcd', 'minimatch'],
	output: [
		{
			file: `dist/${pkg.name}.amd.js`,
			format: 'amd',
		},
		{
			file: `dist/${pkg.name}.cjs.js`,
			format: 'cjs',
		},
		{
			file: `dist/${pkg.name}.es.js`,
			format: 'es',
		},
		{
			file: `dist/${pkg.name}.iife.js`,
			name: 'MakeEditorconfig',
			format: 'iife',
			globals: {
				'compute-gcd': 'greatestCommonDivisor',
				minimatch: 'match',
			},
		},
		{
			file: `dist/${pkg.name}.umd.js`,
			name: 'MakeEditorconfig',
			format: 'umd',
			globals: {
				'compute-gcd': 'greatestCommonDivisor',
				minimatch: 'match',
			},
		},
	],
}
