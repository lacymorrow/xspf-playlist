#!/usr/bin/env node
'use strict'
const meow = require( 'meow' )
const xspfPlaylist = require( './index' )

const cli = meow( `
	Usage
	  $ xspf-playlist media [{options}]

	Options
	  --id3,   -i  Use track ID3 meta information 
	  --depth, -d  Number of directories deep to search

	Examples
	  $ xspf-playlist '/path/to/media' '{"id3": true, "depth": 1}'
	  // => ...
`, {
	flags: {
		id3: {
			alias: 'i'
		},
		depth: {
			type: 'number',
			alias: 'd'
		}
	}
} )

let opts = {}

if ( typeof cli.flags.d === 'number' ) opts.depth = cli.flags.d
if ( cli.flags.i ) opts.id3 = !!cli.flags.i

xspfPlaylist( cli.input[0], opts )
	.then( console.log	 )
