XSPF Playlister
===============

> *Automatically create an XSPF Playlist for your media, with ID3 support*

Generate an XSPF playlist file for audio and video files using NodeJS.

Use it on the command-line once or as a module in your program as a dead-simple way to keep a playlist on the internet up to date. 

_A PHP implementation of XSPF-Playlist here: https://github.com/lacymorrow/xspf-playlister-php_
_A Python implementation of XSPF-Playlist here: https://github.com/lacymorrow/xspf-playlister-py_

Created for: [lacymorrow/xspf-jukebox](https://github.com/lacymorrow/xspf-jukebox).

## Usage
Place all of your media files into a single directory (often named `media`). That's it!

- root
  - playlister.php
  - getid3
   


Tracks will be titled by their filename sans extension. Additional creator and album information can be provided by organizing your files into a `media/creator/album/title.ext` hierarchy. 

An image may be associated with a track by giving it the same filename. To associate one image with an entire folder of tracks, give it the filename `artwork`. `artwork` images associate themselves to every sibling and child directory and may be placed anywhere in your media directory hierarchy, so an `artwork.jpg` in the `media` directory will act as a global image, filling in for every track that did not already have one provided.

#### File Types

Supports `mp3`, `wav`, and `ogg` audio and `mp4`, `webm`, and `ogv` video formats. 

#### Command Line:

```
# from the xspf-playlist directory
node cli.js '/absolute/path/to/media' '{"id3": false}' > playlist.xspf
```

## Options

##### `id3`
_boolean_

By default, the [jsmediatags](https://github.com/aadsm/jsmediatags) library is used to scan `mp3` files and will automatically use the meta information associated with a track, rather than the menu directory hierarchy. This feature can be disabled by passing `id3: false` in the `options` parameter.

##### `depth`
_integer_

By default, this tool will scan two directories deep (in order to accomodate `media/creator/album/title.ext` formats). You can manually set the search depth by passing an integer to the `depth` option.

##### Example Options

`{"id3": false, "depth": 1}`



## License

[MIT](http://opensource.org/licenses/MIT) © [Lacy Morrow](http://lacymorrow.com)