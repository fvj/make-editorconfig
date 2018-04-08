# make-editorconfig

[![standard-readme compliant](https://img.shields.io/badge/standard--readme-OK-green.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)
TODO: Put more badges here.

> A library for generating editorconfigs automatically.

This library provides the backend for frontends such as 
[make-editorconfig-cli](https://github.com/fvj/make-editorconfig-cli) 
and [make-editorconfig-web](https://github.com/fvj/make-editorconfig-web).

## Table of Contents

- [Background](#background)
- [Install](#install)
- [Usage](#usage)
- [API](#api)
- [Maintainers](#maintainers)
- [Contribute](#contribute)
- [License](#license)

## Background

The official [editorconfig website](https://editorconfig.org) describes 
editorconfigs as follows:

> EditorConfig helps developers define and maintain consistent coding
> styles between different editors and IDEs.

This library generates such a file given files. It does so by

1. Producing a tree structure
2. Detecting file attributes for every file
3. Bubbling up common attributes
4. Merging common attributes by file extension
5. Converting the tree into an editorconfig

## Install

* Using [yarn](https://yarnpkg.com): `yarn add make-editorconfig`
* Using [npm](https://www.npmjs.com/get-npm): `npm install --save make-editorconfig`

## API

TODO

## Maintainers

[@fvj](https://github.com/fvj)

## Contribute

PRs accepted.

Small note: If editing the README, please conform to the [standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## License

MIT © 2018 Julius von Froreich
