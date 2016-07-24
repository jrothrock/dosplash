var _ = require('lodash');
var express = require('express');
var authController = require('../controllers/auth.controller');
var userController = require('../controllers/user.controller');


module.exports = function(app) {

	app.post('/auth/login', authController.authenticate);

	app.post('/auth/adduser', authController.addNew);

	app.post('/auth/logout', authController.logOut);

	app.post('/api/user/info', userController.getInfo); //is really a get, but due to the /* in routes/photos, it needs to be a post.

	app.post('/api/user/photos', userController.getPhotos); //is really a get, but due to the /* in routes/photos, it needs to be a post.

	app.post('/api/userInfo', userController.updateProfile);
};
