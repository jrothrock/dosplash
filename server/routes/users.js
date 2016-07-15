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

	app.get('/api/getinfo', authActions.getinfo);

	//some semi serious call back hell. Will move later.	
	//this post is really a get - will be changed later.
	app.post('/api/user', function (req, res){
		User.findOne({username: req.headers.username}, function(err, user) {
			console.log(user);
			var photosSet = [];
			if(user.photos.length){
				for(var i = 0; i < user.photos.length;i++){
					Photo.findById(user.photos[i], function(err, photo){
						console.log(photo);
						var buff = new Buffer(photo.img.data).toString('base64');
						console.log(buff);
						photosSet.push(buff);
						console.log("photos " + photosSet + " photos");
						console.log(i);
						console.log(user.photos.length);
						if(photosSet.length == (user.photos.length)){
							res.send({
								firstname: user.firstname,
								lastname: user.lastname,
								username: user.username,
								email: user.email,
								website: user.website,
                                location: user.location,
                                bio: user.bio,
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
            userId.key,
            { $set: { website : req.body.website, location : req.body.location, bio: req.body.bio}},
            {returnNewDocument: true},
            function(err, doc){
            	if(err) {console.log(err)}

            	res.send({
            		success:true,
            		username: doc.username,
            	})
            }
        );
    })
};
