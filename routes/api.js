var express = require('express')
var router = express.Router();

/* Reflect API version */
router.get('/', function(req, res, next) {
    res.send('Version: 0.1.0');
});

router.get('/tree', function(req, res, next) {
    res.send(req.body);
});

module.exports = router;
