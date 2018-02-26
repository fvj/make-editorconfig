import { getIndentation } from './util'

export default lines => {
	const tabs = lines
		.map(line => getIndentation(line, false))
		.filter(line => line !== '').length
	const spaces = lines
		.map(line => getIndentation(line))
		.filter(line => line !== '').length

	if ((tabs === 0 && spaces === 0) || lines.length === 0 || tabs === spaces)
		return null
	return tabs > 0 ? 'tab' : 'space'
}
