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

/**
 * Generates the attributes of the given contents.
 * @param {string} raw - the contents
 * @returns {object} a populated field of attributes
 */
const detect = raw => {
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

/**
 * Constructs a tree structure given paths and their contents.
 * @param {Array} objs - array of objects with a `path` and `content` field
 * @param {Array} ignore - array of globs; matching paths will be ignored
 * @returns {Node} the root of the tree constructed
 */
const constructTree = (objs, ignore = []) => {
	const buckets = new Map()
	objs.forEach(obj => {
		if (ignore.some(i => match(obj.path, i))) return
		const key =
			obj.path.split('/').length - 1 - (obj.path.endsWith('/') ? 1 : 0)
		if (buckets.has(key)) buckets.get(key).push(obj)
		else buckets.set(key, [obj])
	})
	const helper = (parent, level) => {
		if (!buckets.has(level)) return []
		const nodes = buckets
			.get(level)
			.filter(
				obj =>
					(parent.filename === '*'
						? true
						: obj.path.startsWith(parent.filename)) && !isBinary(obj.content) // fixme: make sure we only append to directories
			)
			.map(node => {
				const n = new Node(
					node.path,
					node.content,
					[],
					node.content ? detect(node.content) : undefined
				)
				n.children = helper(n, level + 1)
				return n
			})
		return nodes
	}
	const root = new Node('*', null)
	root.children = helper(root, 0)
	root.isRoot = true
	return root
}

/**
 * Prints a representation of a tree recursively.
 * @param {Node} tree - the tree to recursively print
 * @param {Number} indent - the indent level to be applied
 * @param {string} indentUnit - one unit of indentation, defaults to a two spaces
 */
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
	console.log(indentation + '- ' + tree.filename)
	Object.keys(tree.attributes).forEach(key =>
		console.log(indentation + indentUnit + key + '=' + tree.attributes[key])
	)
	tree.children.forEach(child => printAttributes(child, indent + 1))
}

/**
 * Generates a editorconfig config for a given tree, recursively
 * @param {Node} tree - the tree to generate a config for
 * @returns {string} the editorconfig
 */
const generateConfig = tree => {
	if (
		Object.keys(tree.attributes).length == 0 &&
		!tree.childrenContainInformation
	)
		return []
	const config = []
	if (tree.isRoot) config.push('root = true', '')
	if (Object.keys(tree.attributes).length > 0) {
		if (tree.isRoot) config.push('[*]')
		else config.push(`[${tree.filename}${tree.content === null ? '/**' : ''}]`)
	}

	Object.keys(tree.attributes).forEach(key =>
		config.push(`${key} = ${tree.attributes[key]}`)
	)

	config.push('')

	if (tree.childrenContainInformation)
		config.push(...flatten(tree.children.map(generateConfig)))

	return config.join('\n')
}

/**
 * Generates an editorconfig from file objects
 * @param {array} objs - array of objects with `path` and `content` fields
 * @param {array} ignore - array of globs; matching paths will be ignored
 * @returns {string} the editorconfig
 */
const generate = (objs, ignore) =>
	generateConfig(
		constructTree(objs, ignore)
			.mergeAttributes(true)
			.clean()
	)

export { generate, generateConfig, printAttributes, constructTree, detect }
