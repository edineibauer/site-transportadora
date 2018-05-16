app.controller("reportController", function($scope, $http){

    $scope.buscando = false;
    $scope.report = {
        filter: {
            input: {
                endDate:  moment().format('DD/MM/YYYY'),
                estadoOrigem: 4,
                infoMinuta: {
                    valor: true,
                    numeroNotasFiscais: true,
                    valorNotasFiscais: true,
                    custoTransporte: true,
                    observacao: true,
                    dataColeta: true,
                    statusNow: true
                }
            }
        },
        info: {
            table: "Utilize a sessão de filtro para gerar o relatório",
            combo: 'Carregando . . .'
        },
        comboVal: {},
        ocorrencia: {},
        total: 0
    };

    $scope.pagination = {
        limits: [30,50,100,200,500],
        limit: 30,
        offset: 1,
        primeiro: 1,
        segundo: 2,
        terceiro: 3,
        quarto: 4,
        quinto: 5,
        backActivePagination: 'disabled',
        nextActivePagination: 'waves-effect',
        class: {
            primeiro: 'active',
            segundo: 'waves-effect',
            terceiro: 'waves-effect',
            quarto: 'waves-effect',
            quinto: 'waves-effect'
        }
    };

    $scope.combo = function(){
        $http.post(base_url + 'ComboVal/combo', {type: ['estado']}).then(function(response){
            switch (response.data.response) {
                case 0: // Internal Error
                    show("Falha de conexão, verifique sua internet", 4);
                    break;
                case 1: // Successful
                    $scope.report.comboVal = response.data;
                    $scope.report.info.combo = "Selecione";
                    console.log($scope.report.comboVal);
                    $scope.report.filter.input.estadoOrigem = $scope.report.comboVal.estado[26].e;
                break;
                case 2: // Error
                    show(response.data.message, 3);
                    break;
                default:
                    show("Fatal Error", 4)
            }
        }, function(response){
            console.log(response);
        });
    };

    $scope.autoComplete = function(){
         $http.post(base_url + 'ComboVal/combo', {type: ['solicitante']}).then(function(response){
             $('#solicitante').autocomplete({
                data: response.data,
                limit: 20, 
                minLength: 1
            });
        }, function(response){
            console.log(response);
        });
    };

    $scope.selectAll = function(){
        $scope.report.table.selected = !$scope.report.table.selected;
        angular.forEach($scope.report.table, function (item) {
            item.selected = $scope.report.table.selected;
        });
    };

    $scope.filterReport = function ($el) {
        if (!($scope.report.table.length < $scope.pagination.limit && ($el > $scope.pagination.offset || $el === -1))) {
            switch ($el) {
                case -1:
                    $scope.pagination.offset++;
                    break;
                case -2:
                    $scope.pagination.offset--;
                    break;
                default:
                    $scope.pagination.offset = $el;
                    break;
            }
            $scope.pagination.offset = $scope.pagination.offset < 1 ? 1 : $scope.pagination.offset;
            $scope.getReport();
            paginationExe();
        }
    };

    function paginationExe() {
        if ($scope.pagination.offset > 3) {
            $scope.pagination.primeiro = $scope.pagination.offset - 2;
            $scope.pagination.segundo = $scope.pagination.offset - 1;
            $scope.pagination.terceiro = $scope.pagination.offset;
            $scope.pagination.quarto = $scope.pagination.offset + 1;
            $scope.pagination.quinto = $scope.pagination.offset + 2;
            $(".pagination").removeClass("active");
            $(".pagination:eq(3)").addClass("active");
            $(".pagination:eq(9)").addClass("active");
        } else {
            $scope.pagination.primeiro = 1;
            $scope.pagination.segundo = 2;
            $scope.pagination.terceiro = 3;
            $scope.pagination.quarto = 4;
            $scope.pagination.quinto = 5;
            $(".pagination").removeClass("active");
            $(".pagination:eq(" + $scope.pagination.offset + ")").addClass("active");
            $(".pagination:eq(" + ($scope.pagination.offset + 6) + ")").addClass("active");
        }

        $scope.pagination.backActivePagination = $scope.pagination.offset <= 1 ? 'disabled' : 'waves-effect';
        $scope.pagination.nextActivePagination = $scope.report.table.length < $scope.pagination.limit ? 'disabled' : 'waves-effect';
    }

    $scope.getReport = function(){
        if (!checkInput($scope.report.filter.input)) {
            return false
        }

        $scope.buscando = true;
        $scope.report.info.table = "Buscando minutas relacionadas...";
        $http.post(base_url + 'report/getReport', {filter: $scope.report.filter.input, offset: $scope.pagination.offset, limit: $scope.pagination.limit}).then(function(response){
            console.log(response.data);

            $scope.buscando = false;
            if (response.data.dados.length === 0){
                $scope.report.info.table = "Nenhuma minuta encontrada";
                $scope.report.table = {};
                $scope.report.total = 0;
                show("Nenhum Resultado", 3);
            }else{
                $scope.report.table = response.data.dados;
                $scope.report.total = response.data.total;
                init();
                show($scope.report.total + " Resultados", 1);
            }
        }, function(){
            show("Fatal Error", 4);
        });
    };

    $scope.getOcorrenciaReport = function(id) {
        $scope.report.ocorrencia = [];
        $scope.report.ocorrencia.statusRequest = 0;
        $http.post(base_url + 'report/getOcorrencia', {minuta: id.replace('FNX', '')}).then(function(response){
            if(response.data.response === 1){
                $scope.report.ocorrencia = response.data.dados;
                $scope.report.ocorrencia.statusRequest = 1;
            } else if(response.data.response === 0) {
                $scope.report.ocorrencia.statusRequest = 2;
            }
        }, function(){
            show("Fatal Error", 4);
        });
    };

    function checkInput($el){
        var r = false;
        if (Object.keys($el).length === 0){
            return r;
        }
        angular.forEach($el, function(value, key) {
            if (value !== ""){
                r = true;
            }
        });
        return r;
    }

});