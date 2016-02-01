'use strict';

var myApp = angular.module('myItalyApp', ['ngRoute', 'ngCookies', 'ngResource']);

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


myApp.service('myService', function($http, $q) {
	var _this = this;
	_this.qlArr = [];
	_this.qlLen = 0;

	 this.promiseToHaveData = function() {

                var defer = $q.defer();

                $http.get('questions.json')
                .success(function(data) {
                        for (var x=0; x < data.length; x++)
                                _this.qlArr[x] = data[x];
                        _this.qlLen = data.length;
                        defer.resolve();
                })
                .error(function() {
                        defer.reject('could not find someFile.json');
                });

                 return defer.promise;
        }
        _this.promiseToHaveData();


	return _this.qlArr;
});

myApp.controller('View1Ctrl', function($scope, $http) {	

	$http.get('questions.json').success(function(data){
		$scope.questions = data;
	});
	
});


myApp.controller('View2Ctrl', function($scope, $routeParams, $http, $cookies, myService) {
	
	
	var _ql = [];
	_ql = myService; 
	$scope.ql = _ql;
	$scope.qll = _ql[1];
	

	/*init scope variables*/
	$scope.elemnext = "";
	
	/*get info about current test question*/
	$http.get('questions.json').success(function(data){
                $scope.elem = data[$routeParams.questionId-1];
        });
	
	/*$scope.elem = _ql[1];*/
	
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
		

		$http.get('questions.json').success(function(data){

                	if ($routeParams.questionId < data.length){
                        	$scope.elemnext = "Следующий вопрос";
				var temp = parseInt($routeParams.questionId,10) + 1;	
				$scope.elemlink = "#/view2/" + temp.toString();
			}
                	else{
                        	$scope.elemnext = "Вычислить результат теста";
				$scope.elemlink = "#/view3";
			}

       		 });
	}

});

myApp.controller('View3Ctrl', function($scope, $http, $cookies) {
	
        
	$http.get('questions.json').success(function(data){
	
		var tempCookieArr = $cookies.get("testAnswers").split(",");

		var result_ = 0;
	        var i = 0;
		
		for (; i < data.length; i++){

                	if (data[i].correctAnswer == tempCookieArr[i])
                        	result_ ++;
        	}

        	$scope.result = result_;
		$scope.total = data.length;

        });

});
