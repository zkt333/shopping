var express = require('express');
var app = express();
var mongodb = require('mongodb');
var http = require('http');

var mongoclient = require('mongodb').MongoClient;
var conn_str = 'mongodb://localhost:27017/shopping';

var bodyParser = require('body-parser');
var session = require('express-session');
var mongodbstore = require('connect-mongodb-session')(session);

/*var new_db = new mongodb.Db('aa', new mongodb.Server('localhost', 27017));
new_db.open(function(err, db){
	if(!err){
		db.collection("aaa").insert({"test":"2323"});
	}
})*/


app.use(express.static('assets'));
app.use(bodyParser.json());
var store = new mongodbstore({
	uri:'mongodb://localhost:27017/shopping',
	collection:'shopping_session'
	});
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
			db.collection('products').find({'price':'2999'}).toArray(function(err,result){
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
/*app.post('/submit',function(req,res){
		mongoclient.connect(conn_str,function(err,db){
		if(err){
			console.log('error occur');
		}else{
			db.collection('products').update({"product":{"id":req.body.productid}},{$set:{"product":{"quality":req.body.quality}},function(err,result){
				console.log(result);
				if(result){

                       db.collection('orders').insert({"order":{"id":req.body.id,"productid":req.body.productid,"address":req.body.address,"price":req.body.price}});
					   res.send('success');
					
				}
				db.close();
			}
			
		})
	})
})*/
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
			db.collection('customers').findOne({"id":req.body},function(err,result){
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

app.listen(9109,function(){
	console.log('server running @ localhost:9109');
});