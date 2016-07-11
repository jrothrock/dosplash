var _ = require('lodash');
var Photo = require('../models/photo.js');
var path = require('path');
var multer = require("multer");


module.exports = function(app) {

	app.get('/api/photos', function (req, res) {
		res.json({info: 'it worked'});
	});

	app.post("/api/upload", multer({dest: "./uploads/"}).array("uploads[]", 12), function(req, res) {
    	res.send(req.files);
	});

	app.get('/*', function(req,res) {
		res.sendFile(path.resolve('client/index.html'));
	});

}