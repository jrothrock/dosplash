import express = require('express');
import path = require('path');
var config = require('../server/config/database');
var morgan = require('morgan');
var app = express();
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors')
var port: number = process.env.PORT || 3000;



mongoose.connect(config.database);
mongoose.connection.on('open', function () {
 
    console.error('mongo is open');
    var app = express();
    app.use(cors());
    app.use(cors());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());
 	app.use('/app', express.static(path.resolve(__dirname, 'app')));
	app.use('/vendor', express.static(path.resolve(__dirname, 'vendor')));
	var photos = require('../server/routes/photos.js')(app);
	var users = require('../server/routes/users.js')(app);

    app.listen(3000, function (err) {
    console.log('This express app is listening on port: 3000');
    });
 
});
