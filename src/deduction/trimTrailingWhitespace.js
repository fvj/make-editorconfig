export default lines =>
	lines.length > 0 && (lines.length > 1 || lines[0].length > 0)
		? !lines.some(line => line.endsWith(' '))
		: null
