> WARNING
> This project has deprecated dependencies and will receive no new updates

# XSPF Playlist [![npm version](https://badge.fury.io/js/xspf-playlist.svg)](https://badge.fury.io/js/xspf-playlist)

> *Automagic XSPF Playlists*

Generate an XSPF playlist file for audio and video files and autofill track details from ID3 tags.

## Usage

```bash
  $ npm install -g xspf-playlist
  
  $ xspf-playlist 'path/to/media' '{"id3": false}' > playlist.xspf
```

Place media files into a directory (often named `media`) and pass it to [xspf-playlist](https://github.com/lacymorrow/xspf-playlist). Your media directory will be scanned and exported into an XSPF playlist file automatically. That's it!

Nested directories can be treated as the `<artist>` and `<album>` fields with a hierarchy like `media/artist/album/track.xxx`


### xspfPlaylist( media, [, { options }] [, stream] [, callback( err, res ) ])

Accepts either a directory path as a string or an array of track objects as media input. Outputs an XSPF playlist as a sting. 

Stream and Callback APIs are provided if `true` or a `function` are passed as the last parameter, respectively. 

Returns a Promise which resolves to a string by default.

```javascript
const xspfPlaylist = require('xspf-playlist')

// Scanning a directory
xspfPlaylist('/media')
	.then(console.log)
```

###### Or, with a stream
```javascript
xspfPlaylist('/media', true)
    .pipe(process.stdout)
```

###### Or, with a callback
```javascript
xspfPlaylist('/media', function (error, response) {
	console.log(response)
})
```

###### Using options
```javascript
const xspfPlaylist = require('xspf-playlist')

// Scanning a directory
xspfPlaylist('/media', {'id3': true, 'depth': 0})
	.then(console.log)
```

###### Passing an object
```javascript
xspfPlaylist([
	{
		title: 'file1',
		location: 'file1.mp3'
	},
	...
]).then(console.log)
```

Tracks will be titled by their filename, sans-extension. Additional creator and album information can be provided by organizing your files into a `media/creator/album/title.xxx` hierarchy. 

An image may be associated with a track by giving it the same filename. To associate one image with an entire folder of tracks, give it the filename `artwork`. `artwork` images associate themselves to every sibling and child directory and may be placed anywhere in your media directory hierarchy, so an `artwork.jpg` in the `media` directory will act as a global image, filling in for every track that did not already have one provided.

#### ID3

By default, supported files will be scanned for ID3 tag info which will automatically fill the following track information if present:

* `title`
* `artist`
* `album`
* `year`
* `comment`
* `track`
* `genre`
* `picture`
* `lyrics`


###### Tag readers

* ID3v1
* ID3v2 (with unsynchronisation support!)
* MP4
* FLAC


#### File Types

Supports `mp3`, `wav`, and `ogg` audio and `mp4`, `webm`, and `ogv` video formats. 


## API

#### `options`

`options` is a valid JSON object.

##### `id3`
_boolean_

By default, the [jsmediatags](https://github.com/aadsm/jsmediatags) library is used to scan `mp3` files and will automatically use the meta information associated with a track, rather than the menu directory hierarchy. This feature can be disabled by passing `id3: false` in the `options` parameter.

##### `depth`
_integer_

By default, this tool will scan two directories deep (in order to accomodate `media/creator/album/title.ext` formats). You can manually set the search depth by passing an integer to the `depth` option. `0` means no recursion, will only search the supplied directory.

##### Default options

`{"id3": true, "depth": 2}`


#### `stream`
_boolean_

If `true` returns a Stream. if `false` returns a Promise.
Default: `false`. 


#### `callback( error, response )`
_function_

Function to callback when playlist generation is complete. Called with `error` and `response` parameters, `response` is a string.



## Related 

* Used by: [lacymorrow/xspf-jukebox](https://github.com/lacymorrow/xspf-jukebox)

* [lacymorrow/xspf-playlister-php](https://github.com/lacymorrow/xspf-playlister-php)

* [lacymorrow/xspf-playlister-py](https://github.com/lacymorrow/xspf-playlister-py)


## License

[MIT](http://opensource.org/licenses/MIT) © [Lacy Morrow](http://lacymorrow.com)
