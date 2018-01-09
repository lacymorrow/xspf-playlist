'use strict'

var readdirp = require('readdirp')

// file extension -> type mapping
var imageTypes = ['.jpg', '.jpeg', '.gif', '.png', '.tiff']
var audioTypes = ['.mp3', '.wav', '.ogg']
var videoTypes = ['.mp4', '.webm', '.ogv', 'flv']

// allowed file extensions
var types = [].concat(imageTypes, audioTypes, videoTypes)


function scanPath(path) {
	var settings = {
	    root: path,
	    entryType: 'files',
	    // filter files by extensions like *.mp3
	    fileFilter: types.map( function(x) { return '*' + x } ),
	    directoryFilter: ['!.!'],
	    depth: 2
	}

	var files = []

	readdirp(settings)
	    .on('data', function (entry) {
	    	// store the file fullpath
	        files.push(entry.fullPath)
	    })
	    .on('warn', function(warn){
	        console.log("Warn: ", warn)
	    })
	    .on('error', function(err){
	        console.log("Error: ", err)
	    })
	    .on('end', function(){
	        console.log(files)
	    })
}

function toXspf(files) {

	// (id3) ? getId3(file) : getDirectoryStructure(file)
}
module.exports = function (filesOrPath, options) {
	if (typeof options === 'object') {
		options.depth = (options.depth) ? options.depth : 2
		options.id3 = (options.id3) ? options.id3 : true
	}

	if (typeof filesOrPath === 'string') {
		// path -> array of files
		console.log('path: ', filesOrPath)
		var files = scanPath(filesOrPath)
		toXspf(files)
	} else if (typeof filesOrPath === 'object') {
		// array of files -> XSPF Playlist w/ scanning
		toXspf(filesOrPath)
	} else {
		throw new Error('Error: Expected a filepath string or array of files');
	}
}