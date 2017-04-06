'use strict';
module.exports = routes;

function routes(app) {
    app.get('/users', require('./api/getUsers.js'))
    app.get('/rooms', require('./api/getChatRooms.js'))
    app.get('/chat/:room', require('./api/getAllChat.js'))
    app.post('/postRooms', require('./api/postChatRooms.js'))
    app.post('/chat', require('./api/postChatMessage.js'))
}
