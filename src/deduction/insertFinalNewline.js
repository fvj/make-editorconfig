// make sure we have lines and if there's only one, make sure it's not empty
export default lines =>
	lines.length > 0 && (lines.length > 1 || lines[0].length > 0)
		? lines.slice(-1)[0] == ''
		: null
