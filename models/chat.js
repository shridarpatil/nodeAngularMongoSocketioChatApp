// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var chatSchema = new Schema({
  room: String,
  from: String,
  message: String,
  created_at: Date
});

// the schema is useless so far
// we need to create a model using it
var chat = mongoose.model('chat', chatSchema);

// make this available to our users in our Node applications
module.exports = chat;