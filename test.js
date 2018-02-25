'use strict'
import test from 'ava'
var xspfPlaylist = require( './index' )

test.cb( 'returns a valid xspf playlist',  t => {

	t.plan( 2 )

	xspfPlaylist( {
		file1: {
			title: 'test',
			location: 'location'
		}
	}, function ( err, res ) {

		if ( err ) console.log( res )
		console.log( res )
		t.is( res.indexOf( '<?xml' ), 0, 'should start with <?xml>' )
		t.not( res.indexOf( '<title>test</title>' ), -1, '<title>test</title> should be present' )
		t.end()

	} )

} )
