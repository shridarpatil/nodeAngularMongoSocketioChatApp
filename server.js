'use strict'
process.title = 'chatServer';

global.util = require('util');
var async = require('async');

require('./helpers/setUpLog.js');
require('./helpers/express/sendJSONResponse.js');


if (require.main === module) {
    init();
}

process.on('uncaughtException',
    function(err) {
        throwError('Uncaught Exception thrown.', util.inspect(err));
    });


function init(argument) {
    // body...
    var wallet = {
        app: global.app,
        config: {
            runMode: 'dev',
            apiPort: 8080

        }
    };

    wallet.me = util.format('chatServer_%s', init.name);

    async.series([
            createExpressApp.bind(null, wallet),
            initializeMongoose.bind(null, wallet),
            startListening.bind(null, wallet),
            initializeSockets.bind(null, wallet),
            initializeRoutes.bind(null, wallet),
            setLogLevel.bind(null, wallet)
        ],
        function(err) {
            if (err) {
                log.error('Could not initialize api app: ' + util.inspect(err));
            } else {
                log.info(wallet.me, 'Completed');
                global.app = wallet.app;
                module.exports = global.app;
            }
        })
}


function createExpressApp(wallet, nextFunc) {
    // body...
    try {
        var express = require('express')
        var app = express()
        app.use(require('body-parser').json());
        app.use(require('body-parser').urlencoded({ extended: false }));
        app.use(express.static(__dirname + '/public'));
        var http = require('http')
        wallet.app = app;
        app.use(function(req, res, next) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            res.setHeader('Access-Control-Allow-Headers', '*');
            res.setHeader('Access-Control-Allow-Credentials', true);
            next();
        });
        return nextFunc();
    } catch (err) {
        throwError('Error: Unable to create chatServer', err)
    }
}

function startListening(wallet, nextFunc) {
    var me = wallet.me + '_' + startListening.name;
    log.debug('Executing ->', me);
    var listenAddr = '0.0.0.0';
    var apiPort = wallet.config.apiPort;
    if (!apiPort)
        return nextFunc(
            console.log('error')
        );
    wallet.httpInstance = wallet.app.listen(apiPort, listenAddr,
        function(err) {
            if (err)
                return nextFunc(err);
            log.info('Server running on %s.', apiPort);

        }
    );

    return nextFunc();
}


function initializeSockets(wallet, nextFunc) {
    // body...
    var io = require('socket.io').listen(wallet.httpInstance);
    wallet.io = io;
    global.io = wallet.io;
    module.exports = global.io;

    var rooms = require('./nf/getAllRooms.js')


    wallet.rooms = rooms()

    log.info(wallet.rooms)
    console.log(wallet.rooms)
        // usernames which are currently connected to the chat
    var usernames = {};

    // rooms which are currently available in chat
    var rooms = ['room1', 'room2', 'room3'];
    console.log(rooms)
    io.sockets.on('connection', function(socket) {

        // when the client emits 'adduser', this listens and executes
        socket.on('adduser', function(username, roomName) {


            // store the username in the socket session for this client
            socket.username = username;
            // store the room name in the socket session for this client
            socket.room = roomName;
            // add the client's username to the global list
            usernames[username] = username;
            // send client to room 1
            socket.join(roomName);
            // echo to client they've connected
            socket.emit('updatechat', 'SERVER', 'you have connected to ' + roomName);
            // echo to room 1 that a person has connected to their room
            socket.broadcast.to('room1').emit('updatechat', 'SERVER', username + ' has connected to this room');
            socket.emit('updaterooms', rooms, roomName);
        });

        // when the client emits 'sendchat', this listens and executes
        socket.on('sendchat', function(data) {
            // we tell the client to execute 'updatechat' with 2 parameters
            io.sockets.in(socket.room).emit('updatechat', socket.username, data);
            var chat = require('./nf/postChat.js');
            chat({
                room: socket.room,
                from: socket.username,
                message: data,
                created_at: new Date()
            });


        });

        socket.on('switchRoom', function(newroom) {
            // leave the current room (stored in session)
            socket.leave(socket.room);
            // join new room, received as function parameter
            socket.join(newroom);
            socket.emit('updatechat', 'SERVER', 'you have connected to ' + newroom);
            // sent message to OLD room
            socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', socket.username + ' has left this room');
            // update socket session room title
            socket.room = newroom;
            socket.broadcast.to(newroom).emit('updatechat', 'SERVER', socket.username + ' has joined this room');
            socket.emit('updaterooms', rooms, newroom);
        });

        // when the user disconnects.. perform this
        socket.on('disconnect', function() {
            // remove the username from global usernames list
            delete usernames[socket.username];
            // update list of users in chat, client-side
            io.sockets.emit('updateusers', usernames);
            // echo globally that this client has left
            socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
            socket.leave(socket.room);
        });
    });


    return nextFunc();

}

function initializeMongoose(wallet, nextFunc) {
    // body...
    var me = wallet.me + '_' + initializeMongoose.name;
    var mongoose = require('mongoose');
    mongoose.connect('mongodb://localhost/chat');
    return nextFunc();
}


function initializeRoutes(wallet, nextFunc) {
    var me = wallet.me + '_' + initializeRoutes.name;
    try {
        require('./Routes.js')(wallet.app);

    } catch (Exception) {
        throwError('Error: Unable to create chatServer', err)
    }
    return nextFunc();
}

function setLogLevel(wallet, nextFunc) {
    var me = wallet.me + '_' + setLogLevel.name;
    //    log.debug('Executing ->', me );

    var logConfig = {};
    logConfig.runMode = wallet.config.runMode;
    log.debug('Setting log level as ' + logConfig.runMode);
    log.configLevel(logConfig);

    return nextFunc();
}


function throwError(whoAmIssage, err) {
    log.error(whoAmIssage);
    log.error(err);
    if (err.stack) log.error(err.stack);
    setTimeout(function() {
        process.exit();
    }, 3000);
}
