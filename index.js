'use strict'

// imports
const path = require('path')
const stream = require('stream')
const readdirp = require('readdirp')
const jsmediatags = require('jsmediatags')

// file extension -> type mapping
const types = {
	image: '.jpg .jpeg .gif .png .tiff'.split(' '),
	audio: '.mp3 .wav .ogg'.split(' '),
	video: '.mp4 .webm .ogv .flv'.split(' '),
}

const allowed = Object.keys(types)
	.reduce((allowed, key) => allowed.concat(types[key]), [])

function checkType(ext) {
	for (let t in types)
		if (types[t].includes(ext)) return t

	return 'invalid'
}

function scanPath(dir, depth) {
	return readdirp({
		root: dir,
		entryType: 'files',
		// filter files by extensions like *.mp3
		fileFilter: allowed.map(ext => `*${ext}`),
		directoryFilter: ['!.!'],
		depth: depth
	})
}

class AddMeta extends stream.Transform {
	constructor() {
		super({ objectMode: true })
	}

	_transform(file, enc, next) {
		const { name, ext } = path.parse(file.name)

		this.push({
			location: file.fullPath,
			path: file.fullParentDir,
			relativePath: file.parentDir,
			title: name,
			filename: name,
			extension: ext,
			type: checkType(ext),
		})

		next()
	}
}

class AddDetails extends stream.Transform {
	constructor(id3) {
		super({ objectMode: true })
		this.__id3 = id3
	}

	id3(file, next) {
		const p = path.parse(file.relativePath)
		if (p.base) {
			// get album (artist if single obj)
			file.artist = p.base

			if (p.dir) {
				// get artist (value pushed to album)
				file.album = file.artist
				file.artist = path.parse(p.dir).base
			}
		}
		this.push(file)
		next()
	}

	jsmedia(file, next) {
		function done() {
			this.push(file)
			next()
		}

		jsmediatags.read(file.location, {
			onSuccess: ({ tags }) => {
				const meta = {
					title: null,
					artist: null,
					album: null,
					year: null,
					comment: null,
					genre: null,
					picture: null,
					lyrics: null,
				}

				for (let m in meta)
					file[m] = tags[m] || meta[m]

				done()
			},
			onError: done,
		})
	}

	_transform(file, enc, next) {
		this.__id3 ? this.id3(file, next) : this.jsmedia(file, next)
	}
}

class FromArray extends stream.Readable {
	constructor(arr) {
		super({ objectMode: true })
		this.arr = arr
		this.idx = 0
	}

	_read() {
		const file = this.arr[this.idx++] || null
		this.push(file)
	}
}

class Xspf extends stream.Transform {
	constructor() {
		super({ objectMode: true })

		const ignore = 'path relativePath filename extension picture'.split(' ')
		this.unrelated = key => !ignore.includes(key)

		this.push('<?xml version="1.0" encoding="UTF-8"?>\n')
		this.push('<playlist version="1" xmlns="http://xspf.org/ns/0/">\n')
		this.push('\t<trackList>\n')
	}

	_flush(done) {
		this.push('\t</trackList>\n')
		this.push('</playlist>')
		done()
	}

	_transform(file, enc, next) {
		this.push('\t\t<track>\n')

		Object.keys(file)
			.filter(this.unrelated)
			.forEach(key => {
				this.push(`\t\t\t<${key}>`)
				this.push(file[key])
				this.push(`</${key}>\n`)
			})

		this.push('\t\t</track>\n')
		next()
	}
}

module.exports = function (filesOrPath, options = {}) {
	if (typeof options === 'string') {
		options = JSON.parse(options)
	}

	const opts = Object.assign({
		depth: 2,
		id3: true
	}, options)

	switch (typeof filesOrPath) {
		case 'string':
			return scanPath(filesOrPath, opts.depth)
				.pipe(new AddMeta)
				.pipe(new AddDetails(opts.id3))
				.pipe(new Xspf)
		case 'object':
			return new FromArray(filesOrPath)
				.pipe(new Xspf)
		default:
			throw new Error('Error: Expected a directory string or array of files')
	}
}