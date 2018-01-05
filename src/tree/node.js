export const ATTRIBUTES = [
	'indent_style',
	'indent_size',
	'end_of_line',
	'trim_trailing_whitespace',
	'insert_final_newline',
]

export default class Node {
	constructor(filename, content, children = [], attributes = {}) {
		this.filename = filename
		this.content = content
		this.children = children
		this.attributes = attributes
		// only branches can hold information in its children
		this.childrenContainInformation = content == null
	}

	mergeAttributes() {
		this.childrenContainInformation = false
		if (this.children.length === 0) return
		this.children.forEach(child => child.mergeAttributes())
		// todo: this iterates over the children a constant amount, yet
		// still too often; we'd probably need only a single pass
		ATTRIBUTES.forEach(attribute => {
			const val = this.children[0].attributes[attribute]
			const consensus = this.children.every(
				child => (child.attributes[attribute] = val)
			)
			if (!consensus) {
				this.childrenContainInformation = true
				return
			}
			this.attributes[attribute] = val
			this.children.forEach(child => delete child.attributes[attribute])
		})
		return this
	}
}
