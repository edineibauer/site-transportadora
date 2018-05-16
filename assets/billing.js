app.controller("billingTableController", function($scope, $http){
    $scope.billing = {
        table: {},
        info:{
            billings: 'Procurando Faturas'
        }
    };

    $scope.billings = function(){
        $http.post(base_url + 'billing/billings', {}).then(function(response){
            switch (response.data.response) {
                case 0: // Internal Error
                    show("Falha de conexão, verifique sua internet", 4);
                    break;
                case 1: // Successful
                console.log(response.data);
                    $scope.billing.table = response.data.billings;
                    show(response.data.message, 2);
                break;
                case 2: // Error
                    show(response.data.message, 3);
                    $scope.billing.table = [];
                    $scope.billing.info.billing = "Não há faturas cadastradas";
                    break;
                default:
                    show("Fatal Error", 4)
            }
        }, function(response){
            console.log(response);
        });
    };

    $scope.selectAll = function(){
        $scope.billing.table.selected = !$scope.billing.table.selected;
        angular.forEach($scope.billing.table, function (item) {
            item.selected = $scope.billing.table.selected;
        });
    }
});

app.filter('split', function() {
    return function(input, delimiter) {
        return input.split(delimiter || ',');
    }
});
