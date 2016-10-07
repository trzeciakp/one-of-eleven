var players = [{
	photo: 'img/pazdan.jpg',
	name: 'Michał',
	score: '2',
	lifes: 3
},{
	photo: 'img/micek.jpg',
	name: 'Wojciech',
	score: '1',
	lifes: 3
},{
	photo: 'img/papiez.jpg',
	name: 'Karol',
	score: '3',
	lifes: 3
}];

var _ = require('lodash');

module.exports = function(io) {
	io.on('connection', function (socket) {
		emitPlayers();

		socket.on('addPoints', function(data) {
			var foundPlayer = _.find(players, ['name', data.name]);
			foundPlayer.score = (Number(foundPlayer.score) + data.points) + '';
			emitPlayers();
		});

		socket.on('removeLife', function(data) {
			var foundPlayer = _.find(players, ['name', data.name]);
			foundPlayer.lifes -= 1;
			emitPlayers();
		});

		socket.on('resetPlayers', function(data) {
			players.map(function(player) {
				player.lifes = 3;
				player.score = getRandomInt(1,3) + '';
			});
			emitPlayers();
		});

		function getRandomInt(min, max) {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		}

		function emitPlayers() {
			io.emit('playersUpdate', {
				players: players
			})
		}
	});
};