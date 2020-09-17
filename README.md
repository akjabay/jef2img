# nodejs jef2img

A nodejs module for converting embroidery jef file into image

## Dependencies
- canvas
- jdataview


## Installation
```
  $ [sudo] npm install jef2img
```

## Usage

```javascript
var path    = require('path');
const jef2img = require('jef2img');

var input   = __dirname + '/test.jef';

jef2img.setOptions({
  type: 'image/png',                          // image/png or image/jpeg, default image/png
  outputdir: __dirname + path.sep + 'output', // output folder, default null (if null given, then it will create folder name same as file name)
  outputname: 'test',                         // output file name, dafault null (if null given, then it will create image name same as input name)
});

jef2img.convert(input, function(err, info) {
  if (err) console.log(err)
  else console.log(info);
});

```

It will return converted image file.

```javascript
{ result: 'success',
  message: 
   [ { name: 'test.jpeg',
       size: 22.78,
       path: '/output/test.jpeg' } ] }
```

## Maintainer
[asem saberi][0]

## License
MIT

[0]: https://github.com/akjabay/jef2img.git
