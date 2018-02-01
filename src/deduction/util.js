export const getIndentation = (line, spaces = true) =>
	((spaces ? /^\  +/g : /^\t+/g)[Symbol.match](line) || [''])[0];

export const maxInObject = obj => {
	const keys = Object.keys(obj)
	let maxKey = keys[0]
	let maxValue = obj[maxKey]

	for (let i = 0; i < keys.length; i++)
		if (obj[keys[i]] > maxValue) {
			maxValue = obj[keys[i]]
			maxKey = keys[i]
		}

	return maxKey
}

export const cmpArr = (arr1, arr2) => {
	for (let i = 0; i < arr1.length && i < arr2.length; i++)
		if (arr1[i] != arr2[i]) return false
	return arr1.length == arr2.length
}

export const count = (arr, str) => {
	const len = str.length
	const strSlice = str.split('')
	let count = 0
	for (let i = 0; i < arr.length - len + 1; i += len) {
		if (cmpArr(arr.slice(i, i + len), strSlice)) count++
	}
	return count
}
