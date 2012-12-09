var sprintf = require('sprintf').vsprintf;
;

module.exports = function(passport, config)

	return function(app){

		var authRoot = c.auth.root
		,	loginUrl = authRoot + c.auth.loginUrl
		,	atLeastOneAuthenticationStrategy = false
		,	loginForm = passport.formHTML
		;

		if(config.auth.loginUrl){

			atLeastOneAuthenticationStrategy = true;

			app.post(
				loginUrl,
				passport.authenticate(
					'local'
				,	{
						successRedirect: '/'
					,	failureRedirect: loginUrl,
					,	failureFlash: true
					,	successFlash: true
					}
				)
			);

		}

		if(config.auth.openIdUrl){

			atLeastOneAuthenticationStrategy = true;

			app.post(
				authRoot + c.auth.openIdUrl
			,	passport.authenticate('openid')
			);
			app.get(
				authRoot + c.auth.openIdCallback
			,	passport.authenticate(
					'openid'
				,	{
						successRedirect: '/'
					,	failureRedirect: loginUrl
					,	failureFlash: true 
					}
				)
			);
		}


		if(config.auth.facebookUrl && config.auth.facebook_app_id && config.auth.facebook_app_secret){

			atLeastOneAuthenticationStrategy = true;

			app.get(
				authRoot + c.auth.facebookUrl
			,	passport.authenticate('facebook')
			);

			app.get(
				authRoot + c.auth.facebookCallback
			,	passport.authenticate(
					'facebook'
				,	{
						successRedirect: '/'
					,	failureRedirect: loginUrl
					,	failureFlash: true 
					}
				)
			);

		}


		if(config.auth.google){

			atLeastOneAuthenticationStrategy = true;

			app.get(
				authRoot + c.auth.googleUrl
			,	passport.authenticate('google')
			);
			app.get(
				authRoot + c.auth.facebookCallback
			,	passport.authenticate(
					'google'
				,	{
						successRedirect: '/'
					,	failureRedirect: loginUrl
					,	failureFlash: true 
					}
				)
			);

		}

		if(config.auth.twitterUrl && config.auth.twitter_consumer_key && config.auth.twitter_consumer_key){

			atLeastOneAuthenticationStrategy = true;

			app.get(
				authRoot + c.auth.twitterUrl
			,	passport.authenticate('twitter')
			);
			app.get(
				authRoot + c.auth.twitterCallback
			,	passport.authenticate(
					'twitter'
				,	{
						successRedirect: '/'
					,	failureRedirect: '/login'
					,	failureFlash: true 
					}
				)
			);

		}

		if(atLeastOneAuthenticationStrategy){
			app.get(
				authRoot
			,	function(req,res){
					res.render('login', {
						user: req.user
					,	message:req.flash('error')
					,	passportForm: passport.form_rendered()
					});
				}
			)
			app.get(
				authRoot + c.auth.logoutUrl
			,	function(req,res){
					req.logout();
	  				res.redirect('/');
				}
			);
		}

	}
}