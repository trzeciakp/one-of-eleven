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

function PlayerStand() {
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
		}
	}
}

HomeCtrl.$inject = ['$scope', 'socket'];

function HomeCtrl($scope, socket) {
	$scope.message = '';

	$scope.players = [{
		photo: 'img/pazdan.jpg',
		name: 'Michał',
		score: '41',
		lifes: 3
	},{
		photo: 'img/micek.jpg',
		name: 'Wojciech',
		score: '11',
		lifes: 2
	},{
		photo: 'img/papiez.jpg',
		name: 'Karol',
		score: '93',
		lifes: 1
	}];

	socket.on('hello', function (data) {
		$scope.message = data.msg;
	})
}