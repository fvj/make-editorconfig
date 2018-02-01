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

describe('range', () => {
	test('defaults to incrementing range with maximum value ', () => {
		expect(util.range(10)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
	})

	test('fills the range', () => {
		expect(util.range(10, 0)).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
	})

	test('starts at the specified value', () => {
		expect(util.range(10, null, 20)).toEqual([
			10,
			11,
			12,
			13,
			14,
			15,
			16,
			17,
			18,
			19,
		])
	})
})

describe('asciiOccurrences', () => {
	test('counts occurrences', () => {
		const test = util
			.range(256)
			.map(i => String.fromCharCode(i))
			.join('')
		expect(util.asciiOccurrences(test)).toEqual(util.range(256, 1))
	})

	test('handles empty input', () => {
		const test = ''
		expect(util.asciiOccurrences(test)).toEqual(util.range(256, 0))
	})

	// TODO: maybe test some randomly constructed string
})

describe('entropy', () => {
	test('calculates the maximum entropy', () => {
		expect(
			util.entropy(
				util
					.range(256)
					.map(i => String.fromCharCode(i))
					.join('')
			)
		).toBe(1)
	})

	test('defaults to zero entropy', () => {
		expect(util.entropy('')).toBe(0)
	})
})

describe('flatten', () => {
	test('should handle empty arrays', () => {
		const arr = [];
		expect(util.flatten(arr)).toEqual([])
	})
	
	test('should leave flat arrays alone', () => {
		const arr = [1,2,3,4];
		expect(util.flatten(arr)).toEqual([1,2,3,4])
	})

	test('should flatten simple nested arrays', () => {
		const arr = [1,[2,3],4]
		expect(util.flatten(arr)).toEqual([1,2,3,4]);
	})

	test('should flatten deeply nested arrays', () => {
		const arr = [1,[2,[3,[4]],[5],6,[[7]]]]
		expect(util.flatten(arr)).toEqual([1,2,3,4,5,6,7])
	})
})
