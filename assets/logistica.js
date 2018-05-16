app.config(function ($routeProvider) {
    $routeProvider
        .when("/minuta", {
            templateUrl: "minuta",
            controller: "minutaTabelaController"
        })
        .when("/guarda-volumes", {
            templateUrl: "cloakroom"
        })
        .when("/simulacao", {
            templateUrl: "simulation"
        })
        .when("/coleta", {
            templateUrl: "customer/coleta",
            controller: "coletaController"
        }).otherwise({
        template : "<h1>None</h1><p>Nothing has been selected</p>"
    });
});