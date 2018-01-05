import trimTrailingWhitespace from './trimTrailingWhitespace'

test('detect trailing whitespace', () => {
	const lines = 'hello  \nsomething. '.split('\n')
	expect(trimTrailingWhitespace(lines)).toBe(false)
})

test('detect no trailing whitespace', () => {
	const lines = 'hello\nsomething.'.split('\n')
	expect(trimTrailingWhitespace(lines)).toBe(true)
})

test("not default in case we can't know", () => {
	const lines = ''.split('\n')
	expect(trimTrailingWhitespace(lines)).toBe(null)
})
