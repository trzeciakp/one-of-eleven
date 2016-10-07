var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var serveStatic = require('serve-static');

app.use(serveStatic(__dirname + '/client'));

require('./io')(io);

var port = process.env.PORT || 3000;
http.listen(port, function () {
	console.log('listening on *:' + port);
});