var app = angular.module('app', ['ngRoute', 'ngResource']);


app.service('sharedProperties', function ($rootScope) {
    var edited_item = {
        
    };
    
    var current_user = {
        _id: "",
        name: "", 
        password: "",
        username: "",
        address: "",
        city: "",
        zip: "",
        state: "",
        items: []
    };
    
    return {
        setUser: function(value) {
            current_user = value;
        },
        getUser: function() {
            return current_user;
        },
        setItem: function(value) {
            edited_item = value;
        },
        getItem: function() {
            return edited_item;
        },
        getUsername: function () {
            return current_user.username;
        },
        setUsername: function(value) {
            current_user.username = value;
            $rootScope.username = value;
        },
        getPassword: function () {
            return current_user.password;
        },
        setPassword: function(value) {
            current_user.password = value;
        }
    };
});

app.factory('profile_route', function($resource){
    return $resource('/api/profile/:id');
});

app.factory('item_route', function($resource){
    return $resource('/api/item/:id');
});

app.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'main.html',
            controller: 'authController'
        })
        .when('/login', {
            templateUrl: 'login.html',
            controller: 'authController'
        })
        .when('/register', {
            templateUrl: 'register.html',
            controller: 'authController'
        })
        .when('/profile', {
            templateUrl: 'profile.html',
            controller: 'authController'
        })
        .when('/items', {
            templateUrl: 'items.html',
            controller: 'itemController'
        })
        .when('/dashboard', {
            templateUrl: 'dashboard.html'
        })
        .when('/add', {
            templateUrl: 'add.html',
            controller: 'itemController'
        })
        .when('/edit', {
            templateUrl: 'edit.html',
            controller: 'itemController'
        });
});

app.run(function($rootScope){
    $rootScope.authenticated = false;
});


