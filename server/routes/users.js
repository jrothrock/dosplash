var _ = require('lodash');
var express = require('express');
var authActions = require('../methods/auth.actions');

module.exports = function(app) {

	app.post('/auth/login', authActions.authenticate);

	app.post('/auth/adduser', authActions.addNew);

	app.post('/auth/logout', authActions.logOut);

	app.get('/api/getinfo', authActions.getinfo);

};
