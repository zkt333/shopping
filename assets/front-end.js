var app = angular.module('myapp',['ngRoute']);
app.config(function($routeProvider){
	$routeProvider.when('/login',{
	     templateUrl:'login.html',
	     controller:'logincontroller'
	})
	.when('/home',{
	     templateUrl:'home.html',
	     controller:'homecontroller',
	})
	.when('/signup',{
	     templateUrl:'signup.html',
	     controller:'signupcontroller',		
	})
	.when('/checkout',{
	     templateUrl:'checkout.html',
	     controller:'checkoutcontroller',		
	})
	.when('/cart',{
		 templateUrl:'cart.html',
	     controller:'cartcontroller',	
	})
	.otherwise({redirectTo:'/login'});
	
});
/*fsdfsf*/
app.factory('customefactory',['$scope','$http','$log',function($scope,$http,$log){
	var customeservice = {};    
	customeservice.login = function(customer){
		$http.post('/login',customer)
		})
	};
	return logservice;
	
	
}])
app.controller('signupcontroller',['$scope','$location',function($scope,$location){

	
}])
app.controller('logincontroller',['$scope','$location','customefactory',function($scope,$location,customefactory){
	var customer = {'username':$scope.username,'password':$scope.password};
	$scope.login = function(){
		customefactory.login(customer)
		.success(function(rep){
			if(rep==='success'){
				$location.path('/home');
			}
			console.log(rep);
		})

	}
	
}])
