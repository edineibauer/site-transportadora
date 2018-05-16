

app.controller("minutaPrint", function($scope, $http){
    $scope.printInfo = function(){
        $http.post(base_url + 'minuta/infoPrint', {minuta: $scope.print.num}).then(function(response){
            $scope.print.minuta = response.data.print;
        }, function(response){
            show(response.statusText);
        });
    }
});