import express = require('express');
import path = require('path');
var port: number = process.env.PORT || 3000;
var app = express();

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/dosplash');

app.use('/app', express.static(path.resolve(__dirname, 'app')));
app.use('/vendor', express.static(path.resolve(__dirname, 'vendor')));


var photos = require('../server/routes/photos.js')(app);


var server = app.listen(port, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('This express app is listening on port:' + port);
});