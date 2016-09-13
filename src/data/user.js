'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

const SALT_WORK_FACTOR = 10;

var UserSchema = new mongoose.Schema({
    username: { type: String, required: true, index: true, unique: true },
    passwordHash: { type: String, required: true },
    approved: { type: Boolean, required: true, default: false },
    emailAddress: { type: String, requires: true, index: true,  unique: true }
});

UserSchema.set('collection', 'sandbox_users');

// UserSchema.methods.setPassword = function(password) {
//     var salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
//     this.passwordHash = bcrypt.hashSync(password, salt);
// };

UserSchema.methods.setPassword = function(password) {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(10, (err, result) => {
            if (err) {
                return reject(err);
            }
            bcrypt.hash(password, result, (err, result) => {
                if (err) {
                    return reject(err);
                }
                else {
                    this.passwordHash = result;
                    return resolve(this);
                }
            });
        });
    });
}

// UserSchema.methods.comparePassword = function(candidatePassword) {
//     return bcrypt.compareSync(candidatePassword, this.passwordHash);
// }

UserSchema.methods.comparePassword = function(candidatePassword) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, this.passwordHash, (err, result) => {
            if (err) {
                return reject(err);
            }
            else {
                return resolve(result);
            }
        });
    });

}

module.exports = UserSchema;
