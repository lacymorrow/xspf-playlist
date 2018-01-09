'use strict'

// imports
var path = require('path')
var readdirp = require('readdirp')
var jsmediatags = require('jsmediatags')

// file extension -> type mapping
var imageTypes = ['.jpg', '.jpeg', '.gif', '.png', '.tiff']
var audioTypes = ['.mp3', '.wav', '.ogg']
var videoTypes = ['.mp4', '.webm', '.ogv', 'flv']

// allowed file extensions
var types = [].concat(imageTypes, audioTypes, videoTypes)

function checkType(ext) {
	if (imageTypes.includes(ext)) {
		return 'image'
	} else if (audioTypes.includes(ext)) {
		return 'audio'
	} else if (videoTypes.includes(ext)) {
		return 'video'
	} else {
		return 'invalid'
	}
}

function scanPath(dir, depth, cb) {
	var settings = {
	    root: dir,
	    entryType: 'files',
	    // filter files by extensions like *.mp3
	    fileFilter: types.map( function(x) { return '*' + x } ),
	    directoryFilter: ['!.!'],
	    depth: depth
	}

	var files = {}

	readdirp(settings)
	    .on('data', function (entry) {
	    	// store the file fullpath
	        files[path.parse(entry.name).name] = {
	        	location: entry.fullPath,
	        	path: entry.fullParentDir,
	        	relativePath: entry.parentDir,
	        	title: path.parse(entry.name).name,
	        	filename: path.parse(entry.name).name,
	        	extension: path.parse(entry.name).ext,
	        	type: checkType(path.parse(entry.name).ext), 
	        }
	    })
	    .on('warn', function(warn){
	        // console.log("Warn: ", warn)
	    })
	    .on('error', function(err){
	        console.log("Error: ", err)
	    })
	    .on('end', function(){
	    	cb(files)
	    })
}

function addDetails(files, id3, cb) {
	if (id3) {
		Promise.all(getDetailsId3(files)).then(function (detailedFiles) {
			cb(detailedFiles)
		}).catch(function(err) {
			// console.log(err)
			cb(files)
		})
	} else {
		var detailedFiles = getDetailsDirectory(files)
		cb(detailedFiles)
	}
}

function getDetailsId3(files) {
	var promises = []
	for (var file in files) {
		promises.push(new Promise(function (resolve, reject) {
			var current = files[file]
			jsmediatags.read(current.location, {
			  onSuccess: function(tag) {
			  	(tag.tags.title) ? current.title = tag.tags.title : null;
			  	(tag.tags.artist) ? current.creator = tag.tags.artist : null;
			  	(tag.tags.album) ? current.album = tag.tags.album : null;
			  	(tag.tags.year) ? current.year = tag.tags.year : null;
			  	(tag.tags.comment) ? current.comment = tag.tags.comment : null;
			  	(tag.tags.genre) ? current.genre = tag.tags.genre : null;
			  	(tag.tags.picture) ? current.picture = tag.tags.picture : null;
			  	(tag.tags.lyrics) ? current.lyrics = tag.tags.lyrics : null;
			  	resolve(current)
			  },
			  onError: function(error) {
			    // console.log(':(', error.type, error.info);
			    resolve(current)
			  }
			})
		}))
	}

	return promises
}

function getDetailsDirectory(files) {
	for (var file in files) {
		var current = files[file]
		var p = path.parse(current.relativePath)
		if (p.base) {
			// get album (artist if single obj)
			current.artist = p.base

			if (p.dir) {
				// get artist (value pushed to album)
				current.album = current.artist
				current.artist = path.parse(p.dir).base
			}
		}
	}

	return files
}

function toXspf(files) {
	var out = '<?xml version="1.0" encoding="UTF-8"?>\n'
	out += '<playlist version="1" xmlns="http://xspf.org/ns/0/">\n'
	out += '  <trackList>\n'
	for (var file in files){
		var current = files[file]
		
		out += '    <track>\n'
		for (var key in current) {

			// iterate track properties into the playlist, ignoring these explicit properties
			if (current.hasOwnProperty(key) && !(key in {'path': 1, 'relativePath': 1, 'filename': 1, 'extension': 1, 'picture': 1})) {
				out += '      <'  + key + '>'
				out += current[key]
				out +=       '</' + key + '>\n'
			}
		}
		out += '    </track>\n'
	}
	out += '  </trackList>\n'
	out += '</playlist>'
	return out
}

module.exports = function (filesOrPath, options, cb) {
	var files
	var defaultOptions = {
		depth: 2,
		id3: true
	}

	// no options passed, save callback
	if (typeof options === 'function') {
		cb = options
	}

	if (typeof cb !== 'function') {
		cb = function (err, res) {
			// do nothing
		}
	}

	try {
		options = JSON.parse(options)
		options = Object.assign(defaultOptions, options)
	} catch (e){
		options = defaultOptions
	}

	if (typeof filesOrPath === 'string') {
		// path -> array of files
		// scan for all valid files
		files = scanPath(filesOrPath, options.depth, function (files) {
			// grab track info from id3 or directory structure
			addDetails(files, options.id3, function(detailedFiles){
				// generate the xspf playlist
				cb(null, toXspf(detailedFiles))
			})
		})
	} else if (typeof filesOrPath === 'object') {
		// received an existing object, generate the xspf playlist synchronously
		cb(null, toXspf(filesOrPath))
	} else {
		throw new Error('Error: Expected a directory string or array of files');
	}


}