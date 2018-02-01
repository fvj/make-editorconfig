import Node from './node'

test('construct a node', () => {
	const node = new Node('path', 'some contents', [], { a: 1, b: 2 })
	expect(node).toEqual({
		filename: 'path',
		content: 'some contents',
		children: [],
		attributes: {
			a: 1,
			b: 2,
		},
		childrenContainInformation: false,
	})
})

test('merge two nodes', () => {
	const node1 = new Node('', '', [], {
		indent_style: 'tab',
		end_of_line: 'lf',
		trim_trailing_whitespace: true,
		insert_final_newline: true,
	})
	const node2 = new Node('', '', [], {
		indent_style: 'tab',
		end_of_line: 'lf',
		trim_trailing_whitespace: true,
		insert_final_newline: true,
	})
	const root = new Node('', '', [node1, node2])
	expect(root.mergeAttributes().attributes).toEqual({
		indent_style: 'tab',
		end_of_line: 'lf',
		trim_trailing_whitespace: true,
		insert_final_newline: true,
	})
	expect(node1.attributes['indent_style']).toBe(undefined)
	expect(node2.attributes['indent_style']).toBe(undefined)
})

test("shouldn't merge different attributes of two nodes", () => {
	const node1 = new Node('', null, [], {
		indent_style: 'space',
		end_of_line: 'lf',
		trim_trailing_whitespace: true,
		insert_final_newline: false,
	})
	const node2 = new Node('', null, [], {
		indent_style: 'tab',
		end_of_line: 'lf',
		trim_trailing_whitespace: true,
		insert_final_newline: true,
	})
	const root = new Node('', '', [node1, node2])
	expect(root.mergeAttributes().attributes).toEqual({
		end_of_line: 'lf',
		trim_trailing_whitespace: true,
	})
	expect(root.childrenContainInformation).toBe(true)
})

test('should even merge null', () => {
	const node1 = new Node('', '', [], {
		indent_style: null,
	})
	const node2 = new Node('', '', [], {
		indent_style: null,
	})
	const root = new Node('', null, [node1, node2])
	expect(root.mergeAttributes().attributes).toEqual({
		indent_style: null,
	})
	expect(root.childrenContainInformation).toBe(false)
})

test('should purge if asked to', () => {
	const node1 = new Node('', '', [], {
		indent_style: null,
	})
	const node2 = new Node('', '', [], {
		indent_style: null,
	})
	const root = new Node('', null, [node1, node2])
	expect(root.mergeAttributes(true).attributes).toEqual({})
	expect(root.childrenContainInformation).toBe(false)
})
