function post(data){

	var chat = require('../models/chat.js');
	var room = new chat(data);

	room.save(function (err, room) {
		if (err) return console.error(err);
		return
	});

}

module.exports = post;