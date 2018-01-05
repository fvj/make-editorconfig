import { getIndentation } from './util'

export default lines => {
	const spaces = lines
		.map(getIndentation)
		.filter(line => line.startsWith(' '))
		.map(s => s.length)

	if (spaces.length > 0) return 'space'
	return lines.length > 1 ? 'tab' : null
}
