var app = angular.module('app', [
	'ngRoute',
	'btford.socket-io',
	'wo.7segments'
]);

app
	.config(routeConfig)
	.factory('socket', function (socketFactory) { return socketFactory(); })
	.controller('AppCtrl', AppCtrl)
	.controller('PointControlCtrl', PointControlCtrl)
	.controller('ChooseCtrl', ChooseCtrl)
	.directive('playerStand', PlayerStand)
	.controller('HomeCtrl', HomeCtrl);

routeConfig.$inject = ['$routeProvider'];

function routeConfig($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'home-page.html',
			controller: 'HomeCtrl'
		})
		.when('/control', {
			templateUrl: 'control-page.html',
			controller: 'PointControlCtrl'
		})
		.when('/choose', {
			templateUrl: 'choose-page.html',
			controller: 'ChooseCtrl'
		})
		.otherwise('/');
}

AppCtrl.$inject = ['$scope'];

function AppCtrl($scope) {
}

PlayerStand.$inject = ['socket']

function PlayerStand(socket) {
	return {
		scope: {
			player: '=',
			readOnly: '='
		},
		templateUrl: 'player-stand.html',
		link: function(scope) {
			scope.options = {
				size: 3,
				align: 'right',
				watch: true
			};
			scope.addPoints = addPoints;
			scope.canAddPoints = canAddPoints;
			scope.removeLife = removeLife;
			scope.hasLifes = hasLifes;
			scope.play = play;

			function addPoints(points) {
				if (canAddPoints(points)) {
					socket.emit('addPoints', {
						name: scope.player.name,
						points: points
					});
				}
			}

			function canAddPoints(points) {
				return !scope.readOnly && hasLifes() && Number(scope.player.score) + points < 1000
			}

			function removeLife() {
				if (hasLifes()) {
					socket.emit('removeLife', {
						name: scope.player.name
					});
				}
			}
			function hasLifes() {
				return scope.player.lifes > 0;
			}

			function play(soundName) {
				socket.emit('soundRequest', { name: scope.player.id + '/' + soundName});
			}
		}
	}
}

HomeCtrl.$inject = ['$scope', 'socket'];
var emptyPlayer = {
	name: '',
	lifes: 3,
	score: '0'
}
function HomeCtrl($scope, socket) {
	$scope.players = [];
	$scope.name = window.localStorage.name || '';
	$scope.nameInput = '';
	$scope.isReadOnly = true;
	$scope.loading = false;

	var lastSound = null;

	var sounds = {
		success: new Audio('audio/success.mp3'),
		error: new Audio('audio/102-fixed.mp3'),
		start: new Audio('audio/100.mp3'),
		choose: new Audio('audio/zglaszanie.mp3')

	};

	$scope.updateName = function() {
		var newName = $scope.nameInput
		$scope.name = newName;
		window.localStorage.name = newName
		socket.emit('newPlayer', { name: newName});
	}

	$scope.player = function() {
		var found = _.find($scope.players, ['name', $scope.name]);
		return found ? found : emptyPlayer
	}

	socket.on('playersUpdate', function (data) {
		$scope.players = data.players;
	});

	socket.on('playSound', function(data) {
		var sound = sounds[data.name];
		if (sound === undefined) {
			sound = new Audio('audio/' + data.name + '.mp3')
			if (lastSound != null) {
				lastSound.pause();
			}
			lastSound = sound;
		}
		sound.play();
	});
}

ChooseCtrl.$inject = ['$scope', 'socket'];

function ChooseCtrl($scope, socket) {
	$scope.play = play;

	function play() {
		socket.emit('soundRequest', { name: 'choose'});
	}
}

PointControlCtrl.$inject = ['$scope', 'socket'];

function PointControlCtrl($scope, socket) {
	$scope.players = [];
	$scope.isReadOnly = false;

	$scope.resetPlayers = resetPlayers;

	socket.on('playersUpdate', function (data) {
		$scope.players = data.players;
	});

	function resetPlayers() {
		socket.emit('resetPlayers', {});
	}
}