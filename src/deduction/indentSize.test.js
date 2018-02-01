import indentSize from './indentSize'

test('detects size', () => {
	const lines = '    hello world\n  something else'.split('\n')
	expect(indentSize(lines)).toBe(2)
})

test('should use the gcd', () => {
	const lines = '    hello world\n        test'.split('\n')
	expect(indentSize(lines)).toBe(4)
})

test('should not attempt to detect tab', () => {
	const lines = '\t\thello world\n\tsomething else'.split('\n')
	expect(indentSize(lines)).toBe(null)
})

test('should not allow sizes of 1', () => {
	const lines = ' hello world\n test'.split('\n')
	expect(indentSize(lines)).toBe(null)
})
