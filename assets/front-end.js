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
	.when('/product',{
		templateUrl:'product.html',
		controller:'productcontroller',
	})
	.when('/admin',{
		templateUrl:'admin.html',
		controller:'admincontroller',
	})
	.when('/admin/edit',{
		templateUrl:'edit.html',
		controller:'editcontroller',
	})
	.when('/cnchecker',{
		templateUrl:'nikeCNchecker.html',
		controller:'cnchecker',
	})
	.when('/signup',{
		templateUrl:'signup.html',
		controller:'signupcontroller',
	})
	
	
	
});
/*fsdfsf*/

app.factory('customerfactory',['$scope','$http','$log',function($scope,$http,$log){
	var cust = {};    
/*	cust.checkout = function(customer,callback){
	    $http.post('/checkout',customer)
	    .then(function(){
	    	callback();
	    })
	};*/
	cust.logout = function(){
		
			$http.get('/logout')
			.success(function(rep){
				if(rep==='successful'){
					$location.path('/login');
				}
			})
	
	};
	return cust;
	
	
}])

app.controller('signupcontroller',['$scope','$http',function($scope,$http){
	$scope.signup = function(){
	    var password = $scope.password;
	    var username = $scope.username;
	    var user = {"username":username,"password":password}
	    $http.post('/signup',user)
	    .success(function(rep){
		  console.log(rep);
	})
	}
}])
app.controller('homecontroller',['$scope','$location','$http','$rootScope','$routeParams',function($scope,$location,$http,$rootScope,$routeParams){
	$http.get('/isloggedin')
	.success(function(rep){
		if(!rep){
			$location.path('/login');
		}else{
			$rootScope.adminname = rep.username;
			$rootScope.password = rep.password;
		}
	});
	$http.get('/home')
		.success(function(rep){
	        if(rep==='failed'){
			    alert('please try again!');
			}else{
			  /*console.log(rep);*/
			  $scope.products = rep;
			  console.log($scope.products.price);

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
//	$scope.logout = function(){
//		customerfactory.logout();
//		
//	}
	
	
	$scope.view = function(id){
		console.log(id);
		var ID = {"id":id};
		localStorage.setItem('ID', JSON.stringify(ID));
		//console.log(typeof(ID));
		$location.path('/product');
		

		
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
		  
		  $scope.information = function(id){
		    /*console.log(id);*/
			  localStorage.setItem('SNKRS', JSON.stringify(id));
			  $location.path('/detailcn');
		    
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
	var id = JSON.parse(localStorage.getItem("SNKRS"));
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
	      
	      
	    })
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
		  
		  $scope.information = function(id){
		    /*console.log(id);*/
			  localStorage.setItem('SNKRS', JSON.stringify(id));
			  $location.path('/detailus');
		      
		      
		    }

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
	var id = JSON.parse(localStorage.getItem("SNKRS"));
	$http.get("https://api.nike.com/commerce/productfeed/products/snkrs/" + id + "/thread?country=US&locale=en_US&withCards=true")
    .then(function(rep){
      console.log(rep.data);
      console.log(rep.data.id);
      $rootScope.stylenumber = id;
      $rootScope.price = rep.data.product.price.currentRetailPrice;
      $rootScope.onsale = rep.data.product.price.onSale;
      $rootScope.sizeinfo = rep.data.product.skus;
      $rootScope.fullTitle = rep.data.product.fullTitle;
      $rootScope.effectiveInStockStartSellDate = rep.data.product.effectiveInStockStartSellDate;
      $rootScope.link = 'https://www.nike.com/launch/thread/'+rep.data.id;
      $rootScope.merchStatus = rep.data.product.merchStatus;
      $rootScope.selectionEngine = rep.data.product.selectionEngine;
      $rootScope.estimatedLaunchDate = rep.data.product.estimatedLaunchDate;
      $rootScope.startSellDate = rep.data.product.startSellDate;
      $rootScope.waitinline = rep.data.product.waitlineEnabled;
      $rootScope.image = rep.data.desktopImageUrl;
      
    })
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
		$location.path('/home');
//			if(rep==='success'){
//				$location.path('/home');
//			}else{
//				alert('wrong username or wrong password!!!');
//				$scope.username='';
//				$scope.password='';
//			}
			
		})
		
	}
	
	
}])

app.controller('productcontroller',['$scope','$http','$rootScope','$location','$q','$routeParams',function($scope,$http,$rootScope,$location,$q,$routeParams){
	
	var ID = JSON.parse(localStorage.getItem("ID"));
	console.log(ID);
	$http.post('/product',ID)
	.success(function(rep){
		if(rep==='failed'){
			console.log('error');
		}else{
			$rootScope.product = rep;
			$scope.productdetail = $rootScope.product;
			console.log($scope.productdetail);
		    $scope.name = $scope.productdetail.productname;
			$scope.price = $scope.productdetail.price;
			$scope.size = $scope.productdetail.size;
			$scope.price = $scope.productdetail.price;
			$scope.imgURL = $scope.productdetail.imgURL;
			//console.log($scope.product.price);
			var name = $scope.productdetail.productname;
			var price = $scope.productdetail.price;
			console.log()
			var quality = 1;
			var size = $scope.productdetail.size;
			var price = $scope.productdetail.price;
			var imgURL = $scope.productdetail.imgURL;
			var id = $scope.productdetail.id;
			console.log($scope.product.size);
			//$scope.imgURL = $scope.product.imgURL;
			var id = $scope.product.id;
			var username = $rootScope.adminname;
			var pid = {"id":id,"username":username,"productname":name,"size":size,"imgURL":imgURL,"price":price,"quality":quality};
			$scope.addtocart = function(){
	              $http.post('/add',pid)
				  .success(function(rep){
					if(rep==='success'){
						alert('added to cart!');
					}else{
						alert('sold out!');
					}
				})
			}

			
		}
		
	})

	
}])

app.controller('cartcontroller',['$scope','$http','$rootScope',function($scope,$http,$rootScope){
	var username = {"username":$rootScope.adminname}; 
	$http.post('/cart',username)
	.success(function(rep){
		if(rep==='failed'){
			alert('error occur')
		}else{
			console.log(rep[0]);
			$scope.cart = rep;
			//$scope.customer = rep;
			$scope.username = rep.username;
			//$scope.product = rep.orders;
			$scope.productname = rep.productname;
			$scope.price = rep.price;
			$scope.quality = rep.quality;
			$scope.imgURL = rep.imgURL;
			$scope.id = rep.id;
			var totalprice = 0;
			for(var i=0;i<rep.length;i++){
				totalprice += rep[i].price;
			}
			$scope.totalprice = totalprice;
			
		}
	});
	
	$scope.delete = function(id){
		$http.delete('/delete',id)
		.success(function(rep){
			if(rep==='success'){
				alert('deleted!')
			}
			
		});
			
		
	}
	
	
	
}])
app.controller('admincontroller',['$scope','$http','$location',function($scope,$http,$location){
	$http.get('/admin')
	.success(function(rep){
		$scope.product = rep;
		console.log(rep);
	})
	$scope.edit = function(id){
		var id = {"id":id};
		localStorage.setItem('edit', JSON.stringify(id));
		$location.path('/admin/edit');
		

		
	}
}])
app.controller('editcontroller',['$scope','$http',function($scope,$http){
	var id = JSON.parse(localStorage.getItem("edit"));
	$http.post('/admin/edit',id)
	.success(function(rep){
		console.log(rep);
		$scope.price = rep.price;
		$scope.productname = rep.productname;
		$scope.quality = rep.quality;
		$scope.img = rep.imgURL;
	})
	
}])
app.controller('cnchecker',['$scope','$http',function($scope,$http){
	
	$scope.find = function(stylenumber){
		var stylenumber = $scope.stylenumber;
		$http.get('https://api.nike.com/commerce/productsize/products/'+stylenumber+'/availability?country=CN&channel=SNKRS')
		.success(function(rep){
			//$scope.product = rep;
			$scope.sizes = rep.sizes;
			
			console.log(rep.sizes);
		})
	}
	
}])

