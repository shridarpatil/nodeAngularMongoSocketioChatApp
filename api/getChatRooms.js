function getChatRooms(req, res){

	var chatRooms = require('../models/chatRooms.js');
	chatRooms.find({}, function(err, rooms) {
		if (err) throw err;

		  // object of all the rooms
		  sendJSONResponse(res, rooms);
		});
}

module.exports = getChatRooms;