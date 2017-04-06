var app = angular.module('app', ['ngRoute', 'ngStorage']);
app.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: "templates/home/",
            controller: "homeController"
        })
        .when('/chat', {
            resolve: {
                "check": function($location, $rootScope, $localStorage) {
                    if (!$localStorage.username || !$localStorage.room) {
                        $location.path('/');
                    }
                }
            },
            templateUrl: "templates/chat",
            controller: "chatController"
        })

    .otherwise({
        redirectTo: "/"
    })

})