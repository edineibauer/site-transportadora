app.controller("dashboardController", function ($scope) {
    $scope.notificacoes = [];
    $scope.resposta = {};

    $scope.notificacoesLoad = function () {
        post(base_url + "dashboard/notificacoes", {}, function (data) {
            $scope.notificacoes = data;
            $scope.$apply();
        });
    };

    $scope.deleteNot = function (id) {
        post("dashboard/removeNotificacao", {id: id}, function () {
            $("#not-" + id).remove();
            show("notificação excluída", 4, 1000);
        });
    };

    $scope.responderNot = function () {
        post("dashboard/responderNotificacao", $scope.resposta, function () {
            show("mensagem enviada", 2);
        });
    };
});

app.controller("clienteController", function ($scope) {
    $scope.faturas = [];
    $scope.remessas = [];

    function readFatura() {
        post(base_url + "dashboard/faturas", {}, function (data) {
            $scope.faturas = data;
            $scope.$apply();
        });
    }

    function readRemessas() {
        post(base_url + "dashboard/remessas", {}, function (data) {
            $scope.remessas = data;
            $scope.$apply();
        });
    }

    $scope.start = function () {
        readFatura();
        readRemessas();
    };

});
