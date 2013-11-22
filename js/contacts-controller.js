var contactsControllers = angular.module('contactsControllers', []);

contactsControllers.controller('ListCtrl', [ '$scope', '$http',

function ListCtrl($scope, $http) {

	var url = "_view/all";

	$scope.contacts = {};

	$http.get(url).success(function(data) {
		$scope.contacts = data.rows;
	});

	// $scope.showContact = function(id) {
	//
	// };

} ]);

contactsControllers.controller('DetailCtrl', [ '$scope', '$http', '$routeParams', '$location',

function DetailCtrl($scope, $http, $routeParams, $location) {

	var id = $routeParams.contactId;

	var url = "/contacts/" + id;

	$http.get(url).success(function(data) {
		$scope.contact = data;
	});

	// ACTIONS
	$scope.deleteContact = function() {
		var deleteURL = url + "?rev=" + $scope.contact._rev;
		$http({
			url : deleteURL,
			method : "DELETE"
		}).success(function(status) {
			alert("L&ouml;schen erfolgreich: " + JSON.stringify(status));
			$location.path("/list");
		}).error(function(status) {
			alert("Fehler beim Löschen: " + JSON.stringify(status));
		});
	};

} ]);

contactsControllers.controller('EditCtrl', [ '$scope', '$http', '$routeParams', '$location',

function EditCtrl($scope, $http, $routeParams, $location) {

	const
	DB_NAME = "contacts";

	var id = $routeParams.contactId;

	if (id === undefined) {
		// new contact
		var id = generateUUID();
		$scope.contact = {
			"_id" : id,
			type : "contact"
		};
		$scope.url = "/" + DB_NAME + "/" + id;
	} else {
		// edit existing contact
		$scope.url = "/" + DB_NAME + "/" + id;
		$http.get($scope.url).success(function(data) {
			$scope.contact = data;
		});
	}

	// Receive available PhoneLabels:
	var labelUrl = "_view/phoneLabels?group=true"
	$http.get(labelUrl).success(function(data) {
		if (data.rows) {
			// sort by appearence count (DESC)
			data.rows.sort(function(a, b) {
				return b.value - a.value;
			});
			$scope.phoneLabels = data.rows;
		}
	});

	// GETTER
	$scope.hasPhones = function() {
		return $scope.contact !== undefined && $scope.contact.phones !== undefined && $scope.contact.phones.length > 0;
	};
	$scope.hasEmails = function() {
		return $scope.contact !== undefined && $scope.contact.emails !== undefined && $scope.contact.emails.length > 0;
	};

	// ACTIONS
	$scope.newPhone = function() {
		if ($scope.contact.phones === undefined) {
			$scope.contact.phones = [];
		}

		$scope.contact.phones.push({
			label : "Mobil"
		});
	};
	$scope.newEmail = function() {
		if ($scope.contact.emails === undefined) {
			$scope.contact.emails = [];
		}

		$scope.contact.emails.push({});
	};
	$scope.newPostalAddress = function() {
		if ($scope.contact.postalAddresses === undefined) {
			$scope.contact.postalAddresses = [];
		}

		$scope.contact.postalAddresses.push({});
	};
	$scope.deletePhone = function() {
		$scope.contact.phones.splice(this.$index, 1);
	};
	$scope.deleteEmail = function() {
		$scope.contact.emails.splice(this.$index, 1);
	};
	$scope.deletePostalAddress = function() {
		$scope.contact.postalAddresses.splice(this.$index, 1);
	};
	$scope.onPhoneLabelChange = function() {
		if (this.$parent.p.label === 'createNewPhoneLabel') {
			$("#newPhoneLabelDialog").dialog({
				resizable : false,
			});
			$scope.phoneLabelChangeNumberRef = this.$parent.p;
		}
	};
	$scope.newPhoneLabelSubmit = function() {
		$scope.phoneLabels.push({
			key : $scope.newPhoneLabelText,
			value : 1
		});
		$scope.phoneLabelChangeNumberRef.label = $scope.newPhoneLabelText;
		delete ($scope.phoneLabelChangeNumberRef);
		$scope.newPhoneLabelText = "";
		$("#newPhoneLabelDialog").dialog("close");
	};

	$scope.save = function() {
		$http.put($scope.url, $scope.contact, {
			headers : {
				"Content-Type" : "multipart/form-data"
			}
		}).success(function(status) {
			if (status.ok || status.ok === "true") {
				$location.path("/detail/" + id);
			} else {
				alert("ERROR: diese Nachricht sollte nicht angezeigt werden! Fehler: " + JSON.stringify(status));
				$scope.status = status;
			}
		}).error(function(status) {
			alert("Fehler beim Speichern!");
			$scope.status = status;
		});
	};
	$scope.abort = function() {
		$location.path("/detail/" + id);
	};

} ]);