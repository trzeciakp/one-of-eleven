var app = angular.module('app', [
	'ngRoute',
	'btford.socket-io'
]);

app
	.config(routeConfig)
	.factory('socket', function (socketFactory) { return socketFactory(); })
	.controller('AppCtrl', AppCtrl)
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

HomeCtrl.$inject = ['$scope', 'socket'];

function HomeCtrl($scope, socket) {
	$scope.message = '';

	socket.on('hello', function (data) {
		$scope.message = data.msg;
	})
}