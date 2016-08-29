'use strict';

function index(req, res) {
    res.render('index', {
        name: 'John'
    });
};

module.exports = index;
