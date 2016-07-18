var _ = require('lodash');
var express = require('express');
var authActions = require('../methods/auth.actions');
var exec = require('child_process').exec;
var User = require('../models/user');
var Photo = require('../models/photo');
var config = require('../config/database');
var jwt = require('jsonwebtoken');

module.exports = function(app) {

	app.post('/auth/login', authActions.authenticate);

	app.post('/auth/adduser', authActions.addNew);

	app.post('/auth/logout', authActions.logOut);

	//some semi serious call back hell. Will move later.	
	//this post is really a get - will be changed later.
	app.post('/api/user', function (req, res){
		var currentuserId = false;
    	if(req.headers.authorization.split(' ')[1]){
      		var token = req.headers.authorization.split(' ')[1];
      		currentuserId = jwt.decode(token, config.secret);
    	}
		var photoType = req.headers.type;
		console.log(photoType);
		User.findOne({username: req.headers.username}, function(err, user) {
			console.log(user);
			var photosSet = [];
			if(photoType === 'photos'){ user.photoType = user.photos } else { user.photoType = user.likes }
			if(user.photoType.length){
				for(var i = 0; i < user.photos.length;i++){
					Photo.findById(user.photos[i], function(err, photo){
						console.log(photo);
						var thisphoto = []
						thisphoto.push(photo.user);
						var data = { data: new Buffer(photo.img.data).toString('base64')}
						thisphoto.push(data);
						console.log(thisphoto);
						thisphoto.push(photo.likes.num);
						thisphoto.push(photo.id);
						if(photo.likes.users.indexOf(currentuserId.key) !== -1){ thisphoto.push(true);}
						photosSet.push(thisphoto);
						console.log("photos " + photosSet + " photos");
						console.log(i);
						console.log(user.photos.length);
						if(photosSet.length === (user.photos.length)){
							res.send({
								firstname: user.firstname,
								lastname: user.lastname,
								username: user.username,
								email: user.email,
								website: user.website,
                                location: user.location,
                                bio: user.bio,
                                photosLength: user.photos.length,
                                likesLength: user.likes.length,
								photos: photosSet
							})
						}
				    })
				};
			}
			else{
				res.send({
					firstname: user.firstname,
					lastname: user.lastname,
					username: user.username,
					email: user.email,
					website: user.website,
                    location: user.location,
                    bio: user.bio,
                    photosLength: user.photos.length,
                    likesLength: user.likes.length,
					photos: false
				})
			}
		});
	});

	app.post('/api/userInfo', function (req,res){
		console.log(req.body.website);
        console.log(req.body.location);
        console.log(req.body.bio);
		var token = req.headers.authorization.split(' ')[1];
		var userId = jwt.decode(token, config.secret);
		console.log(userId);
		var user = User.findOneAndUpdate(
            {_id: userId.key},
            { $set: { website : req.body.website, location : req.body.location, bio: req.body.bio}},
            {new: true},
            function(err, doc){
            	if(err) console.log(err);

            	res.send({
            		success:true,
            		username: doc.username,
            	})
            }
        );
    })
};
