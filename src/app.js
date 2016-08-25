var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var pty = require('pty.js');

var routes = require('./routes/index');

var app = express();

var expressWs = require('express-ws')(app);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

var terminals = {},
    logs = {}

app.post('/terminals', function(req, res) {
    var cols = parseInt(req.query.cols);
    var rows = parseInt(req.query.rows);
    var username = req.query.username;
    term = pty.spawn('bash', [], {
        name: 'xterm-color',
        cols: cols || 80,
        rows: rows || 24,
        cwd: process.env.PWD,
        env: process.env
    });

    console.log('Created new terminal with pid: ' + term.pid);
    terminals[term.pid] = term;
    logs[term.pid] = '';
    term.on('data', function(data) {
        logs[term.pid] += data;
    });
    res.send(term.pid.toString());
    res.end();
});

app.post('/terminals/:pid/size', function(req, res) {
    var pid = parseInt(req.params.pid);
    var cols = parseInt(req.query.cols);
    var rows = parseInt(req.query.rows);
    term = terminals[pid];
    term.resize(cols, rows);
    console.log('Resized terminal with pid ' + pid + ' to ' + cols + ' x ' + rows)
    res.end();
});

app.ws('/terminals/:pid', function(ws, req) {
    var term = terminals[parseInt(req.params.pid)];
    console.log('Connected to terminal ' + term.pid);
    ws.send(logs[term.pid]);

    term.on('data', function(data) {
        try {
            ws.send(data);
        } catch (ex) {
            // The WebSocket is not open, ignore
        }
    });
    ws.on('message', function(msg) {
        term.write(msg);
    });
    ws.on('close', function() {
        process.kill(term.pid);
        console.log('Closed terminal ' + term.pid);
        // Clean things up
        delete terminals[term.pid];
        delete logs[term.pid];
    });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
