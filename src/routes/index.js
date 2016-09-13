'use strict';

const Promise = require('bluebird');
const express = require('express');
const router = express.Router();
const models = require('../data');
const auth = require('../auth');
const request = require('request');
Promise.promisifyAll(request);
const User = models.User;

const whitespace_regex = /\s/;
const password_regex = /^[a-zA-Z\d!@#\$%\^&\*\(\)]{8,}$/

const validate_password = (password) => password.search(password_regex) !== -1;

/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('index', {
        title: 'Home'
    });
});

router.get('/login', (req, res, next) => {
    if (req.session.username && req.session.sessionID && auth.verifySessionID(req.session.username, req.session.sessionID)) {
        res.redirect('/')
    }
    else {
        res.render('login', {
            title: 'Log In'
        });
    }
});

router.post('/login', (req, res, next) => {
    var username = req.body.username.trim(),
        password = req.body.password,
        errors = [];

    if (!username) {
        errors.push('Username must not be blank');
    }

    if (!password) {
        errors.push('Password must not be blank');
    }

    if (errors.length) {
        res.status(401).render('login', {
            title: 'Log In',
            errors: errors
        });
    }
    else {
        User.findOne({ username: username })
            .then((user) => {
                if (user) {
                    return user.comparePassword(password);
                }
                else {
                    var err = new Error('User not found');
                    err.status = 401;
                    throw err;
                }
            })
            .then((result) => {
                res.send(result);
            })
            .catch((err) => {
                next(err, req, res, null);
            });
    }
});

router.get('/logout', (req, res, next) => {
    req.session = null;
    res.redirect('/');
});

router.get('/sign_up', (req, res, next) => {
    if (req.session.username && req.session.sessionID && auth.verifySessionID(req.session.username, req.session.sessionID)) {
        res.redirect('/');
    }
    else {
        res.render('sign_up', {
            title: 'Sign Up'
        });
    }
});

router.post('/sign_up', (req, res, next) => {
    var username = req.body.username.trim(),
        password = req.body.password,
        password_confirm = req.body.password_confirm,
        email = req.body.email.trim(),
        errors = [];

    var is_password_valid = validate_password(password);

    if (!email) {
        errors.push('Email must not be blank');
    }

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
        res.render('sign_up', {
            title: 'Sign Up',
            errors: errors
        });
    }

    else {
        User.findOne({ $or: [{username: username}, {emailAddress: email}] })
            .then((user) => {
                if (user) {
                    throw new Error('Username or email already exists');
                }
                else {
                    var newUser = new User({ username: username, emailAddress: email });
                    return newUser.setPassword(password);
                }
            })
            .then((user) => {
                return user.save();
            })
            .then((user) => {
                req.session.username = username;
                req.session.sessionID = auth.generateSessionID(username);
                res.redirect('/');
            })
            .catch((err) => {
                next(err, req, res, null);
            });
    }
});

module.exports = router;
