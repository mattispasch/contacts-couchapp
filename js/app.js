var contactsApp = angular.module('contactsApp', [ 'ngRoute',
		'contactsControllers' ]);

contactsApp.config([ '$routeProvider', function($routeProvider) {
	$routeProvider.when('/list', {
		templateUrl : 'partials/list.html',
		controller : 'ListCtrl'
	}).when('/detail/:contactId', {
		templateUrl : 'partials/detail.html',
		controller : 'DetailCtrl'
	}).when('/edit/:contactId', {
		templateUrl : 'partials/edit.html',
		controller : 'EditCtrl'
	}).otherwise({
		redirectTo : '/list'
	});
} ]);