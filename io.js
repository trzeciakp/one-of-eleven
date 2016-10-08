var players = [{
	photo: 'img/pazdan.jpg',
	name: 'Michał',
	score: '2',
	sounds: [
		'pazdan-dieta',
		'pazdan-pomidor'
	],
	lifes: 3
},{
	photo: 'img/micek.jpg',
	name: 'Wojciech',
	score: '1',
	lifes: 3,
	sounds: [
		'muzyczne-legia'
	]
},{
	photo: 'img/papiez.jpg',
	name: 'Karol',
	score: '3',
	lifes: 3,
	sounds: [
		'papiez-intro',
		'papiez-jezus'
	]
}];

var _ = require('lodash');

module.exports = function(io) {
	io.on('connection', function (socket) {
		emitPlayers();

		socket.on('addPoints', function(data) {
			var foundPlayer = _.find(players, ['name', data.name]);
			foundPlayer.score = (Number(foundPlayer.score) + data.points) + '';
			io.emit('playSound', { name: 'success'} );
			emitPlayers();
		});

		socket.on('removeLife', function(data) {
			var foundPlayer = _.find(players, ['name', data.name]);
			foundPlayer.lifes -= 1;
			io.emit('playSound', { name: 'error'} );
			emitPlayers();
		});

		socket.on('resetPlayers', function(data) {
			players.map(function(player) {
				player.lifes = 3;
				player.score = getRandomInt(1,3) + '';
			});
			io.emit('pl;3', { name: 'start'} );
			emitPlayers();
		});

		socket.on('soundRequest', function(data) {
			io.emit('playSound', { name: data.name} );
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