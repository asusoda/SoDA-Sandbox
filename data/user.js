'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

const SALT_WORK_FACTOR = 10;

var UserSchema = new mongoose.Schema({
    username: { type: String, required: true, index: { unique: true } },
    studentId: { type: String, required: true },
    passwordHash: { type: String, required: true },
    approved: { type: Boolean, required: true, default: false }
});

UserSchema.set('collection', 'sandbox_users');

UserSchema.methods.setPassword = function(password) {
    var salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
    this.passwordHash = bcrypt.hashSync(password, salt);
};

UserSchema.methods.comparePassword = function(candidatePassword) {
    return bcrypt.compareSync(candidatePassword, this.passwordHash);
}

module.exports = UserSchema;
