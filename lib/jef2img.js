"use strict";

var fs = require('fs');
var path = require('path');
var { createCanvas } = require('canvas');
var jdataview = require('jdataview');
var { jefRead } = require('./jefformat');
var { Pattern }= require('./pattern');


var options = {
  type: 'imsge/png',
  outputdir: null,
  outputname: null
};

var Jef2Img = function() {};

Jef2Img.prototype.setOptions = function(opts) {
  options.type = opts.type || options.type;
  options.outputdir = opts.outputdir || options.outputdir;
  options.outputname = opts.outputname || options.outputname;
};

Jef2Img.prototype.convert = function(input, callbackreturn) {
  // Make sure it has correct extension
  if (path.extname(path.basename(input)) != '.jef') {
    return callbackreturn({
      result: 'error',
      message: 'Unsupported file type.'
    });
  }

  // Check if input file exists
  if (!isFileExists(input)) {
    return callbackreturn({
      result: 'error',
      message: 'Input file not found.'
    });
  }

  var stdout = [];
  var output = path.basename(input, path.extname(path.basename(input)));

  // Set output dir
  if (options.outputdir) {
    options.outputdir = options.outputdir + path.sep;
  } else {
    options.outputdir = output + path.sep;
  }

  // Create output dir if it doesn't exists
  if (!isDirExists(options.outputdir)) {
    fs.mkdirSync(options.outputdir);
  }

  // Set output name
  if (options.outputname) {
    options.outputname = options.outputname;
  } else {
    options.outputname = output;
  }


  if (!input) {
    return callback({
      result: 'error',
      message: 'Invalid input file path.'
    }, null);
  }

  // Convert jef file
  var inputFile = fs.readFileSync(input);
  var size = fs.statSync(input)['size'];
  var outputFile = options.outputdir + options.outputname + '.' + options.type.split('/')[1];

  convertJef2Img(inputFile, size, outputFile, function(error, result) {
    if (error) {
      return callbackreturn(error);
    }
    stdout.push(result);
    return callbackreturn(null, {
      result: 'success',
      message: stdout
    });
  });
};

var convertJef2Img = function(input, size, output, callback) {

  var pattern = new Pattern();
  var mycanvas = new createCanvas();

  var view = jdataview(input, 0, size);
  jefRead(view, pattern);
  pattern.moveToPositive();
  pattern.drawShape(mycanvas);

  var data = mycanvas.toBuffer(options.type);

  fs.writeFile(output, data, function(err) {
    if (err) {
      console.log(err)
      return callback({
        result: 'error',
        message: 'Can not write output file.'
      }, null);
    }

    if (!(fs.statSync(output)['size'] / 1000)) {
      return callback({
        result: 'error',
        message: 'Zero sized output image detected.'
      }, null);
    }

    var results = {
      name: path.basename(output),
      size: fs.statSync(output)['size'] / 1000.0,
      path: output
    };

    return callback(null, results);
  });
};

// Check if directory is exists
var isDirExists = function(path) {
  try {
    return fs.statSync(path).isDirectory();
  } catch (e) {
    return false;
  }
}

// Check if file is exists
var isFileExists = function(path) {
  try {
    return fs.statSync(path).isFile();
  } catch (e) {
    return false;
  }
}

module.exports = new Jef2Img;
