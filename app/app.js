'use strict';

var myApp = angular.module('myItalyApp', ['ngRoute', 'ngCookies']);


myApp.config( ['$routeProvider', function($routeProvider) {

  $routeProvider
	.when('/view1', {
   		templateUrl: 'view1/view1.html',
    		controller:  'View1Ctrl'
  	})
 	.when('/view2/:questionId', {
    		templateUrl: 'view2/view2.html',
    		controller: 'View2Ctrl'
  	})
  	.when('/view3', {
    		templateUrl: 'view3/view3.html',
    		controller: 'View3Ctrl'
  	})
  	.otherwise({
    		templateUrl: 'view1/view1.html',
    		controller:  'View1Ctrl'
  	});
	}
]);


myApp.service('myService_1', function($http, $q) {
        var _this = this;
        _this.qlArr = [];

         this.promiseToHaveData = function(callback) {

                var defer = $q.defer();

                $http.get('questions.json')
                .success(function(data) {
                        for (var x=0; x < data.length; x++)
                                _this.qlArr[x] = data[x];

                        callback (_this.qlArr);
                        defer.resolve();
                })
                .error(function() {
                        defer.reject('could not find someFile.json');
                });
        }

});


myApp.controller('BodyInit', function($rootScope, myService_1) {

        $rootScope.restart=false;

        myService_1.promiseToHaveData(function(data){

                $rootScope.questions = data;
        });

});


myApp.controller('View1Ctrl', function($scope, $rootScope, $http, myService_1) {	

	$rootScope.restart=false;
	
});


myApp.controller('View2Ctrl', function($scope, $rootScope, $routeParams, $http, $cookies, myService_1) {

	// init variables
	$rootScope.restart=false;
	$scope.elemnext_show = false;

        $scope.elem = myService_1.qlArr[$routeParams.questionId-1];

        if ($routeParams.questionId < myService_1.qlArr.length){
        	$scope.elemnext = "Следующий вопрос";
                var temp = parseInt($routeParams.questionId,10) + 1;
                $scope.elemlink = "#/view2/" + temp.toString();
        }
        else{
        	$scope.elemnext = "Вычислить результат теста";
                $scope.elemlink = "#/view3";
        }
		

	$scope.chooseAns = function(answer){

		/*update cookies*/

		var cookieStr = "";
	        if ($routeParams.questionId == 1){
                	cookieStr = answer;
		}
		else {
			var tempCookieArr = $cookies.get("testAnswers").split(",");
			tempCookieArr[$routeParams.questionId-1] = answer;
			cookieStr = tempCookieArr.toString();
		} 
		$cookies.put("testAnswers", cookieStr);
		$scope.elemnext_show = true;
                
	}

});

myApp.controller('View3Ctrl', function($scope, $rootScope, $http, $cookies, myService_1) {
	
        $rootScope.restart=true;
	
	var tempCookieArr = $cookies.get("testAnswers").split(",");

	var result_ = 0;
	var i = 0;
		
	for (; i < myService_1.qlArr.length; i++){

                if (myService_1.qlArr[i].correctAnswer == tempCookieArr[i])
                       	result_ ++;
        }

        $scope.result = result_;
	$scope.total = myService_1.qlArr.length;

});
