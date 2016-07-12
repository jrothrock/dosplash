var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var photoSchema = mongoose.Schema({

    img: { data: Buffer, contentType: String },

});

module.exports = mongoose.model('Photo', photoSchema);