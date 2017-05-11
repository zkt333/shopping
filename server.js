var express = require('express');
var app = express();
var mongodb = require('mongodb');
var http = require('http');
var jwt = require('jsonwebtoken');
var mongoclient = require('mongodb').MongoClient;
var conn_str = 'mongodb://localhost:27017/shopping';
var token = jwt.sign({ foo: 'bar' }, 'shhhhh');
var older_token = jwt.sign({ foo: 'bar', iat: Math.floor(Date.now() / 1000) - 30 }, 'shhhhh');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongodbstore = require('connect-mongodb-session')(session);
app.use(express.static('assets'));
app.use(bodyParser.json());
var store = new mongodbstore({
	uri:'mongodb://localhost:27017/shopping',
	collection:'shopping_session'
	});

jwt.sign({
	  data: 'foobar'
	}, 'secret', { expiresIn: '1h' });
app.use(
		session({
			secret:'shopping_sess_secret_key',
			cookie:{maxAge:10000*60*2},
			resave:true,
			saveUninitialized:true,
			store:store
		})
		);
store.on('error',function(err){
	console.log(err);
});
app.get('/',function(req,res){
	res.sendFile(__dirname + "/index.html");
})
app.get('/home',function(req,res){
	mongoclient.connect(conn_str,function(err,db){
		if(err){
			console.log('error');
		}else{
			console.log('connected');
			db.collection('products').find().toArray(function(err,result){
				if(result){
					res.send(result);
				}else{
					res.send('failed');
				}
				db.close();
			})
		}
		
		
	})

})

app.post('/login',function(req,res){
	mongoclient.connect(conn_str,function(err,db){
		if(err){
			console.log('error');
		}else{
			console.log('connected')
			console.log(req.body);
			db.collection('customers').findOne({"username":req.body.username,"password":req.body.password},function(err,result){
				if(result){
					req.session.loguser = result;
					console.log(result);
					res.send('success');
				}else{
					console.log(result);
					res.send('failed');
					
				}
				db.close();
				
			})
			
		}
		
		
	})
	
	
})
app.get('/isloggedin',function(req,res){
	if(req.session.loguser!=null){
		res.send(req.session.loguser);
	}else{
		res.send(false);
	}
	
});
app.get('/logout',function(req,res){
	req.session.loguser=null;
	res.send('successful');
});
app.post('/product',function(req,res){
	mongoclient.connect(conn_str,function(err,db){
		if(err){
			console.log('error');
		}else{
			console.log('connected');
			db.collection('products').findOne({"id":req.body.id},function(err,result){
				if(result){
					
					res.send(result);
					
				}else{
					res.send('failed');
				}
				db.close();
			})
		}
		
	})
	
});
app.post('/add',function(req,res){
	mongoclient.connect(conn_str,function(err,db){
		if(err){
			console.log('error');
		}else{
			console.log('connected');
			db.collection('products').findOne({"id":req.body.id},function(err,result){
				if(result){
					if(result.quality!="0"){
						db.collection('cart').insert({"username":req.body.username,"id":req.body.id,"quality":1,"productname":req.body.productname,"price":req.body.price,"imgURL":req.body.imgURL,"size":req.body.size},function(err,re){
							if(re){
								console.log(re.username);
								res.send('success');
							}
							
						})
						
					}else{
						res.send('failed');
					}
					
				}
				db.close();
				
			})
		}
		
	})


})
app.post('/cart',function(req,res){
	mongoclient.connect(conn_str,function(err,db){
		if(err){
			console.log('err')
		}else{
			console.log('connected');
			db.collection('cart').find({"username":req.body.username}).toArray(function(err,result){
				if(result){
					res.send(result);
				}else{
					res.send('failed');
				}
				db.close();
			})
		}
		
		
	})
	
	
})
/*app.delete('/delete',function(req.res){

	mongoclient.connect(conn_str,function(err,db){
		if(err){
			console.log('error occur')
		}else{
			db.collection('cart').
		}
		
		
	})
	
})*/

app.get('/admin',function(req,res){

	mongoclient.connect(conn_str,function(err,db){
		if(err){
			console.log('err')
		}else{
			db.collection('products').find().toArray(function(err,result){
				if(result){
					res.send(result);
				}
			})
		}
		db.close();
	})
	
	
})
app.post('/admin/edit',function(req,res){
	mongoclient.connect(conn_str,function(err,db){
		if(err){
			console.log('err');
		}else{
			db.collection('products').findOne({"id":req.body.id},function(err,result){
				if(result){
					res.send(result);
				}
			})
		}
		db.close();
	})
	
	
})



app.listen(9109,function(){
	console.log('server running @ localhost:9109');
});