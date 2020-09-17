"use strict";

var fs      = require('fs');
var path    = require('path');
var expect  = require('chai').expect();
var should  = require('chai').should();
var jef2img = require('../index.js');

var input   = __dirname + path.sep + 'test.jef';

jef2img.setOptions({
  outputdir: __dirname + path.sep + '/output',
  outputname: 'test'
});

describe('Convert jef into images', function() {
  it ('Create png file', function(done) {
    this.timeout(10000);
    jef2img.setOptions({ type: 'image/png' });
    jef2img.convert(input, function(err, info) {
      if (info.result !== 'success') {
        info.result.should.equal('success');
        done();
      } else {
        info.message.forEach(function(file) {
          file.name.should.equal('test' + '.png');
          isFileExists(file.path).should.to.be.true;
          done();
        });
      }
    });
  });
  it ('Create jpeg file', function(done) {
    this.timeout(10000);
    jef2img.setOptions({ type: 'image/jpeg' });
    jef2img.convert(input, function(err, info) {
      if (info.result !== 'success') {
        info.result.should.equal('success');
        done();
      } else {
        info.message.forEach(function(file) {
          file.name.should.equal('test' + '.jpeg');
          isFileExists(file.path).should.to.be.true;
          done();
        });
      }
    });
  });
});

var isFileExists = function(path) {
  try {
    return fs.statSync(path).isFile();
  } catch (e) {
    return false;
  }
}
