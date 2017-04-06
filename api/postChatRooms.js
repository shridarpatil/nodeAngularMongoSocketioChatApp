function post(req, res){

	var chatRooms = require('../models/chatRooms.js');
	var room = new chatRooms(req.body);

	room.save(function (err, room) {
		if (err) return console.error(err);
		sendJSONResponse(res, 'success');
	});

}

module.exports = post;