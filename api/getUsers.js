function users(req, res){

	var User = require('../models/user.js');
	User.find({}, function(err, users) {
		if (err) throw err;

		  // object of all the users
		  sendJSONResponse(res, users);
		});
}

module.exports = users;