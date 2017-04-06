// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var chatRoomsSchema = new Schema({
  roomName: String,
  created_at: Date,
  updated_at: Date
});

// the schema is useless so far
// we need to create a model using it
var chatRooms = mongoose.model('room', chatRoomsSchema);

// make this available to our users in our Node applications
module.exports = chatRooms;