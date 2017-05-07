var app = angular.module('myapp',['ngRoute']);
app.config(function($routeProvider){
	$routeProvider.when('/home',{
	     templateUrl:'home.html',
	     controller:'homecontroller',
	})
	.when('/checkout',{
	     templateUrl:'checkout.html',
	     controller:'checkoutcontroller',		
	})
	.when('/cart',{
		 templateUrl:'cart.html',
	     controller:'cartcontroller',	
	})
	.when('/cart',{
	     templateUrl:'cart.html',
	     controller:'cartcontroller',		
	})
	.otherwise({redirectTo:'/home'});
	
});
/*fsdfsf*/
app.factory('customerfactory',['$scope','$http','$log',function($scope,$http,$log){
	var customerservice = {};    
	customerservice.checkout = function(customer,callback){
	    $http.post('/checkout',customer)
	    .then(function(){
	    	callback();
	    })
	};
	return logservice;
	
	
}])
app.controller('homecontroller',['$scope','$location','$http',function($scope,$location,$http){
	$http.get('/home')
		.success(function(rep){
	        if(rep==='failed'){
			    alert('please try again!');
			}else{
			  console.log(rep);
			   $scope.product.name = rep.product.name;
			   $scope.product.id = rep.product.id;
			   $scope.product.quality = rep.product.quality;
			   $scope.product.price = rep.product.price;

			}
	       
	})
	
	$scope.addtocart = function(index){
		localStorage.setItem("mycart", );
		
	}
}])

app.controller('checkoutcontroller',['$scope','$location','customefactory',function($scope,$location,customefactory){
	var customer = {'username':$scope.username,'orders':{'address':$scope.address,'phone':$scope.phone}};
	$scope.checkout = function(){
		customefactory.checkout(customer)
		.success(function(rep){
			if(rep==='success'){
				$location.path('/home');
			}
			console.log(rep);
		})

	}
	
}])


