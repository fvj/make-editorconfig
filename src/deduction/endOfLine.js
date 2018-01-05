import { maxInObject, count as countOccurrences } from './util'

export default raw => {
	const characters = raw.split('')
	const count = {
		crlf: countOccurrences(characters, '\r\n'),
	}
	count['lf'] = countOccurrences(characters, '\n') - count.crlf
	count['cr'] = countOccurrences(characters, '\r') - count.crlf

	return maxInObject(count)
}
