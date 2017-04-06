'use strict'
var self = getAllChatRooms;
module.exports = self;

function getAllChatRooms(){

	var chatRooms = require('../models/chatRooms.js');
	chatRooms.find({}, function(err, rooms) {
		if (err) throw err;
		  // object of all the rooms
		  return rooms//nextFunc();
		});
}

