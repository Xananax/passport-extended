var User = {
	users:[]
,	findById:function(id,callback){
		var idx = id - 1;
		if(this.users[idx]){
			callback(null,this.users[idx]);
		}else{
			callback(new Error('User ' + id + ' does not exist'));
		}
	}
,	findByUsername:function(username,callback){
		var i=0,u = this.users, len=u.length, user;
		for(i; i < len; i++) {
			var user = u[i];
			if (user.username === username) {
				return callback(null, user);
			}
  		}
  		return callback(null, null);
	}
,	findOne:function(user,callback){
		if(user.username){
			return this.findByUsername(user,callback);
		}
		//TODO
	}
,	findOrCreate:function(user,callback){

	}
,	create:function(user,callback){

	}
,	delete:function(user,callback){

	}
,	normalize:function(data){
		var provider = data.provider
		,	id = data.id || data.username;
		if(!data.id){}
		data.hash = crypto.createHash('md5').update(data.id+data.provider+salt).digest('hex');
		return data;
	}
,	ensureAuthenticated:function(req, res, next) {
		if (req.isAuthenticated()){return next();}
		res.redirect('/login')
	}
}