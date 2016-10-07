var app = angular.module('app', [
	'ngRoute',
	'btford.socket-io',
	'wo.7segments'
]);

app
	.config(routeConfig)
	.factory('socket', function (socketFactory) { return socketFactory(); })
	.controller('AppCtrl', AppCtrl)
	.directive('playerStand', PlayerStand)
	.controller('HomeCtrl', HomeCtrl);

routeConfig.$inject = ['$routeProvider'];

function routeConfig($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'home-page.html',
			controller: 'HomeCtrl'
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
			player: '='
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
					})
				}
			}

			function canAddPoints() {
				return hasLifes() && Number(scope.player.score) + 10 < 1000
			}

			function removeLife() {
				if (hasLifes()) {
					socket.emit('removeLife', {
						name: scope.player.name
					});

					console.log('life removed')
				}
			}
			function hasLifes() {
				return scope.player.lifes > 0;
			}
		}
	}
}

HomeCtrl.$inject = ['$scope', 'socket'];

function HomeCtrl($scope, socket) {
	$scope.message = '';

	$scope.players = [];

	$scope.resetPlayers = resetPlayers;

	socket.on('hello', function (data) {
		$scope.message = data.msg;
	});

	socket.on('playersUpdate', function (data) {
		$scope.players = data.players;
	})

	function resetPlayers() {
		socket.emit('resetPlayers', {});
	}
}