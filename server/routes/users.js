var _ = require('lodash');
var express = require('express');
var actions = require('../methods/actions');

module.exports = function(app) {

	app.post('/auth/login', actions.authenticate);

	app.post('/auth/adduser', actions.addNew);

	app.post('/auth/logout', actions.logOut);

	app.get('/api/getinfo', actions.getinfo);

};
