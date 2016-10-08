var players = [{
	photo: 'img/pazdan.jpg',
	name: 'Michał',
	id: 'pazdan',
	score: '2',
	sounds: [
		'intro',
		'dieta',
		'pomidor'
	],
	lifes: 3
},{
	photo: 'img/micek.jpg',
	id: 'micek',
	name: 'Wojciech',
	score: '1',
	lifes: 3,
	sounds: [
		'muzyczne-legia'
	]
},{
	photo: 'img/papiez2.jpg',
	name: 'Karol',
	id: 'papiez',
	score: '3',
	lifes: 3,
	sounds: [
		'jan-Paweł-Drugi-Papież',
		'intro',
		'co',
		'noo',
		'bardzo',
		'a-można-jak-najbardziej,-jeszcze-jak',
		'ja-już-nie-pamiętam-tak-dokładnie',
		'taki-ciężki',
		'no-jak-Pan-Jezus-powiedział',
		'a-co-mam-zmieniać',
		'po-co-mam-wybierać,-najlepiej-zabrać-obie',
		'jest-możliwe',
		'ja-tehaz',
		'okrutnik',
		'a-to-ja-nie-wiem,-to-które-jem',
		'poszukajcie',
		'bądźmy-łagodni',
		'może-tak-kiedy-jak-mi-dali',
		'szpinak',
		'co-mam-robić-Nie-mogę-powiedzieć-żebym-ich-nie-lubiał',
		'tak-jak-Pan-Jezus-powiedział',
		'co-mam-robić',
		'nie,-bo-mi-nie-pokazali',
		'tak...-Czasem-żeśmy-się-nawet-bili',
		'nie-dali-mi-nigdy',
		'dziewczynki-z-warkoczykami',
		'niech-zstąpi-duch-Twój',
		'marysia',
		'tam-była-cukiernia,-po-maturze-chodziliśmy-na-kremówki'
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
			io.emit('playSound', { name: 'start'} );
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