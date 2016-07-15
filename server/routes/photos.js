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
var exec = require('child_process').exec;
var User = require('../models/user');

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
        var photosData = [];
        for(var i = 0; i < photos.length; i++){
          var photo = [];
          photo.push(photos[i].user);
          photo.push(new Buffer(photos[i].img.data).toString('base64'));
          photosData.push(photo);
        }
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
    var userId = null;
    var token = req.headers.authorization.split(' ')[1];
    console.log('Token value: ' + token);
    var userId = jwt.decode(token, config.secret);
    console.log(userId.key);
    var photoUser = []
    User.findOne({
        _id: userId.key
      }, function(err, user){
        if (err) throw err;
        if(!user) {
          res.json({
              destroy: true
          })
        }
        else {
          console.log('user data: ' + user);
          photoUser.firstname = user.firstname;
          photoUser.lastname = user.lastname;
          photoUser.email = user.email;
          photoUser.username = user.username;
          photoUser.user_id = user._id;

           console.log(photoUser);

           //pushing the whole array would be much simpler.
          newPhoto.user.data.firstname = photoUser.firstname;
          newPhoto.user.data.lastname = photoUser.lastname;
          newPhoto.user.data.email = photoUser.email;
          newPhoto.user.data.username = photoUser.username;
          newPhoto.user.data.user_id = photoUser.user_id;
          console.log(newPhoto.user.data);
          newPhoto.img.data = fs.readFileSync(req.files[0].path)
          console.log(newPhoto.img.data);
          newPhoto.img.contentType = "image/png";
          console.log(newPhoto.img.data);
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
          User.findOneAndUpdate(
            user._id,
            {$push: {"photos": newPhoto._id}},
            {upsert:true, new: true},
            function(err,model){
              console.log(err);
            }
          )
        }
    });
  });

	app.get('/*', function(req,res) {
		res.sendFile(path.resolve('client/index.html'));
	});

}