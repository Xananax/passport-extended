var sprintf = require('sprintf').vsprintf;
,	crypto = require('crypto');
,	LocalStrategy = require('passport-local').Strategy
,	OpenIDStrategy = require('passport-openid').Strategy
,	FacebookStrategy = require('passport-facebook').Strategy
,	GoogleStrategy = require('passport-google').Strategy
,	TwitterStrategy = require('passport-twitter').Strategy;
;

module.exports = function(passport, User, config){

	var salt = config.core.salt
	,	strings = config.strings
	,	form = [['<div class="passportForms" id="PassportIntegratedStrategies">']]
	,	formHTML = false
	,	renderArr = function(arr, delimiter){
			var i = 0; l = arr.length;
			for(i;i<l;i++){
				if(arr[i] instanceof Array){
					arr[i] = renderArr(arr[i]);
				}
			}
			return arr.join(delimiter);
		}
	,	loginId
	,	openIdId
	,	facebookId
	,	googleId
	,	twitterId
	;

	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});

	if(config.auth.loginUrl){

		loginId = config.auth.loginUrl.replace('/','');

		passport.use(new LocalStrategy(
			{
				usernameField: config.auth.usernameField
			,	passwordField: config.auth.passwordField
			}
		,	function(username, password, done) {
				User.findOne(
					User.normalize({username:username,password:password, provider:'local'})
				,	function(err, user){
						if (err){
							return done(err);
						}
						if (!user) {
							return done(null, false, {message: sprintf(strings.messages.login_failed_no_username,[username])});
						}
						if (user.password!=password) {
							return done(null, false, {message: sprintf(strings.messages.login_failed_no_username.[username])});
						}
						return done(null, user, {message:sprintf(strings.messages.login_successful,[username])});
					}
				);
			}
		));

		form.push([
			'<div class="passportStrategy localStrategy" id="'+loginId+'">'
			,	'<h1>'+strings.auth.login_title+'</h1>'
			,	'<form action="'+config.auth.loginUrl+'" method="post" id="'+loginId+'Form" name="'+loginId+'Form" class="passportForm">'
			,		'<div class="passportField">'
			,			'<label for="'+loginId+'_username">'+strings.auth.login_username_label+'</label>'
			,			'<input type="text" name="'+config.auth.usernameField+'" id="'+loginId+'_username"/>'
			,		'</div>'
			,		'<div class="passportField">'
			,			'<label for="'+loginId+'_password">'+strings.auth.login_password_label+'</label>'
			,			'<input type="text" name="'+config.auth.passwordField+'" id="'+loginId+'_password"/>'
			,			'<label for="'+loginId+'_showPassword">'
			,				strings.auth.login_show_password_label
			,				'<input type="checkbox" name="'+config.auth.passwordField+'ShowPassword" id="'+loginId+'_showPassword" value="showPassword" checked/>'
			,			'</label>'
			,		'</div>'
			,		'<div class="passportField passportSubmit">'
			,			'<input type="submit" name="'+config.auth.loginField+'" value="'+strings.auth.login_submit_label+'"/>'
			,			'<input type="submit" name="'+config.auth.registerField+'" value="'+strings.auth.login_register_label+'"/>'
			,		'</div>'
			,	'</form>'
			,	'</div>'
		]);
	}


	if(config.auth.openIdUrl){

		openIdId = config.auth.openIdUrl.replace('/','');

		passport.use(new OpenIDStrategy(
			{
				returnURL: config.auth.domain + config.auth.root + config.auth.openIdCallback
			,	realm: config.auth.domain
			,	profile:true
			}
		,	function(identifier, profile, done) {
				User.findOrCreate(
					User.normalize({id:identifier,profile:profile, provider:'openId'})
				,	function(err, user){
						done(err, user);
					}
				);
			}
		));

		form.push([
			'<div class="passportStrategy openIdStrategy" id="'+facebookId+'">'
			,	'<h1>'+strings.auth.openid_title+'</h1>'
			,'<form action="'+config.auth.openIdUrl+'" method="post" id="'+openIdId+'Form" name="'+openIdId+'Form" class="passportForm">'
			,	'<div class="passportField">'
			,		'<label>'+strings.auth.openid_label+'</label>'
			,		'<input type="text" name="openid_identifier" id="'+openIdId+'_identifier"/><br/>'
			,	'</div>'
			,	'<div class="passportField passportSubmit">'
			,		'<input type="submit" value="'+strings.auth.openid_submit_label+'"/>'
			,	'</div>'
			,'</form>'
		]);
	}

	if(config.auth.facebookUrl && config.auth.facebook_app_id && config.auth.facebook_app_secret){

		facebookId = config.auth.facebookUrl.replace('/','');

		passport.use(new FacebookStrategy(
			{
				clientID: config.auth.facebook_app_id
			,	clientSecret: config.auth.facebook_app_secret
			,	callbackURL: config.auth.domain + config.auth.root + config.auth.facebookCallback
			}
		,	function(accessToken, refreshToken, profile, done) {
				User.findOrCreate(
					User.normalize({id:accessToken,profile:profile,provider:'facebook'})
				,	function(err, user){
						if(err){
							return done(err);
						}
						done(null, user);
					}
				);
		  	}
		));

		form.push(['<div class="passportStrategy facebookStrategy" id="'+facebookId+'">'
		,	'<h1>'+strings.auth.facebook_title+'</h1>'
		,		'<a href="'+config.auth.facebookUrl+'" id="'+facebookId+'Link">'+strings.auth.facebook_label+'</a>'
		,	'</div>';

	}

	if(config.auth.googleUrl){

		googleId = config.auth.googleUrl.replace('/','');

		passport.use(new GoogleStrategy(
			{
				returnURL: config.auth.domain + config.auth.root + config.auth.googleCallback
			,	realm: config.auth.domain
			}
		,	function(identifier, profile, done) {
				User.findOrCreate(
					User.normalize({id:identifier,profile:profile,provider:'google'})
				,	function(err, user) {
						done(err, user);
					}
				);
			}
		));

		form.push([
				'<div class="passportStrategy googleStrategy" id="'+googleId+'">'
			,	'<h1>'+strings.auth.google_title+'</h1>'
			,		'<a href="'+config.auth.googleUrl+'" id="'+googleId+'Link">'+strings.auth.google_label+'</a>'
			,	'</div>'
		]);

	}

	if(config.auth.twitterUrl && config.auth.twitter_consumer_secret && config.auth.twitter_consumer_key){

		twitterId = config.auth.twitterUrl.replace('/','');

		passport.use(new TwitterStrategy(
			{
				consumerKey: config.auth.twitter_consumer_key
			,	consumerSecret: config.auth.twitter_consumer_secret
			,	callbackURL: config.auth.domain + config.auth.root + config.auth.twitterCallback
			}
		,	function(token, tokenSecret, profile, done) {
				User.findOrCreate(
					User.normalize({id:token,profile:profile,provider:'twitter'})
				,	function(err, user) {
						if (err){
							return done(err);
						}
						done(null, user);
					}
				);
			}
		));

		form.push([
				'<div class="passportStrategy twitterStrategy" id="'+twitterId+'">'
			,	'<h1>'+strings.auth.twitter_title+'</h1>'
			,		'<a href="'+config.auth.twitterUrl+'" id="'+twitterId+'Link">'+strings.auth.twitter_label+'</a>'
			,	'</div>'
		]);

	}

	form.push(['</div>']);


	passport.form_structure = function(newForm){
		if(newForm && newForm instanceof Array){form = newForm;}
		return form;
	}

	passport.form_rendered = function(refresh){
		if(!formHTML || refresh){
			formHTML = renderArr(form);
		}
		return formHTML;
	}

	passport.user = User;

	return passport


}