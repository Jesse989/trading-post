app.controller('itemController', function(sharedProperties, item_route, $scope){
    $scope.user = sharedProperties.getUser();
    $scope.items = item_route.query();
    $scope.edited_item = sharedProperties.getItem();
    
    $scope.toTitleCase = function(str) {
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    };
    
    
    $scope.add = function() {
        $scope.new_item.current_owner = $scope.user._id;
        $scope.new_item.name = $scope.toTitleCase($scope.new_item.name);
        item_route.save($scope.new_item, function(err, success){
            if(err) return err;
            $scope.new_item = {};
            $scope.items = item_route.query();
        });
        $scope.changeLocation('#/items', true);
    };
    
    $scope.delete = function($event) {
        item_route.remove({id:$event.target.id});
        $scope.items = item_route.query();
        $scope.success_message = "Succesfully removed item";
    };
    
    $scope.edit = function($event) {
        sharedProperties.setItem(JSON.parse($event.target.id));
    };
    
    $scope.submit_edit = function() {
        item_route.save($scope.edited_item);
        $scope.items = item_route.query();
        $scope.changeLocation('#/dashboard', true);
    };
    
    $scope.propose_trade = function($event) {
        sharedProperties.setItem(JSON.parse($event.target.id));
        $scope.edited_item = sharedProperties.getItem();
        $scope.edited_item.proposed_owner = $scope.user._id;
        item_route.save($scope.edited_item);
        $scope.items = item_route.query();
    };
    
    $scope.transfer_owner = function($event) {
        sharedProperties.setItem(JSON.parse($event.target.id));
        $scope.edited_item = sharedProperties.getItem();
        $scope.edited_item.current_owner = $scope.edited_item.proposed_owner;
        $scope.edited_item.proposed_owner = undefined;
        item_route.save($scope.edited_item);
        $scope.items = item_route.query();
    };
    
    $scope.cancel_request = function($event) {
        sharedProperties.setItem(JSON.parse($event.target.id));
        $scope.edited_item = sharedProperties.getItem();
        $scope.edited_item.proposed_owner = undefined;
        item_route.save($scope.edited_item);
        $scope.items = item_route.query();
    };
    
    $scope.changeLocation = function(url, forceReload) {
        $scope = $scope || angular.element(document).scope();
        if(forceReload || $scope.$$phase) {
            window.location = url;
        }
    };
});
