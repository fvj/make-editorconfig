import { maxInObject } from '../deduction/util'

export const ATTRIBUTES = [
	'indent_style',
	'indent_size',
	'end_of_line',
	'trim_trailing_whitespace',
	'insert_final_newline',
]

const generateConsensus = children => {
	const res = {}

	ATTRIBUTES.forEach(attribute => {
		if (children.every(child => child.attributes[attribute] === undefined))
			return

		const val = (
			children.find(child => child.attributes[attribute] != null) || {
				attributes: { [attribute]: null },
			}
		).attributes[attribute]

		const consensus = children.every(
			child =>
				child.attributes[attribute] === null ||
				child.attributes[attribute] === val
		)

		if (!consensus) return

		res[attribute] = val
	})
	return res
}

export default class Node {
	constructor(filename, content, children = [], attributes = {}) {
		this.filename = filename
		this.content = content
		this.children = children
		this.attributes = attributes
		// only branches can hold information in its children
		this.childrenContainInformation = content == null
		this.attributesByExtension = {}
	}

	isDirectory() {
		return this.content === null
	}

	clean() {
		this.children.forEach(c => c.clean())
		Object.keys(this.attributes).forEach(attribute => {
			if (!this.attributes[attribute]) delete this.attributes[attribute]
		})
		return this
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

			// ugly hack, fix pls.
			let values = {}
			this.children.forEach(child => {
				if (child.attributes[attribute])
					if (values[child.attributes[attribute]])
						values[child.attributes[attribute]].count++
					else
						values[child.attributes[attribute]] = {
							value: child.attributes[attribute],
							count: 1,
						}
			})

			const maxKey = maxInObject(values, (obj, key) => obj[key].count)
			if (!maxKey) return

			const val = values[maxKey].value
			const consensus = this.children.every(
				child =>
					child.attributes[attribute] === null ||
					child.attributes[attribute] === val
			)

			if (!consensus) this.childrenContainInformation = true

			this.attributes[attribute] = val
			this.children.forEach(child => {
				if (child.attributes[attribute] === val)
					delete child.attributes[attribute]
			})
		})

		if (purge)
			Object.keys(this.attributes).forEach(key => {
				if (this.attributes[key] === null) delete this.attributes[key]
			})

		return this
	}

	mergeByExtensions() {
		const extensionOf = path => path.split('.').pop()
		const extensions = new Set()

		this.children.forEach(child => {
			if (child.isDirectory()) child.mergeByExtensions()
		})

		this.children.forEach(child => {
			if (!child.isDirectory()) extensions.add(extensionOf(child.filename))
		})

		for (const extension of extensions) {
			const childrenByExtension = this.children.filter(
				c => extensionOf(c.filename) === extension
			)
			const consensus = generateConsensus(childrenByExtension)

			if (Object.keys(consensus).length === 0) continue // no consensus reached

			// bubble up
			childrenByExtension.forEach(child => {
				Object.keys(consensus).forEach(key => delete child.attributes[key])
			})

			this.attributesByExtension[extension] = consensus
		}
	}
}
