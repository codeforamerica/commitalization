var io = require('socket.io');
var express = require('express');
var path = require('path');
var fs = require('fs');
var committer = require('./committer').committer;
var commitPoster = new committer;
var port = 8080;

// Configure express server
var app = express.createServer();
var templates = path.normalize(__dirname + '/../client');
app.configure(function() {
    app.use(app.router);
    app.use(express.static(templates));
});

// Client side
exports.client = function() {
    // Client server
    app.get('/', function(req, res) {
        var t = t || fs.readFileSync(templates + '/client.html', 'utf-8');
        res.send(t);
    });

    // Commit post listener
    app.post('/committed', express.bodyParser(), function(req, res) {
        var data = req.body = req.body || {};
        var response = {};

        // Parse body given the input from GitHub
        if (data.payload && typeof data.payload == 'string') {
            data = JSON.parse(data.payload);
        }

        // Handle commit
        var valid = commitPoster.emitCommit(data);
        if (valid) {
            response = { 'request': 'OK' };
        }
        else {
            response = { 'request': 'BAD', 'error': 'Not a valid commit' };
        }
        res.send(response, 200);
    });
    
    // Start it up
    app.listen(port);
    console.log('HTTP Client Listening on http://localhost:' + port);
}

// Server side handling
exports.server = function() {
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
        
        commitPoster.on('committed', function(data) {
            client.send(data);
        });
        
        // Let's send the commits we have in memory
        var commits = commitPoster.getCommits();
        if (commits) {
            for (var i = 0; i < commits.length; i++) {
                client.send(commits[i]);
            }
        }
    });
    console.log('Server side socket started.');
}

// Middleware for form handling
exports.parseForm = function() {
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

// Start it off.
exports.server();
exports.client();