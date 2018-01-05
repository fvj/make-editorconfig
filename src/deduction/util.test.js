import * as util from './util'

describe('getIndentation', () => {
	test('get space indentation correctly', () => {
		const line = '    hello world'
		expect(util.getIndentation(line)).toBe('    ')
	})

	test('get tab indentation correctly', () => {
		const line = '\t\thello world'
		expect(util.getIndentation(line, false)).toBe('\t\t')
	})

	test('default to no indentation', () => {
		const line = ''
		expect(util.getIndentation(line, false)).toBe('')
	})
})

describe('cmpArr', () => {
	test('compare equal arrays correctly', () => {
		const arr1 = ['a', 'b', 'c']
		const arr2 = ['a', 'b', 'c']
		expect(util.cmpArr(arr1, arr2)).toBe(true)
	})

	test('compare subsets correctly', () => {
		const arr1 = ['a', 'b', 'c']
		const arr2 = ['a', 'b']
		expect(util.cmpArr(arr1, arr2)).toBe(false)
	})

	test('compare different arrays correctly', () => {
		const arr1 = ['d', 'b', 'c']
		const arr2 = ['a', 'b', 'c']
		expect(util.cmpArr(arr1, arr2)).toBe(false)
	})

	test('respect the order of items', () => {
		const arr1 = ['a', 'c', 'b']
		const arr2 = ['a', 'b', 'c']
		expect(util.cmpArr(arr1, arr2)).toBe(false)
	})
})

describe('count', () => {
	test('counts occurences of characters correctly', () => {
		const haystack = 'aaaaaa'.split('')
		const needle = 'a'
		expect(util.count(haystack, needle)).toBe(6)
	})

	test('counts occurences of characters correctly when interrupted', () => {
		const haystack = 'aabbaa'.split('')
		const needle = 'a'
		expect(util.count(haystack, needle)).toBe(4)
	})

	test('counts occurences of longer strings correctly', () => {
		const haystack = 'aaaaaa'.split('')
		const needle = 'aa'
		expect(util.count(haystack, needle)).toBe(3)
	})

	test('counts occurences of longer strings correctly when interrupted', () => {
		const haystack = 'aabbaa'.split('')
		const needle = 'aa'
		expect(util.count(haystack, needle)).toBe(2)
	})
})

describe('maxInObject', () => {
	test('gives the max key in a monotonic series', () => {
		const object = {
			a: 1,
			b: 2,
			c: 3,
		}
		expect(util.maxInObject(object)).toBe('c')
	})

	test('gives the first max key', () => {
		const object = {
			a: 0,
			b: 1,
			c: 1,
		}
		expect(util.maxInObject(object)).toBe('b')
	})
})
