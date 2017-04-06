app.controller('chatController', function($scope, $rootScope, $localStorage, $http) {
    var socket = io.connect('http://localhost:8080');
    // on connection to server, ask for user's name with an anonymous callback
    socket.on('connect', function() {
        // call the server-side function 'adduser' and send one parameter (value of prompt)
        socket.emit('adduser', $localStorage.username, $localStorage.room);
    });
    $scope.message = [];
    socket.on('updatechat', function(username, data) {
        if ($localStorage.username == username) {
            var cls = "mymsg";
        } else if (username == "SERVER") {
            cls = "server"
            username = '';
        } else {
            cls = "others"
        }
        // Do this to clean up the form fields
        $scope.message.push({
            message: data,
            name: username,
            classes: cls
        });
        $scope.$apply();
        var off = $('li:last-child').offset().top;
        $('#chatBox').scrollTop(off);

    });

    $scope.sendMessage = function() {
        $scope.msg = $scope.newMessage;
        $scope.newMessage = '';
        socket.emit('sendchat', $scope.msg);
    }

    $scope.switchRoom = function(room) {
        socket.emit('switchRoom', room);
    }
    $http.get('http://localhost:8080/rooms')
        .then(function(res) {
            $scope.rooms = res.data;
        })
        .catch(function(err) {
            console.log(err)
        })

    $scope.changeRoom = function() {
        if ($scope.room != '') {
            $localStorage.room = $scope.room;
            socket.emit('switchRoom', $scope.room);
        }
    }

})