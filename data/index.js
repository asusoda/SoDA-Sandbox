'use strict';

var mongoose = require('mongoose');

const dbURI = 'mongodb://localhost/sandbox';

mongoose.Promise = global.Promise;
mongoose.connect(dbURI);
var dbConnection = mongoose.connection;

var models = {};

models.User = dbConnection.model('User', require('./user'));

module.exports = models;
