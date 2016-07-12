var User = require('../models/user');
var config = require('../config/database');
var jwt = require('jsonwebtoken');

var functions = {
    authenticate: function(req, res) {
        User.findOne({
            email: req.body.email
        }, function(err, user){
            console.log(user);
            if (err) throw err;
            
            if(!user) {
                res.send({success: false, "message": 'Authentication failed, User not found'});
            }
            
           else {
                user.comparePassword(req.body.password, function(err, isMatch){
                    if(isMatch && !err) {
                        console.log(isMatch);
                        user.token = undefined;
                        user.password = undefined;
                        console.log("Create token with user id", user._id);
                        var token = jwt.sign({key:user._id}, config.secret, 
                                {
                                    expiresIn: config.jwtExpiry // Taken from config.js and made available in index.js
                                }
                        );
                        user.token = token;
                        user.password = req.body.password;
                        user.save(function (err, dbRes) {
                            dbRes.password = undefined;
                            dbRes.token = undefined;
                            res.json({
                                success: true,
                                message: 'Authenticated user.',
                                data: {
                                    user: dbRes.email,
                                    token: token
                                }
                            });
                        });

                    } else {
                        return res.send({success: false, "message": 'Authenticaton failed, wrong password.'});
                    }
                });
            }
            
        });
    },

    addNew: function(req, res){
        if((!req.body.email) || (!req.body.username) || (!req.body.password)){
            console.log(req.body.email);
            console.log(req.body.username);
            console.log(req.body.password);
            
            res.json({success: false, msg: 'Enter all values'});
        }
        else {
            console.log(req.body.email);
            console.log(req.body.username);
            console.log(req.body.password);

            var newUser = User({
                email: req.body.email,
                username: req.body.username,
                password: req.body.password,
                token: undefined
            });
            console.log("Create token with user id", newUser._id);
            console.log(config.secret);
             console.log(config.jwtExpiry);
            var token = jwt.sign({key:newUser._id}, config.secret, 
                                {
                                    expiresIn: config.jwtExpiry // Taken from config.js and made available in index.js
                                }
            );
            newUser.token = token;
            console.log(newUser);
            newUser.save(function(err, dbRes){
                console.log(dbRes);
                if (err){
                    res.json({success:false, msg:'Failed to save'});
                }
                
                else {
                    dbRes.password = undefined;
                    dbRes.token = undefined;
                    res.json({success:true, 
                              msg:'Successfully saved',
                              data: {
                                    user: dbRes.email,
                                    token: token
                            }
                            });
                }
            });
        }
    },

    logOut: function(req,res){
        var token = req.headers && req.headers.authorization ? req.headers.authorization.split(' ')[1] : '';

        console.log(token);

        if (token) {

            jwt.verify(token, config.secret, function(err, decoded) { 
                if (err) {
                    // Things didn't go as planned, but the token's not valid so user's logged out.
                } else {
                    var userId = decoded ? decoded.key : null;
                    User.findById(userId, function(err, user){ 
                        // Does the user have this token? If so delete it.
                        if (user) {
                            user.token = undefined;
                            user.save(function (err,dbRes){
                                console.log('User\'s token deleted.');
                            });
                        }
                    });
                }
            });
        } 
        
        res.json({
            message: 'Logged Out', 
            data: {success: true}
        });
    },

    getinfo: function(req, res){
        if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            var token = req.headers.authorization.split(' ')[1];
            var decodedtoken = jwt.decode(token, config.secret);
            return res.json({success: true, msg: 'hello '+decodedtoken.name});
        }
        else {
            return res.json({success:false, msg: 'No header'});
        }
    }



    
    
};

module.exports = functions;