app.controller("logController", function($scope){
    $scope.log = {
        logs: window.angularData.logs,
        dates: window.angularData.dates,
        info: {
            table: "Localizando as logs"
        }
    };

    $scope.reloadPage = function($page){
        location.assign(base_url + 'log/' + $page);
    };

    console.log(window.angularData);
});