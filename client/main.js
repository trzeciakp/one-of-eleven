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

			function addPoints() {
				if (canAddPoints()) {
					socket.emit('addPoints', {
						name: scope.player.name,
						points: 10
					});
				}
			}

			function playSuccessAudio() {
				var audio = new Audio('audio/101.mp3');
				audio.play();
			}

			function playErrorAudio() {
				var audio = new Audio('audio/102.mp3');
				audio.play();
			}

			function canAddPoints() {
				return !scope.readOnly && hasLifes() && Number(scope.player.score) + 10 < 1000
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

			socket.on('pointsAdded', function() {
				if (scope.readOnly) {
					playSuccessAudio();
				}
			});

			socket.on('lifeRemoved', function() {
				if (scope.readOnly) {
					playErrorAudio();
				}
			});
		}
	}
}

HomeCtrl.$inject = ['$scope', 'socket'];

function HomeCtrl($scope, socket) {
	$scope.players = [];
	$scope.isReadOnly = true;

	socket.on('playersUpdate', function (data) {
		$scope.players = data.players;
	});
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