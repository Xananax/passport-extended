# Passport-extended

  Extends [passport](http://passportjs.org/) with utilities functions in order to be able to kickstart quickly a project that needs authentication

  To get started, copy lib/config.js in your root, and edit the options you want to change (you can remove options you want to keep, files will be merged anyway).

  Then, when requiring, do this:

	var pe = require('passport-extended')(my-config)

"my-config" being your config object, not your config file.

then:

		var passport = pe.passport
		,	User = pe.User
		,	pe-routes = pe.routes

passport is the normal passport object, augmented with a few utils.
User is a user repo, overload the functions to store users and retrieve users
routes is a function that you can use to automatically add passport routes to your connect or express app:
	
	pe-routes(app);

