app.controller('homeController', function($scope, $location, $rootScope, $http, $localStorage) {
    $localStorage.$reset();
    $http.get('http://localhost:8080/rooms')
        .then(function(res) {
            $scope.rooms = res.data;
        })
        .catch(function(err) {
            console.log(err)
        })
    $scope.createUser = function() {
        $scope.$storage = $localStorage.$default({
            username: $scope.user.username,
            room: $scope.user.room
        });
        console.log($scope.$storage)
        $location.path('chat');
    }
})