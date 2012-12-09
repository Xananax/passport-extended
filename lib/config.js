module.exports = {
	core:{
		salt:'keyboard cat'
	}
,	strings:{
		messages:{
			login_successful		: 'welcome back!'
		,	register_successful		: 'welcome!'
		,	login_failed_no_username: 'the username %s you provided was not found'
		,	login_failed_no_password: 'wrong password'
		,	register_failed_username_exists: 'the email you provided already exists. Try logging in instead'
		}
	,	auth:{
			login_username_label	: 'email'
		,	login_password_label	: 'password'
		,	login_show_password_label:'show password'
		,	login_submit_label		: 'login'
		,	login_register_label	: 'register'
		,	login_title				: 'Login with username and password'
		,	openid_label			: 'enter your openId'
		,	openid_submit_label		: 'SignIn'
		,	openid_title			: 'Login with OpenId'
		,	facebook_label			: 'login with Facebook'
		,	facebook_title			: 'login with Facebook'
		,	google_label			: 'login with Google'
		,	google_title			: 'login with Google'
		,	twitter_label			: 'login with Twitter'
		,	twitter_title			: 'login with Twitter'
		}
	}
,	auth:{
		root:'/auth'
	,	logoutUrl:'/logout'
	,	connectRoot:'connect'
	,	domain:'http://localhost'
	//normal auth
	,	loginUrl:'/login'
	,	usernameField: 'email'
	,	passwordField: 'password'
	,	loginField: 'login'
	,	registerField: 'register'
	//openId
	,	openIdUrl:'/openid'
	,	openIdCallback:'/openid/return'
	//facebook
	,	facebookUrl:'/facebook'
	,	facebookCallback:'/facebook/return'
	,	facebook_app_id:''
	,	facebook_app_secret:''
	//google
	,	googleUrl:'/google'
	,	googleCallback:'/google/return'
	//twitter
	,	twitterUrl:'/twitter'
	,	twitterCallback:'/twitter/return'
	,	twitter_consumer_key:''
	,	twitter_consumer_secret:''
	}
}