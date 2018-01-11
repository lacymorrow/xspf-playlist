XSPF Playlist [![Build Status](https://travis-ci.org/lacymorrow/xspf-playlist.svg?branch=master)](https://travis-ci.org/lacymorrow/xspf-playlist)
===============

> *Automatically create an XSPF Playlist for your media, with ID3 support*

Generate an XSPF playlist file for audio and video files using NodeJS.

Originally for: [lacymorrow/xspf-jukebox](https://github.com/lacymorrow/xspf-jukebox).

Use it on the command-line once or as a module in your program as a dead-simple way to keep a playlist on the internet up to date. 

_A PHP implementation of XSPF Playlist here: https://github.com/lacymorrow/xspf-playlister-php_

_A Python implementation of XSPF Playlist here: https://github.com/lacymorrow/xspf-playlister-py_


## Usage
Place all of your media files into a single directory (often named `media`) and call [xspf-playlist](https://github.com/lacymorrow/xspf-playlist) with the following signature. Your media directory will be scanned and media files will be enumerated and exported into a formatted XSPF playlist file automatically. That's it!

### xspfPlaylist( path, [{ options }], [ callback( err, res ) ])

Accepts either a directory path as a string, or an object of track objects.

```javascript
const xspfPlaylist = require('xspf-playlist')

// example scanning media directory
xspfPlaylist('/media', {'id3': true, 'depth': 0})
	.pipe(process.stdout)

// example passing a js object of file objects
xspfPlaylist([
	{
		title: 'file1',
		location: 'file1.mp3'
	},
	...
])
.pipe(process.stdout)
```

Tracks will be titled by their filename, sans-extension. Additional creator and album information can be provided by organizing your files into a `media/creator/album/title.ext` hierarchy. 

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

#### Command Line:

```
# from the xspf-playlist directory
node cli.js '/absolute/path/to/media' '{"id3": false}' > playlist.xspf
```


## Options

`options` is a valid JSON object

##### `id3`
_boolean_

By default, the [jsmediatags](https://github.com/aadsm/jsmediatags) library is used to scan `mp3` files and will automatically use the meta information associated with a track, rather than the menu directory hierarchy. This feature can be disabled by passing `id3: false` in the `options` parameter.

##### `depth`
_integer_

By default, this tool will scan two directories deep (in order to accomodate `media/creator/album/title.ext` formats). You can manually set the search depth by passing an integer to the `depth` option. `0` means no recursion, will only search the supplied directory.

##### Example options

`{"id3": false, "depth": 0}`


## License

[MIT](http://opensource.org/licenses/MIT) © [Lacy Morrow](http://lacymorrow.com)