# make-editorconfig

> A small library to generate editorconfigs automatically.

## Background
The [editorconfig](https://editorconfig.org) website describes editorconfigs as 
follows:

> EditorConfig helps developers define and maintain consistent coding styles 
> between different editors and IDEs. 

This library produces such an `editorconfig` given a list of files and directories.
It does so by first organizing the input into a tree, analyzing the contents
of files and then reducing the detected file features by bubbling up the attributes
most files having in common. It does a second pass to group attributes by
file extension.

## Usage
To install:

* Using npm: `npm install --save make-editorconfig`
* Using yarn `yarn add make-editorconfig`

## License

[MIT](https://github.com/fvj/make-editorconfig/blob/master/LICENSE)
