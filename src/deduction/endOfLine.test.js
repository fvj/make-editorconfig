import endOfLine from './endOfLine'

test('detects LF lineendings', () => {
	const raw = 'hello\nworld\n'
	expect(endOfLine(raw)).toBe('lf')
})

test('detects CR lineendings', () => {
	const raw = 'hello\rworld\r'
	expect(endOfLine(raw)).toBe('cr')
})

test('detects CRLF lineendings', () => {
	const raw = 'hello\r\nworld\r\n'
	expect(endOfLine(raw)).toBe('crlf')
})

test('should default to LF', () => {
	const raw = 'hello'
	expect(endOfLine(raw)).toBe('lf')
})
