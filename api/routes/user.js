const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

router.post('/signup',(req, res, next) => {
    if(req.body.email && req.body.password) {
        console.log('signup', req.body.email , req.body.password);
        bcrypt.hash(req.body.password, 10, (err, hash) => {
            // Store hash in your password DB.
            if(!err) {
                console.log('hash',hash);

                const newUser = new User({
                    _id: new mongoose.Types.ObjectId(),
                    email: req.body.email,
                    password: hash
                });

                newUser.save().
                then((result) => {
                    if(result) {
                        res.status(201).json({
                            message : 'User created',
                            user: newUser
                        });
                    } else {
                        res.status(501).json({
                            message : 'User not created'
                        });
                    }
                }).
                catch((err) => {
                    res.status(500).json({
                        error: {
                            message : 'Db error during insert'
                        }
                    });
                });
            } else {
                res.status(500).json({
                    error: {
                        message : 'Password hash generation error'
                    }
                });
            }
        });

    } else {
        res.status(500).json({
            error: {
                message : 'Required params are not there'
            }
        });
    }
});

router.get('/:userId',(req, res, next) => {
    User.findById(req.params.userId).exec().
    then((result) => {
        res.status(200).json({
            message: `user with id ${req.params.userId}`,
            result: result
        });
    }).catch(err => {console.log(err);
        res.status(500).json({
            message: 'error occured during user fetch'
        })
    });
    
});

router.post('/login',(req, res, next) => {
    User.findOne({email:req.body.email}).exec().
    then((result) => {

        //Get the password from res and compare it with user sign in password
        if(result) {
            bcrypt.compare(req.body.password, result.password, (err, cRes) => {
                if(err) {
                    return res.status(500).json({
                        error: {
                            message: 'Auth Failed'
                        }
                    })
                    next();
                }

                if(cRes === true) {
                    const token = jwt.sign(
                        {
                            email: req.body.email,
                            id: result._id
                        },
                        process.env.SECRET_KEY,
                        {
                            expiresIn : "1h"
                        });

                    return res.status(200).json({
                        message: `user exists`,
                        token: token
                    });
                    next();
                } 
                res.status(500).json({
                    error: {
                        message: 'Auth Failed'
                    }
                })

            });
        } else {
            res.status(500).json({
                error: {
                    message: 'Auth Failed'
                }
            })
        }
    }).catch(err => {
        res.status(500).json({
            error: {
                message: 'Auth Failed'
            }
        })
    });
    
});

router.delete('/delete/:userId', (req, res, next) => {
    if(req.params.userId) {
        User.remove({
            _id: req.params.userId
        }).
        then((result) => {
            res.status(200).json({
                message: `Removed user`
            });
        }).
        catch((error) => {
            res.status(500).json({
                message: 'error occured during user delete'
            })
        });
    
    }
});

module.exports = router;