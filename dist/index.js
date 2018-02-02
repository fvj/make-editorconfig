'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var greatestCommonDivisor = _interopDefault(require('compute-gcd'));
var match = _interopDefault(require('minimatch'));

const getIndentation = (line, spaces = true) =>
	((spaces ? /^\  +/g : /^\t+/g)[Symbol.match](line) || [''])[0];

const maxInObject = obj => {
	const keys = Object.keys(obj);
	let maxKey = keys[0];
	let maxValue = obj[maxKey];

	for (let i = 0; i < keys.length; i++)
		if (obj[keys[i]] > maxValue) {
			maxValue = obj[keys[i]];
			maxKey = keys[i];
		}

	return maxKey
};

const cmpArr = (arr1, arr2) => {
	for (let i = 0; i < arr1.length && i < arr2.length; i++)
		if (arr1[i] != arr2[i]) return false
	return arr1.length == arr2.length
};

const count = (arr, str) => {
	const len = str.length;
	const strSlice = str.split('');
	let count = 0;
	for (let i = 0; i < arr.length - len + 1; i += len) {
		if (cmpArr(arr.slice(i, i + len), strSlice)) count++;
	}
	return count
};





// doesn't work for UTF-16
const isBinary = content => content && content.indexOf('\0') > -1;



const flatten = arr =>
	arr.reduce(
		(arr, val) => arr.concat(Array.isArray(val) ? flatten(val) : val),
		[]
	);

var indentSize = lines => {
	const useSpaces = lines.some(line => line.startsWith('  '));
	if (!useSpaces) return null
	const gcd = greatestCommonDivisor(
		lines.map(line => getIndentation(line, useSpaces)).map(line => line.length)
	);
	return gcd == 1 ? null : gcd
}

var indentStyle = lines => {
	const tabs = lines
		.map(line => getIndentation(line, false))
		.filter(line => line !== '').length;
	const spaces = lines.map(getIndentation).filter(line => line !== '').length;

	if ((tabs === 0 && spaces === 0) || lines.length === 0 || tabs === spaces)
		return null
	return tabs > 0 ? 'tab' : 'space'
}

// make sure we have lines and if there's only one, make sure it's not empty
var insertFinalNewline = lines =>
	lines.length > 0 && (lines.length > 1 || lines[0].length > 0)
		? lines.slice(-1)[0] == ''
		: null

var trimTrailingWhitespace = lines =>
	lines.length > 0 && (lines.length > 1 || lines[0].length > 0)
		? !lines.some(line => line.endsWith(' '))
		: null

var endOfLine = raw => {
	const characters = raw.split('');
	const count$$1 = {
		crlf: count(characters, '\r\n'),
	};
	count$$1['lf'] = count(characters, '\n') - count$$1.crlf;
	count$$1['cr'] = count(characters, '\r') - count$$1.crlf;

	if (count$$1['lf'] === 0 && count$$1['cr'] === 0) return 'lf'
	return maxInObject(count$$1)
}

const ATTRIBUTES = [
	'indent_style',
	'indent_size',
	'end_of_line',
	'trim_trailing_whitespace',
	'insert_final_newline',
];

class Node {
	constructor(filename, content, children = [], attributes = {}) {
		this.filename = filename;
		this.content = content;
		this.children = children;
		this.attributes = attributes;
		// only branches can hold information in its children
		this.childrenContainInformation = content == null;
	}

	mergeAttributes(purge = false) {
		if (this.children.length === 0) return
		this.childrenContainInformation = false;
		this.children.forEach(child => child.mergeAttributes());
		// todo: this iterates over the children a constant amount, yet
		// still too often; we'd probably need only a single pass
		ATTRIBUTES.forEach(attribute => {
			if (
				this.children.every(child => child.attributes[attribute] === undefined)
			)
				return
			const val = (
				this.children.find(child => child.attributes[attribute] != null) || {
					attributes: { [attribute]: null },
				}
			).attributes[attribute];
			const consensus = this.children.every(
				child =>
					child.attributes[attribute] === null ||
					child.attributes[attribute] === val
			);
			if (!consensus) {
				// console.info(`did not reach consensus for node ${this.filename} on attribute ${attribute}`)
				this.childrenContainInformation = true;
				return
			}
			// console.info(`consensus for ${this.filename} on ${attribute} is ${val}`)
			this.attributes[attribute] = val;
			this.children.forEach(child => delete child.attributes[attribute]);
		});
		if (purge)
			Object.keys(this.attributes).forEach(key => {
				if (this.attributes[key] === null) delete this.attributes[key];
			});
		return this
	}
}

/**
 * Generates the attributes of the given contents.
 * @param {string} raw - the contents
 * @returns {object} a populated field of attributes
 */
const detect = raw => {
	const config = {};
	config['end_of_line'] = endOfLine(raw);
	const lines = raw.split(
		{ cr: '\r', lf: '\n', crlf: '\r\n' }[config['end_of_line']]
	);
	config['indent_style'] = indentStyle(lines);
	config['indent_size'] = indentSize(lines);
	config['insert_final_newline'] = insertFinalNewline(lines);
	config['trim_trailing_whitespace'] = trimTrailingWhitespace(lines);
	return config
};

/**
 * Constructs a tree structure given paths and their contents.
 * @param {Array} objs - array of objects with a `path` and `content` field
 * @param {Array} ignore - array of globs; matching paths will be ignored
 * @returns {Node} the root of the tree constructed
 */
const constructTree = (objs, ignore = []) => {
	const buckets = new Map();
	objs.forEach(obj => {
		if (ignore.some(i => match(obj.path, i))) return
		const key =
			obj.path.split('/').length - 1 - (obj.path.endsWith('/') ? 1 : 0);
		if (buckets.has(key)) buckets.get(key).push(obj);
		else buckets.set(key, [obj]);
	});
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
				);
				n.children = helper(n, level + 1);
				return n
			});
		return nodes
	};
	const root = new Node('*', null);
	root.children = helper(root, 0);
	root.isRoot = true;
	return root
};

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
		const res = [];
		for (let i = 0; i < indent; i++) res.push(indentUnit);
		return res.join('')
	})();
	console.log(indentation + '* ' + tree.filename);
	Object.keys(tree.attributes).forEach(key =>
		console.log(indentation + indentUnit + key + '=' + tree.attributes[key])
	);
	tree.children.forEach(child => printAttributes(child, indent + 1));
};

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
	const config = [];
	if (tree.isRoot) config.push('root = true', '');
	if (Object.keys(tree.attributes).length > 0)
		if (tree.isRoot) config.push('[*]');
		else config.push(`[${tree.filename}${tree.content === null ? '/**' : ''}]`);

	Object.keys(tree.attributes).forEach(key =>
		config.push(`${key} = ${tree.attributes[key]}`)
	);

	config.push('');

	if (tree.childrenContainInformation)
		config.push(...flatten(tree.children.map(generateConfig)));

	return config.join('\n')
};

/**
 * Generates an editorconfig from file objects
 * @param {array} objs - array of objects with `path` and `content` fields
 * @param {array} ignore - array of globs; matching paths will be ignored
 * @returns {string} the editorconfig
 */
const generate = (objs, ignore) =>
	generateConfig(constructTree(objs, ignore).mergeAttributes(true));

exports.generate = generate;
exports.generateConfig = generateConfig;
exports.printAttributes = printAttributes;
exports.constructTree = constructTree;
exports.detect = detect;
