var _ = require('lodash');
var Photo = require('../models/photo.js');
var path = require('path');



module.exports = function(app) {

	app.get('/photos', function (req, res) {
		res.json({info: 'it worked'});
	});


	app.get('/*', function(req,res) {
		res.sendFile(path.resolve('client/index.html'));
	});

}