import {
	endOfLine,
	indentSize,
	indentStyle,
	insertFinalNewline,
	trimTrailingWhitespace,
} from './deduction/index'
import Node from './tree/node'
import { isBinary, flatten } from './deduction/util'
import match from 'minimatch'

export const detect = raw => {
	const config = {}
	config['end_of_line'] = endOfLine(raw)
	const lines = raw.split(
		{ cr: '\r', lf: '\n', crlf: '\r\n' }[config['end_of_line']]
	)
	config['indent_style'] = indentStyle(lines)
	config['indent_size'] = indentSize(lines)
	config['insert_final_newline'] = insertFinalNewline(lines)
	config['trim_trailing_whitespace'] = trimTrailingWhitespace(lines)
	return config
}

	}
	const tree = walk(path)
	tree.isRoot = true
	return tree
}

export const printAttributes = (tree, indent = 0, indentUnit = '  ') => {
	if (
		Object.keys(tree.attributes).length == 0 &&
		!tree.childrenContainInformation
	)
		return
	const indentation = (() => {
		const res = []
		for (let i = 0; i < indent; i++) res.push(indentUnit)
		return res.join('')
	})()
	console.log(indentation + '* ' + tree.filename)
	Object.keys(tree.attributes).forEach(key =>
		console.log(indentation + indentUnit + key + '=' + tree.attributes[key])
	)
	tree.children.forEach(child => printAttributes(child, indent + 1))
}

export const generateConfig = tree => {
	if (
		Object.keys(tree.attributes).length == 0 &&
		!tree.childrenContainInformation
	)
		return []
	const config = []
	if (tree.isRoot) config.push('root = true', '')
	if (Object.keys(tree.attributes).length > 0)
		if (tree.isRoot) config.push('[*]')
		else config.push(`[${tree.filename}${tree.content === null ? '/**' : ''}]`)

	Object.keys(tree.attributes).forEach(key =>
		config.push(`${key}=${tree.attributes[key]}`)
	)
	if (tree.childrenContainInformation)
		config.push(...flatten(tree.children.map(generateConfig)))

	return config.join('\n')
}

