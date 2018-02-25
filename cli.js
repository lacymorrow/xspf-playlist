#!/usr/bin/env node
'use strict'
var pkg = require( './package.json' )
var xspfPlaylist = require( './index' )
var path = process.argv[2]

var help = function () {

	console.log( '\n' + pkg.description )
	console.log( '\nUsage' )
	console.log( '  $ xspf-playlist path [{options}]\n' )
	console.log( 'Example' )
	console.log( '  $ xspf-playlist \'/path/to/media\' \'{"id3": true, "depth": 1}\'' )

}

var main = function () {

	if ( process.argv.indexOf( '-h' ) !== -1 || process.argv.indexOf( '--help' ) !== -1 ) {

		help()
		return

	}

	if ( process.argv.indexOf( '-v' ) !== -1 || process.argv.indexOf( '--version' ) !== -1 ) {

		console.log( pkg.version )
		return

	}

	if ( process.argv.length < 3 ) {

		// Not enough args
		help()

	} else if ( process.argv.length >= 3 ) {

		xspfPlaylist( path, process.argv[2] )
			.pipe( process.stdout )

	} else {

		// scan path and generate xspf playlist
		xspfPlaylist( path )
			.pipe( process.stdout )

	}

}

main()
