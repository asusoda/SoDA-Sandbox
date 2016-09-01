'use strict';

var express = require('express');
var router = express.Router();
var models = require('../data');
var User = models.User;

const whitespace_regex = /\s/;
const password_regex = /^[a-zA-Z\d!@#\$%\^&\*\(\)]{8,}$/

const validate_password = (password) => password.search(password_regex) !== -1;

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Home' });
});

router.get('/login', (req, res, next) => {
    res.render('login', { title: 'Log In' });
});

router.post('/login', (req, res, next) => {
    res.render('login', { title: 'Log In' });
});

router.get('/sign_up', (req, res, next) => {
    res.render('sign_up', { title: 'Sign Up' });
});

router.post('/sign_up', (req, res, next) => {
    var username = req.body.username.trim(),
        password = req.body.password,
        password_confirm = req.body.password_confirm,
        errors = [];

    var is_password_valid = validate_password(password);

    if (!username) {
        errors.push('Username must not be blank');
    }

    if (!password) {
        errors.push('Password must not be blank');
    }

    else if (!is_password_valid) {
        errors.push('Password does not meet requirements!');
    }

    if (!password_confirm) {
        errors.push('Confirm Password must not be blank');
    }

    else if (password !== password_confirm) {
        errors.push('Passwords do not match!');
    }

    if (errors.length) {
        res.status = 401;
        res.render('sign_up', { title: 'Sign Up', errors: errors });
    }

    else {
        User.findOne({ username: username }, function(err, user) {
            if (err) {
                throw err;
            }
            else if (user) {
                res.status = 401;
                res.render('sign_up', { title: 'Sign Up', errors: ['Username already exists'] });
            }
            else {
                var newUser = new User({ username: username });
                newUser.setPassword(password);
                newUser.save(function (err) {
                    if (err) {
                        next(err, req, res, null);
                    }
                    else {
                        res.send('OK');
                    }
                });
            }
        })
    }
});

module.exports = router;
