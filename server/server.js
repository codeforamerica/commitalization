var io = require('socket.io');
var express = require('express');
var path = require('path');
var fs = require('fs');
var form = require('connect-form');

// Configure express server
var app = require('express').createServer();
var templates = path.normalize(__dirname + '/../client');
app.configure(function() {
    app.use(app.router);
    app.use(express.bodyParser());
    app.use(form({ keepExtensions: true }));
    app.use(express.static(templates));
});

// Client server
app.get('/', function(req, res) {
    var t = t || fs.readFileSync(templates + '/client.html', 'utf-8');
    res.send(t);
});

// Start it up
app.listen(9955);
console.log('HTTP Client Listening on http://localhost:9955');

// Socket listener
var socket = io.listen(app);
socket.on('connection', function(client) {
    console.log('socket connected');
    client.on('message', function(message) { 
        console.log('receiving message');
        console.log(message); 
    }); 
    client.on('disconnect', function() {
        console.log('socket disconnect');
    });
    
    // Commit post listener
    app.post('/committed', parseForm(), function(req, res) {
        console.log('posted');
        client.send(req.params.fields);
        res.send('');
    });
});
console.log('Server side socket started.');

// Middleware for form handling
var parseForm = function() {
    return function(req, res, next) {
        req.params = req.params || {};
        if (req.form) {
            // Do something when parsing is finished
            // and respond, or respond immediately
            // and work with the files.
            req.form.onComplete = function(err, fields, files) {
                req.params.fields = fields;
                next();
            };
        } else {
            req.params.fields = req.params.fields || {};
            next();
        }
    
    }
};