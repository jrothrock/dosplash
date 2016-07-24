var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('./user');

var PhotoSchema = mongoose.Schema({
    name: {
        type: String
    },
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
	},
	created_at: {
		type: Date
	}
});

PhotoSchema.pre('save', function (next) {
    this.created_at = new Date();
    next();
});

module.exports = mongoose.model('Photo', PhotoSchema);