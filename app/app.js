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
  }]);


myApp.factory('Qlist', ['$resource', function($resource){
        return $resource('questions.json', {}, {
                query: {method:'GET', params:{}, isArray:true}
        });
}]);


myApp.controller('View1Ctrl', function($scope, $http) {	

	$http.get('questions.json').success(function(data){
		$scope.questions = data;
	});
	
});


myApp.controller('View2Ctrl', function($scope, $routeParams, $http, $cookies) {

	/*init scope variables*/
	$scope.elemnext = "";
	
	/*get info about current test question*/
        $http.get('questions.json').success(function(data){
                
		$scope.elem = data[$routeParams.questionId-1];
        });

	
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
