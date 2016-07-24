var _ = require('lodash');
var express = require('express');
var path = require('path');
var multer = require("multer");
var crypto = require('crypto');
var Imagemin = require('imagemin');
var fs = require('fs');

var photoController = require('../controllers/photo.controller');

var storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      if (err) return cb(err)

      cb(null, raw.toString('hex') + path.extname(file.originalname))
    })
  }
})




module.exports = function(app) {
  
    /*
    This code would be used if wanting to pull photos from the filesystem instead of the database - need to uncomment code is 
    the photos component as well.

  	app.get('/api/photos', function (req, res) {
  		fs.readdir('./uploads/', function(err,files){
  			res.json({info: 'it worked',
  				files: files
  			});
  		});
  	});
  */

  app.get('/api/photos', photoController.getPhotos);

	app.post("/api/upload", multer({ storage: storage }).array("uploads[]", 12), photoController.uploads);

  app.post('/api/vote', photoController.likes);

	app.get('/*', function(req,res) {
		res.sendFile(path.resolve('client/index.html'));
	});
}