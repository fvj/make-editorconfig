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

	mergeAttributes(purge = false) {
		if (this.children.length === 0) return
		this.childrenContainInformation = false
		this.children.forEach(child => child.mergeAttributes())
		// todo: this iterates over the children a constant amount, yet
		// still too often; we'd probably need only a single pass
		ATTRIBUTES.forEach(attribute => {
			if (
				this.children.every(child => child.attributes[attribute] === undefined)
			)
				return
			const val = (this.children.find(
				child => child.attributes[attribute] != null
			) || { attributes: { [attribute]: null } }).attributes[attribute]
			const consensus = this.children.every(
				child =>
					child.attributes[attribute] === null ||
					child.attributes[attribute] === val
			)
			if (!consensus) {
				// console.info(`did not reach consensus for node ${this.filename} on attribute ${attribute}`)
				this.childrenContainInformation = true
				return
			}
			// console.info(`consensus for ${this.filename} on ${attribute} is ${val}`)
			this.attributes[attribute] = val
			this.children.forEach(child => delete child.attributes[attribute])
		})
		if (purge)
			Object.keys(this.attributes).forEach(key => {
				if (this.attributes[key] === null) delete this.attributes[key]
			})
		return this
	}
}
