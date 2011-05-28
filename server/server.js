var io = require('socket.io');
var express = require('express');
var path = require('path');
var fs = require('fs');

// Configure express server
var app = require('express').createServer();
var templates = path.normalize(__dirname + '/../client');
app.configure(function() {
    app.use(app.router);
});
app.use(express.static(templates));

// Commit post listener
app.post('/commited', function(req, res) {
    console.log('posted');
});

// Client server
app.get('/', function(req, res) {
    var t = t || fs.readFileSync(templates + '/client.html', 'utf-8');
    res.send(t);
});
app.listen(9955);
console.log('HTTP Client Listening on http://localhost:9955');

// Socket listener
var socket = io.listen(app); 
socket.on('connection', function(client) {
console.log('connected');

    client.on('message', function() { 
        console.log('message'); 
    }); 
    client.on('disconnect', function() {
        console.log('disconnect');
    }); 
}); 
console.log('Server side socket started.');