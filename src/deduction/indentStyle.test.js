import indentStyle from './indentStyle'

test('should detect spaces', () => {
	const lines = '  hello\n  world'.split('\n')
	expect(indentStyle(lines)).toBe('space')
})

test('should detect tabs', () => {
	const lines = '\t\thello\n\tworld'.split('\n')
	expect(indentStyle(lines)).toBe('tab')
})

test('should default to spaces', () => {
	const lines = '\t\thello\n  world'.split('\n')
	expect(indentStyle(lines)).toBe('space')
})

test('should not return anything for empty input', () => {
	const lines = ''.split('\n')
	expect(indentStyle(lines)).toBe(null)
})
