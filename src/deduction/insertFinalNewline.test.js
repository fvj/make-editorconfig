import insertFinalNewline from './insertFinalNewline'

test('should detect final newlines', () => {
	const lines = 'hello\nhow is it going\n'.split('\n')
	expect(insertFinalNewline(lines)).toBe(true)
})

test('should detect no final newlines', () => {
	const lines = 'hello\nhow is it going'.split('\n')
	expect(insertFinalNewline(lines)).toBe(false)
})

test('should detect nothing for empty files', () => {
	const lines = ''.split('\n')
	expect(insertFinalNewline(lines)).toBe(null)
})
