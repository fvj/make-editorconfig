import { getIndentation } from './util'
import greatestCommonDivisor from 'compute-gcd'

export default lines => {
	const useSpaces = lines.some(line => line.startsWith(' '))
	if (!useSpaces) return null
	const gcd = greatestCommonDivisor(
		lines.map(line => getIndentation(line, useSpaces)).map(line => line.length)
	)
	return gcd == 1 ? null : gcd
}
