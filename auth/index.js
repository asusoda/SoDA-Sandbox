const sessionSecret = 'change me when deployed';

var CryptoJS = require('crypto-js');

function generateSessionID(username) {
    return generateSessionIdWithTimestamp(username, new Date().getTime());
}

function generateSessionIdWithTimestamp(username, timestamp) {
    var payload = username + ':' + timestamp;
    return payload + ':' + CryptoJS.HmacSHA256(payload, sessionSecret).toString(CryptoJS.enc.Hex);
}

function verifySessionID(username, sessionID) {
    var components = sessionID.split(':');
    if (components.length !== 3) {
        return false;
    }
    else {
        return generateSessionIdWithTimestamp(components[0], components[1]) === sessionID;
    }
}

module.exports.generateSessionID = generateSessionID;
module.exports.verifySessionID = verifySessionID;
