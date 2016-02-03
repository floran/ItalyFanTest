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

	 this.promiseToHaveData = function(callback) {

                var defer = $q.defer();

                $http.get('questions.json')
                .success(function(data) {
                        for (var x=0; x < data.length; x++)
                                _this.qlArr[x] = data[x];
            
			callback(_this.qlArr);
                        defer.resolve();
                })
                .error(function() {
                        defer.reject('could not find someFile.json');
                });

                 return defer.promise;
        }
        
});

myApp.service('myService_1', function($http, $q) {
        var _this = this;
        _this.qlArr = [];

         this.promiseToHaveData = function(sid, callbackF) {

		_this.sid = sid;
                var defer = $q.defer();

                $http.get('questions.json')
                .success(function(data) {
                        for (var x=0; x < data.length; x++)
                                _this.qlArr[x] = data[x];

                        callbackF(_this.sid, _this.qlArr);
                        defer.resolve();
                })
                .error(function() {
                        defer.reject('could not find someFile.json');
                });
	}

});

myApp.controller('View1Ctrl', function($scope, $http) {	

	$http.get('questions.json').success(function(data){
		$scope.questions = data;
	});
	
});


myApp.controller('View2Ctrl', function($scope, $routeParams, $http, $cookies, myService, myService_1) {
	
	myService_1.promiseToHaveData($routeParams.questionId, function(sid, data){

	 	$scope.ql = data;
                $scope.qll = data[1];
                $scope.a = $scope.qll;
                $scope.elem = data[sid-1];

		if (sid < data.length){
                	$scope.elemnext = "Следующий вопрос";
                	var temp = parseInt(sid,10) + 1;
                	$scope.elemlink = "#/view2/" + temp.toString();
                        }
                else{
               		 $scope.elemnext = "Вычислить результат теста";
               		 $scope.elemlink = "#/view3";
                }
	});	

	/*myService.promiseToHaveData(function(data){
	
		var _ql = data; 
        	$scope.ql = _ql;
        	$scope.qll = _ql[1];
        	$scope.a = _ql[1]; 
	});*/	

	/*init scope variables*/
	$scope.elemnext_show = false;
        

	
	/*get info about current test question*/
	//$http.get('questions.json').success(function(data){
        //        $scope.elem = data[$routeParams.questionId-1];
        //});

	
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
