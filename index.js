var passport 	= require('passport')
,	config 		= require('./lib/config')
,	User 		= require('./lib/user')
,	passport_extended = require('./lib/passport')
,	routes 		= require('./lib/routes')
;

var extend = function(target, other) {
	target = target || {};
	for (var prop in other) {
		if (typeof source[prop] === 'object') {
	 		target[prop] = extend(target[prop], source[prop]);
		}else{
			target[prop] = source[prop];
		}
	}
	return target;
}

module.exports = function(opts){

	if(opts){
		extend(config,opts);
	}

	return{
		passport: passport_extended(passport, User, config)
	,	User:User
	,	routes:routes(passport, config)
	}

}