var _ = require('lodash');
var Photo = require('../models/photo.js');
var path = require('path');
var multer = require("multer");
var crypto = require('crypto');
var Imagemin = require('imagemin');
var fs = require('fs');
var Photo = require('../models/photo');
var config = require('../config/database');
var express = require('express');
var jwt = require('jsonwebtoken');

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

  app.get('/api/photos', function (req, res) {
    var photos = Photo.find({}, function(err, photos) {
      console.log(photos);
      if(photos.length != 0){
        console.log(photos.length);
        var photosData = [];
        for(var i = 0; i < photos.length; i++){
          //var thumb = photos[i].img.data;
          var thumb = new Buffer(photos[i].img.data).toString('base64');
          photosData.push(thumb);
          console.log(thumb);
        }
        console.log(photosData);
        console.log(photosData.length);
        console.log(photos[0].img.data)
        res.json({info: 'it worked',
          photos: photosData
        });
      }else{
        res.json({info: 'it worked',
          photos: false
        });
      }
    });
  });

	app.post("/api/upload", multer({ storage: storage }).array("uploads[]", 12), function(req, res) {
		console.log(req.files);
		console.log(req.files.path);
		console.log(req.files[0].path);
		var newPhoto = new Photo();
		newPhoto.img.data = fs.readFileSync(req.files[0].path)
    console.log(newPhoto.img.data);
		newPhoto.img.contentType = "image/png";
    console.log(newPhoto.img.data);
		var token = req.headers.authorization.split(' ')[1];
        var userId = jwt.decode(token, config.secret);
		newPhoto.user_id = userId;
		console.log(newPhoto);
		newPhoto.save(function(err, dbRes){
                console.log(dbRes);
                if (err){
                    res.json({success:false, msg:'Failed to save'});
                }
                
                else {
                    res.json({success:true, 
                              msg:'Successfully saved',
                              data: {
                                    res: dbRes
                            	}
                            });
                }
            });
        });

	app.get('/*', function(req,res) {
		res.sendFile(path.resolve('client/index.html'));
	});

}