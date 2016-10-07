module.exports = function(io) {
	io.on('connection', function (socket) {
		io.emit('hello', { msg: 'hello world'})
	});
};