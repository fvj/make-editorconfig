'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var commonGreatestDivisor = _interopDefault(require('compute-gcd'));
var fs = require('fs');
var path = require('path');

const getIndentation = (line, spaces = true) =>
	((spaces ? /^\ +/g : /^\t+/g)[Symbol.match](line) || [""])[0];

const maxAtObject = obj => {
	const keys = Object.keys(obj);
	let maxKey = keys[0];
	let maxValue = obj[maxKey];

	for (let i = 0; i < keys.length; i++)
		if (obj[keys[i]] > maxValue) {
			maxValue = obj[keys[i]];
			maxKey = keys[i];
		}

	return maxKey;
};

const count = (arr, val) =>
	arr.reduce((acc, arrVal) => (arrVal === val ? acc + 1 : acc), 0);

var endOfLine = raw => {
	const characters = raw.split("");
	const count$$1 = {
		crlf: count(characters, "\r\n")
	};
	count$$1["lf"] = count(characters, "\n") - count$$1.crlf;
	count$$1["cr"] = count(characters, "\r") - count$$1.crlf;

	return maxAtObject(count$$1);
};

var indentSize = lines => {
	const useSpaces = lines.some(line => line.startsWith(" "));
	return commonGreatestDivisor(
		lines.map(line => getIndentation(line, useSpaces)).map(line => line.length)
	);
};

var indentStyle = lines => {
	const spaces = lines
		.map(getIndentation)
		.filter(line => line.startsWith(" "))
		.map(s => s.length);

	if (spaces.length > 0) return "space";
	return lines.length > 1 ? "tab" : undefined;
};

var insertFinalNewline = lines => lines.slice(-1)[0] == ''

var trimTrailingWhitespace = lines => !lines.some(line => line.endsWith(" "));

const ATTRIBUTES = [
	"indent_style",
	"indent_size",
	"end_of_line",
	"trim_trailing_whitespace",
	"insert_final_newline"
];

class Node {
	constructor(filename, content, children = [], attributes = {}) {
		this.filename = filename;
		this.content = content;
		this.children = children;
		this.attributes = attributes;
		this.treeHoldsAttributes = true; // there's children with attributes
	}

	mergeAttributes() {
		this.treeHoldsAttributes = false;
		if (this.children.length === 0) return;
		this.children.forEach(child => child.mergeAttributes());
		// todo: this iterates over the children a constant amount, yet
		// still too often; we'd probably need only a single pass
		ATTRIBUTES.forEach(attribute => {
			const val = this.children[0].attributes[attribute];
			const consensus = this.children.every(
				child => (child.attributes[attribute] = val)
			);
			if (!consensus) { this.treeHoldsAttributes = true; return; }
			this.attributes[attribute] = val;
			this.children.forEach(child => delete child.attributes[attribute]);
		});
	}
}

const detect = raw => {
	const config = {};
	config["end_of_line"] = endOfLine(raw);
	const lines = raw.split("\n");
	config["indent_style"] = indentStyle(lines);
	config["indent_size"] = indentSize(lines);
	config["insert_final_newline"] = insertFinalNewline(lines);
	config["trim_trailing_whitespace"] = trimTrailingWhitespace(lines);
	return config;
};

const constructTreeFromDirectory = path$$1 => {
	const walk = path$$1 => {
		const node = new Node(path$$1, null);
		const files = fs.readdirSync(path$$1);
		files.forEach(file => {
			const childPath = path.join(path$$1, file);
			const stats = fs.statSync(childPath);
			if (stats.isFile(childPath)) {
				const contents = fs.readFileSync(childPath).toString();
				const attributes = detect(contents);
				node.children.push(new Node(childPath, contents, [], attributes));
			}
			else if (stats.isDirectory(childPath))
				node.children.push(walk(childPath));
			else throw new Error("no idea how to handle file" + childPath);
		});
		return node;
	};
	return walk(path$$1);
};

const tree = constructTreeFromDirectory(process.argv[2]);
console.log(JSON.stringify(tree, null, 2));
tree.mergeAttributes();
console.log(JSON.stringify(tree.attributes, null, 2));
