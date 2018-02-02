import { maxInObject, count as countOccurrences } from './util'

export default raw => {
	const characters = raw.split('')
	const count = {
		crlf: countOccurrences(characters, '\r\n'),
	}
	count['lf'] = countOccurrences(characters, '\n') - count.crlf
	count['cr'] = countOccurrences(characters, '\r') - count.crlf

	if (count['lf'] === 0 && count['cr'] === 0) return 'lf'
	return maxInObject(count)
}
