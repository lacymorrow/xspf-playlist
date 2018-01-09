#!/usr/bin/env node
'use strict';
var pkg = require('./package.json');
var xspfPlaylist = require('./index');
var path = process.argv[2];

function help() {
	console.log(pkg.description);
	console.log('\nUsage');
	console.log('  $ xspf-playlist path [depth] [useId3]\n');
	console.log('Example');
	console.log('  $ xspf-playlist \'/path/to/media\'');
}

if (process.argv.indexOf('-h') !== -1 || process.argv.indexOf('--help') !== -1) {
	help();
	return;
}

if (process.argv.indexOf('-v') !== -1 || process.argv.indexOf('--version') !== -1) {
	console.log(pkg.version);
	return;
}

if (process.argv.length < 3){ 
	// Not enough args
	help();
} else { 
	// scan path and generate xspf playlist
	xspfPlaylist(path);
}