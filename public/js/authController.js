app.controller('authController', function(profile_route, sharedProperties, $scope, $http, $location, $rootScope){
    $scope.user = sharedProperties.getUser();
    $scope.error_message = "";
    $scope.success_message = "";
    
    $http.get('/js/states.js').then(function(data){
        $scope.states = data.data;
    });
    
    $scope.toTitleCase = function(str) {
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    };
    
    $scope.update = function() {
        $scope.user.name = $scope.toTitleCase($scope.user.name);
        $scope.user.address = $scope.toTitleCase($scope.user.address);
        $scope.user.city = $scope.toTitleCase($scope.user.city);
        profile_route.save($scope.user, function(){
            $scope.success_message = 'Success!';
            sharedProperties.setUser($scope.user);
            $scope.user = sharedProperties.getUser();
        });
        $location.path('/dashboard');
    };
    
    $scope.signout = function() {
        $http.get('auth/signout');
        $rootScope.authenticated = false;
        sharedProperties.setUser({});
        $scope.user = sharedProperties.getUser();
        $location.path('/');
    };
    
    $scope.login = function() {
        $http.post('/auth/login', $scope.user).success(function(data) {
            if(data.state == 'success'){
                $rootScope.authenticated = true;
                sharedProperties.setUser(data.user);
                $scope.user = sharedProperties.getUser();
                $location.path('/dashboard');
            }
            else {
                $scope.error_message = data.message;
            }
        });
    };
   
    $scope.register = function() {
        if($scope.user.password === $scope.user.verifyPassword){
            $http.post('/auth/signup', $scope.user).success(function(data){
                if(data.state == 'success'){
                    $rootScope.authenticated = true;
                    sharedProperties.setUser(data.user);
                    $location.path('/dashboard');
                }
                else{
                    $scope.error_message = data.message;
                }
            });
        } else{
            $scope.user.password = "";
            $scope.user.verifyPassword = "";
            $scope.error_message = 'Passwords do not match';
        }
    };
    
});
