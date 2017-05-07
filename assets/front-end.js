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
	.when('/login',{
		 templateUrl:'login.html',
	     controller:'logincontroller',	
		
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
	.otherwise({redirectTo:'/login'});
	
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
	$http.get('/isloggedin')
	.success(function(rep){
		if(!rep){
			$location.path('/login');
		}else{
			$scope.adminname = rep.username;
			$scope.password = rep.password;
		}
	});
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
	
	$scope.logout = function(){
		$http.get('/logout')
		.success(function(rep){
			if(rep==='successful'){
				$location.path('/login');
			}
		})
	};
	
	$scope.addtocart = function(index){
		/*localStorage.setItem("mycart", );*/
		
	}
}])

app.controller('checkoutcontroller',['$scope','$location','customefactory',function($scope,$location,customefactory){
	$http.get('/isloggedin')
	.success(function(rep){
		if(!rep){
			$location.path('/login');
		}else{
			$scope.adminname = rep.username;
			$scope.password = rep.password;
		}
	});
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
	$scope.logout = function(){
		$http.get('/logout')
		.success(function(rep){
			if(rep==='successful'){
				$location.path('/login');
			}
		})
	};
	
}])

  app.controller('cncontroller',['$scope','$http','$location','$rootScope',function($scope,$http,$location,$rootScope){
		$http.get('/isloggedin')
		.success(function(rep){
			if(!rep){
				$location.path('/login');
			}else{
				$scope.adminname = rep.username;
				$scope.password = rep.password;
			}
		});
		  $http.get("https://api.nike.com/commerce/productfeed/products/snkrs/threads?country=CN&limit=10000&locale=zh_CN&withCards=true")
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
			$scope.logout = function(){
				$http.get('/logout')
				.success(function(rep){
					if(rep==='successful'){
						$location.path('/login');
					}
				})
			};
		  
	  
	  
  }]);

app.controller('detailcncontroller',['$scope','$http','$location','$rootScope',function($scope,$http,$location,$rootScope){
	$http.get('/isloggedin')
	.success(function(rep){
		if(!rep){
			$location.path('/login');
		}else{
			$scope.adminname = rep.username;
			$scope.password = rep.password;
		}
	}); 
	$scope.link = $rootScope.link;
	$scope.logout = function(){
		$http.get('/logout')
		.success(function(rep){
			if(rep==='successful'){
				$location.path('/login');
			}
		})
	};
  
}]);


app.controller('uscontroller',['$scope','$http','$location','$rootScope',function($scope,$http,$location,$rootScope){
	$http.get('/isloggedin')
	.success(function(rep){
		if(!rep){
			$location.path('/login');
		}else{
			$scope.adminname = rep.username;
			$scope.password = rep.password;
		}
	});
		  $http.get("https://api.nike.com/commerce/productfeed/products/snkrs/threads?country=US&limit=10000&locale=en_US&withCards=true")
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
			$scope.logout = function(){
				$http.get('/logout')
				.success(function(rep){
					if(rep==='successful'){
						$location.path('/login');
					}
				})
			};
	  
	  
  }]);

app.controller('detailuscontroller',['$scope','$http','$location','$rootScope',function($scope,$http,$location,$rootScope){
	$http.get('/isloggedin')
	.success(function(rep){
		if(!rep){
			$location.path('/login');
		}else{
			$scope.adminname = rep.username;
			$scope.password = rep.password;
		}
	});  
	$scope.link = $rootScope.link;
	$scope.logout = function(){
		$http.get('/logout')
		.success(function(rep){
			if(rep==='successful'){
				$location.path('/login');
			}
		})
	};
      
  
}]);
app.controller('logincontroller',['$scope','$http','$location',function($scope,$http,$location){

	
	$scope.login = function(){
		var username = $scope.username;
		var password = $scope.password;
		var customer = {"username":username,"password":password};
		//console.log(username);
		$http.post('/login',customer)
	.success(function(rep){
			if(rep==='success'){
				$location.path('/home');
			}
			
		})
		
	}
	
	
}])

