function post(req, res){

	var chat = require('../nf/chat.js');
	var chatMessage = new chat(req.body);

	chatMessage.save(function (err, room) {
		if (err) return console.error(err);
		return sendJSONResponse(res, 'success');
	});

}

module.exports = post;


// function post(req, res){

// 	var chatRooms = require('../models/chatRooms.js');
// 	var room = new chatRooms(req.body);

// 	room.save(function (err, room) {
// 		if (err) return console.error(err);
// 		sendJSONResponse(res, 'success');
// 	});

// }

// module.exports = post;