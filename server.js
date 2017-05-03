var express = require('express');
var app = express();
var mongodb = require('mongodb');
var http = require('http');

var mongoclient = require('mongodb').MongoClient;


var bodyParser = require('body-parser');
var session = require('express-session');
var mongodbstore = require('connect-mongodb-session')(session);

/*var new_db = new mongodb.Db('aa', new mongodb.Server('localhost', 27017));
new_db.open(function(err, db){
	if(!err){
		db.collection("aaa").insert({"test":"2323"});
	}
})*/

var conn_str = 'mongodb://localhost:27017/example';
app.use(express.static('assets'));
app.use(bodyParser.json());
var store = new mongodbstore({
	uri:'mongodb://localhost:27017/example',
	collection:'example_session'
	});
app.use(
		session({
			secret:'example_sess_secret_key',
			cookie:{maxAge:1000*60*2}
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
app.post('/login',function(req.res){
	mongoclient.connect(conn_str,function(err,db){
		if(err){
			console.log('error occur');
		}else{
			db.collection('customers').findOne({"username":req.body.username,"password":req.body.password},function(err,result){
				console.log(result);
				if(result){
					req.session.loguser = result;
					res.send('success');
					
				}else{
					res.send('failed');
				}
				db.close();
			})
			
		}
	})
	
})
app.post('submit',function(req.res){
		mongoclient.connect(conn_str,function(err,db){
		if(err){
			console.log('error occur');
		}else{
			db.collection('customers').findOne({"username":req.body.username},function(err,result){
				console.log(result);
				if(result){
					req.session.loguser = result;
					res.send('user exist! ');
					
				}else{
					db.collection('customers').insert({"username":req.body.username,"password":req.body.password});
					res.send('success');
				}
				db.close();
			})
			
		}
	})
})
app.listen(9109,function(){
	console.log('server running @ localhost:9109');
});