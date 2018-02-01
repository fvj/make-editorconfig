import endOfLine from "./deduction/endOfLine";
import indentSize from "./deduction/indentSize";
import indentStyle from "./deduction/indentStyle";
import insertFinalNewline from "./deduction/insertFinalNewline";
import trimTrailingWhitespace from "./deduction/trimTrailingWhitespace";
import Node from "./tree/node";
import { readdirSync, statSync, readFileSync } from "fs";
import { join } from "path";
import { isBinary } from "./deduction/util";

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

const constructTreeFromDirectory = path => {
	const walk = path => {
		const node = new Node(path, null);
		const files = readdirSync(path);
		files.forEach(file => {
			const childPath = join(path, file);
			const stats = statSync(childPath);
			if (stats.isFile(childPath)) {
				const contents = readFileSync(childPath).toString();
				if (isBinary(contents)) return;
				const attributes = detect(contents);
				node.children.push(new Node(childPath, contents, [], attributes));
			}
			else if (stats.isDirectory(childPath))
				node.children.push(walk(childPath));
			else throw new Error("no idea how to handle file" + childPath);
		});
		return node;
	};
	return walk(path);
};

const tree = constructTreeFromDirectory(process.argv[2]);
console.log(JSON.stringify(tree, null, 2));
tree.mergeAttributes();
console.log(JSON.stringify(tree.attributes, null, 2));
