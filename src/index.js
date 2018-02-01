import endOfLine from './deduction/endOfLine'
import indentSize from './deduction/indentSize'
import indentStyle from './deduction/indentStyle'
import insertFinalNewline from './deduction/insertFinalNewline'
import trimTrailingWhitespace from './deduction/trimTrailingWhitespace'
import Node from './tree/node'
import { readdirSync, statSync, readFileSync } from 'fs'
import { join } from 'path'
import { isBinary, flatten } from './deduction/util'
import match from 'minimatch'

const detect = raw => {
	const config = {}
	config['end_of_line'] = endOfLine(raw)
	const lines = raw.split('\n')
	config['indent_style'] = indentStyle(lines)
	config['indent_size'] = indentSize(lines)
	config['insert_final_newline'] = insertFinalNewline(lines)
	config['trim_trailing_whitespace'] = trimTrailingWhitespace(lines)
	return config
}

const constructTreeFromDirectory = (path, ignore = []) => {
	const walk = path => {
		const node = new Node(path, null)
		const files = readdirSync(path)
		files.forEach(file => {
			if (ignore.some(i => match(file, i))) return
			const childPath = join(path, file)
			const stats = statSync(childPath)
			if (stats.isFile(childPath)) {
				const contents = readFileSync(childPath).toString()
				if (isBinary(contents)) return
				const attributes = detect(contents)
				node.children.push(new Node(childPath, contents, [], attributes))
			} else if (stats.isDirectory(childPath))
				node.children.push(walk(childPath))
			else throw new Error('no idea how to handle file' + childPath)
		})
		return node
	}
	return walk(path)
}

const printAttributes = (tree, indent = 0, indentUnit = '  ') => {
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

const generateConfig = tree => {
	if (
		Object.keys(tree.attributes).length == 0 &&
		!tree.childrenContainInformation
	)
		return []
	const config = []
	config.push(`[${tree.filename}${tree.content === null ? '/**' : ''}]`)
	Object.keys(tree.attributes).forEach(key =>
		config.push(`${key}=${tree.attributes[key]}`)
	)
	if (tree.childrenContainInformation)
		config.push(...flatten(tree.children.map(generateConfig)))
	return config.join('\n')
}

export const generate = (dir, ignore) =>
	generateConfig(constructTreeFromDirectory(dir, ignore).mergeAttributes(true))
