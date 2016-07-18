var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('./user');

var photoSchema = mongoose.Schema({

    img: { 
    		data: Buffer, 
    		contentType: String 
    },
    likes: { 
    		num: { 
	    		type: Number, 
	    		default: 0 
    	    },
    	    users: [{ 
            type: Schema.Types.ObjectId, 
            ref: 'User' 
    		}]
    },
    user : { 
    		data: {
    			 firstname: String,
    			 lastname: String,
    			 email: String,
    			 username: String,
    			 user_id: Schema.Types.ObjectId
		  	}
	}
});

module.exports = mongoose.model('Photo', photoSchema);