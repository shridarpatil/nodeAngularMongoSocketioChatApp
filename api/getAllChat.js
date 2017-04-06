function get(req, res){

	var chat = require('../models/chat.js');
	chat.find({"room":req.params.room}, function(err, rooms) {
		if (err) throw err;

		  // object of all the rooms
		  sendJSONResponse(res, rooms);
		});

}

module.exports = get;
