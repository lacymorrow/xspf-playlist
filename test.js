'use strict'
var assert = require('assert')
var xspfPlaylist = require('./index')

it('should return a valid xspf playlist', function () {
	xspfPlaylist({
		file1: {
			title: 'test',
			location: 'location'
		}
	}, function (err, res) {
			console.log(res)
	    	assert.strictEqual(res.indexOf('<?xml'), 0, 'should start with <?xml>')
	    	assert.notEqual(res.indexOf('<title>test</title>'), -1, '<title>test</title> should be present')
	})
})
