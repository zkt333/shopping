var express = require('express');
var passport = require('passport');
var app = express();
var crypto = require('crypto');
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
var algorithm = 'aes-256-ctr';
var privateKey = '37LvDSm4XvjYOh9Y';
/*var LocalStrategy = require('passport-local').Strategy;*/
app.use(express.static('assets'));
app.use(bodyParser.json());
function decrypt(password) {
    var decipher = crypto.createDecipher(algorithm, privateKey);
    var dec = decipher.update(password, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}
function encrypt(password) {
    var cipher = crypto.createCipher(algorithm, privateKey);
    var crypted = cipher.update(password, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}
/*app.use(passport.initialize());
app.use(passport.session());*/
/*passport.serializeUser(function(user, done) {
    done(null, cutomers.username);
});


passport.deserializeUser(function(id, done) {
    done({ customers: password})
});


passport.use(new LocalStrategy(
      function(username, password, done) {
        console.log("test");
          if (username === 'username') {
              return done(null, { name: "test", id: '1234'});
          } else {
              return done(null, false, { message: 'Incorrect cred.' });
          }
      })
    )*/
/*app.post('/login',
      passport.authenticate('local', { 
          successRedirect: '/home.html',
          failureRedirect: '/login'
     })
    );*/

app.post('/signup',function(req,res){
	mongoclient.connect(conn_str,function(err,db){
		if(err){
			console.log('error occur')
		}else{
			db.collection('customers').findOne({"username":req.body.username},function(err,result){
				if(result){
					res.send('failed');
				}else{

					req.body.password = encrypt(req.body.password);
				    db.collection('customers').insert({"username":req.body.username,"password":req.body.password},function(err,user){
				    	if(!err){
				    		 var tokenData = {
				    		            username: user.username,
				    		            id: user._id
				    		        }
				    	}
				    	
				    });
				    res.send('success');
				    
					
				}
				db.close();
				
			})
			
		}
		
	})
	
	
	
})
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
			db.collection('customers').findOne({"username":req.body.username},function(err,user){
				if(req.body.password==decrypt(user.password)){
					console.log('yes');
					 var tokenData = {
			                    username: user.username,
			                    scope: [user.scope],
			                    id: user._id
			                };
			         var result = {
			                    username: user.username,
			                    scope: user.scope,
			                    token: jwt.sign(tokenData, privateKey)
			                };

			         res.json(result);
			         //res.send('success');
					
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
				}else{
					res.send('did not find')
				}
				
			})
		}
		db.close();
	})
	
	
})


app.listen(9109,function(){
	console.log('server running @ localhost:9109');
});