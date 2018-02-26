'use strict'
import test from 'ava'
var xspfPlaylist = require( './index' )

test( 'returns a valid xspf playlist promise', async t => {

	t.plan( 2 )

	await xspfPlaylist( [
		{
			title: 'test',
			location: 'location'
		}
	] )
		.then( res => {

			t.is( res.indexOf( '<?xml' ), 0, 'should start with <?xml>' )
			t.not( res.indexOf( '<title>test</title>' ), -1, '<title>test</title> should be present' )

		} )

} )

test.cb( 'returns a valid xspf playlist callback', t => {

	t.plan( 2 )

	xspfPlaylist( [
		{
			title: 'test',
			location: 'location'
		}
	], ( err, res ) => {

		err && t.end(err)
		t.is( res.indexOf( '<?xml' ), 0, 'should start with <?xml>' )
		t.not( res.indexOf( '<title>test</title>' ), -1, '<title>test</title> should be present' )
		t.end()

	} )

} )
