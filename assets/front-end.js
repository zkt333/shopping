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
	.when('/cn',{
		templateUrl:'cn.html',
		controller:'cncontroller',
	})
	.when('/us',{
		templateUrl:'us.html',
		controller:'uscontroller',
	})
	.when('/detailcn',{
	  templateUrl:'detailcn.html',
		controller:'detailcncontroller',
	})
	.when('/detailus',{
	  templateUrl:'detailus.html',
		controller:'detailuscontroller',
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

  app.controller('cncontroller',['$scope','$http','$location','$rootScope',function($scope,$http,$location,$rootScope){

		  $http.get("https://api.nike.com/commerce/productfeed/products/snkrs/threads?country=CN&limit=500&locale=zh_CN&withCards=true")
		  .then(function(rep){
			  $scope.threads = rep.data.threads;
			  /*console.log(rep.data.threads)*/

			  
		  })
		  
		  $scope.view = function(id){
		    /*console.log(id);*/
		    $http.get("https://api.nike.com/commerce/productfeed/products/snkrs/" + id + "/thread?country=CN&locale=zh_CN&withCards=true")
		    .then(function(rep){
		      console.log(rep.data);
/*		      $scope.available = rep.data.product.skus.available;
		      $scope.size = rep.data.product.skus.localizedSize;*/
		      console.log(rep.data.id);
		      $rootScope.stylenumber = id;
		      $rootScope.price = rep.data.product.price.currentRetailPrice;
		      $rootScope.onsale = rep.data.product.price.onSale;
		      $rootScope.sizeinfo = rep.data.product.skus;
		      $rootScope.fullTitle = rep.data.product.fullTitle;
		      $rootScope.effectiveInStockStartSellDate = rep.data.product.effectiveInStockStartSellDate;
		      $rootScope.link = 'https://www.nike.com/cn/launch/thread/'+rep.data.id;
		      $rootScope.merchStatus = rep.data.product.merchStatus;
		      $rootScope.selectionEngine = rep.data.product.selectionEngine;
		      $rootScope.estimatedLaunchDate = rep.data.product.estimatedLaunchDate;
		      $rootScope.startSellDate = rep.data.product.startSellDate;
		      $rootScope.waitinline = rep.data.product.waitlineEnabled;
		      $rootScope.image = rep.data.desktopImageUrl;
		      $location.path('/detailcn');
		      
		    })
		  };
		  
	  
	  
  }]);

app.controller('detailcncontroller',['$scope','$http','$location','$rootScope',function($scope,$http,$location,$rootScope){
      $scope.link = $rootScope.link;
  
}]);


app.controller('uscontroller',['$scope','$http','$location','$rootScope',function($scope,$http,$location,$rootScope){

		  $http.get("https://api.nike.com/commerce/productfeed/products/snkrs/threads?country=US&limit=500&locale=en_US&withCards=true")
		  .then(function(rep){
			  $scope.threads = rep.data.threads;
			  /*console.log(rep.data.threads)*/

			  
		  })
		  
		  $scope.view = function(id){
		    /*console.log(id);*/
		    $http.get("https://api.nike.com/commerce/productfeed/products/snkrs/" + id + "/thread?country=US&locale=en_US&withCards=true")
		    .then(function(rep){
		      console.log(rep.data);
/*		      $scope.available = rep.data.product.skus.available;
		      $scope.size = rep.data.product.skus.localizedSize;*/
		      console.log(rep.data.id);
		      $rootScope.stylenumber = id;
		      $rootScope.price = rep.data.product.price.currentRetailPrice;
		      $rootScope.onsale = rep.data.product.price.onSale;
		      $rootScope.sizeinfo = rep.data.product.skus;
		      $rootScope.fullTitle = rep.data.product.fullTitle;
		      $rootScope.effectiveInStockStartSellDate = rep.data.product.effectiveInStockStartSellDate;
		      $rootScope.link = 'https://www.nike.com/cn/launch/thread/'+rep.data.id;
		      $rootScope.merchStatus = rep.data.product.merchStatus;
		      $rootScope.selectionEngine = rep.data.product.selectionEngine;
		      $rootScope.estimatedLaunchDate = rep.data.product.estimatedLaunchDate;
		      $rootScope.startSellDate = rep.data.product.startSellDate;
		      $rootScope.waitinline = rep.data.product.waitlineEnabled;
		      $rootScope.image = rep.data.desktopImageUrl;
		      $location.path('/detailus');
		      
		    })
		  };
		  
	  
	  
  }]);

app.controller('detailuscontroller',['$scope','$http','$location','$rootScope',function($scope,$http,$location,$rootScope){
      $scope.link = $rootScope.link;
  
}]);


