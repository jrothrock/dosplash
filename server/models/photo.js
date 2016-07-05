var mongoose = require('mongoose');

var photoSchema = mongoose.Schema({

    name: String

});

module.exports = mongoose.model('Photo', photoSchema);