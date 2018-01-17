const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
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