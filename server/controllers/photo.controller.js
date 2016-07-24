var Photo = require('../models/photo.js');
var path = require('path');
var multer = require("multer");
var crypto = require('crypto');
var Imagemin = require('imagemin');
var fs = require('fs');
var Photo = require('../models/photo');
var config = require('../config/database');
var jwt = require('jsonwebtoken');
var User = require('../models/user');

var functions = {

    uploads(req,res){
    console.log(req.files)
    console.log(req.files[0]);
    console.log(req.files[0].originalname);
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
          newPhoto.name = req.files[0].originalname;
          // newPhoto.name = req.files.name;
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
            {_id: user._id},
            {$push: {"photos": newPhoto._id}},
            {upsert:true, new: true},
            function(err,model){
              console.log(err);
            }
          )
        }
    });
  },

  getPhotos(req,res){
    var userId = false;
    if(req.headers.authorization.split(' ')[1]){
      var token = req.headers.authorization.split(' ')[1];
      userId = jwt.decode(token, config.secret);
    }
    var filter = req.headers.filter;
    console.log(filter);
    console.log(userId);
    if(filter === 'true'){
      var photos = Photo.find({}, null, {sort:'-created_at'}, function(err, photos) {
        console.log(photos);
        if(photos.length != 0){
          var photosData = [];
          for(var i = 0; i < photos.length; i++){
            var photo = [];
            photo.push(photos[i].name)
            photo.push(photos[i].user);
            photo.push(new Buffer(photos[i].img.data).toString('base64'));
            photo.push(photos[i]._id);
            photo.push(photos[i].likes.num);
            if(photos[i].likes.users.indexOf(userId.key) !== -1){ photo.push(true);}
            photosData.push(photo);
          }
          res.json({info: 'it worked',
            photos: photosData
          });
        }else{
          res.json({
            photos: false
          });
        }
      });
    } else {
      var today = new Date()
      var lastweek = today.setTime(today.getTime() - (7 * 24 * 60 * 60 * 1000));
      var photos = Photo.find({created_at:{'$lte': new Date,'$gte': lastweek}}, null, {sort:'-likes'}, function(err,photos){
          console.log(photos);
          if(photos.length != 0){
            var photosData = [];
            for(var i = 0; i < photos.length; i++){
              var photo = [];
              photo.push(photos[i].name);
              photo.push(photos[i].user);
              photo.push(new Buffer(photos[i].img.data).toString('base64'));
              photo.push(photos[i]._id);
              photo.push(photos[i].likes.num);
              if(photos[i].likes.users.indexOf(userId.key) !== -1){ photo.push(true);}
              photosData.push(photo);
            }
            res.json({info: 'it worked',
              photos: photosData
            });
          }else{
            res.json({
              photos: false
            });
          }
      });
    }
  },

  likes(req,res){
    var photoId = req.body.photo;
    console.log('photoid = ' + photoId);
    var type = req.body.type; //will be either true(voted) or false(not-voted)
    console.log(type);
    console.log(typeof type);
    console.log(req.headers.authorization.split(' ')[1])
    if((req.headers.authorization.split(' ')[1]) === 'null'){
      res.json({
              destroy: true,
              user:false
      })
      return false;
    }
    var token = req.headers.authorization.split(' ')[1];
    var userId = jwt.decode(token, config.secret);
    User.findOne({
        _id: userId.key
      }, function(err, user){
        if (err) throw err;
        if(!user) {
          res.json({
              destroy: true,
              user:false
          })
        }
        else {
          console.log('photoId = ' + photoId);
          console.log('type2 = ' + type);
          if(type === 'false'){
            User.findOneAndUpdate(
              {
                 _id: user.id,
                'likes': {$ne: photoId}
              },
              {$push: {'likes': photoId}},
              {upsert: true, new:true},
              function(err,dbRes){
                if(err) console.log(err);
                console.log(dbRes);
              }
            )

            Photo.findOneAndUpdate(
              {
                _id: photoId,
                'likes.users': {$ne: user.id}
              },
              {
                $inc: {'likes.num': 1},
                $push: {'likes.users': user.id}
              },
              {upsert: true,new:true},
              function(err,dbRes){
                if(err) console.log(err);
                console.log(dbRes);
                res.json({success:true,
                  type: 'upvote',
                  data: dbRes
                });
              }
            )
          }
          else if(type === 'true'){
            User.findOneAndUpdate(
              {_id: user.id},
              { $pull: { 'likes': photoId } },
              {new:true},
              function(err,dbRes){
                if(err) console.log(err);
                console.log(dbRes);
              }
            )
            Photo.findOneAndUpdate(
              {
                _id: photoId,
              },
              {
                $inc: {'likes.num': -1},
                $pull: {'likes.users': user.id}
              },
              {upsert: true,new:true},
              function(err,dbRes){
                console.log(dbRes);
                if(err) console.log(err);
                res.json({success:true,
                  type: 'downvote',
                  data: dbRes
                });
              }
            )
          } else {
            console.log('else up in this bitch');
          }
        }
      }
    );
  }
}
module.exports = functions;