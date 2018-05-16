app.controller("agentTableController", function($scope, $http){
    $scope.agent = {
        table: {}
    };

    $scope.agents = function(){
        $http.post(base_url + 'agent/agents', {}).then(function(response){
            switch (response.data.response) {
                case 0: // Internal Error
                    show("Falha de conexão, verifique sua internet", 4);
                    break;
                case 1: // Successful
                    $scope.agent.table = response.data.agent;
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
    }
});

app.controller("agentSearchController", function($scope){
    $scope.minuta = "";
});

app.controller("agentRegisterController", function($scope, $http, $filter){
    $scope.agent = {
        gen:{
            edit: false
        },
        con:{
            edit: false
        },
        bank: {
            edit: false
        },
        city: {
            edit: false,
            files: {}
        },
        user: {
            edit: false
        },
        table:{
            bank: [],
            city: []
        },
        modal: {
            email: {},
            bank    : {}
        },
        comboVal: {}
    };

    // Functions
    $scope.combo = function(){
        $http.post(base_url + 'ComboVal/combo', {type: ['estado', 'pais', 'banco']}).then(function(response){
            switch (response.data.response) {
                case 0: // Internal Error
                    show("Falha de conexão, verifique sua internet", 4);
                    break;
                case 1: // Successful
                    $scope.agent.comboVal = response.data;
                break;
                case 2: // Error
                    show(response.data.message, 3);
                    break;
                default:
                    show("Fatal Error", 4)
            }
            $('input.autocomplete').each(function(){
                $(this).autocomplete({
                    data: response.data[$(this).data('el')],
                    limit: 20
                });
            });
        }, function(response){
            console.log(response);
        });
    };

    $scope.infoAgent = function($agent){
        $http.post(base_url + 'agent/infoAgent', {agent: $agent}).then(function(response){
            switch (response.data.response) {
                case 0: // Internal Error
                    show("Falha de conexão, verifique sua internet", 4);
                    break;
                case 1: // Successful
                    $scope.agent.gen = response.data.agent.gen;
                    $scope.agent.con = response.data.agent.con;
                    $scope.agent.user = response.data.agent.user;
                    $scope.agent.bank = response.data.agent.bank;
                    $scope.agent.table =  response.data.agent.table;
                break;
                case 2: // Error
                    show(response.data.message, 3);
                    break;
                default:
                    show("Fatal Error", 4)
            }
        }, function(response){
            show(response.statusText);
        });
    };

    $scope.add = function(){
        //if ($scope.city.$valid){
            $scope.agent.table.city.push({
                'cidadeOrigem': $scope.agent.city.input.cidadeOrigem,
                'cidadeDestino': $scope.agent.city.input.cidadeDestino,
                'anexo': ($scope.agent.city.files.length > 0) ? "Sim" : "Não",
                'observacao': $scope.agent.city.input.observacao,
                'anexos': $scope.agent.city.files
            });
            $scope.agent.city.files = [];
            $scope.agent.city.input = {}
        // }else{
        //     show("Preencha todos os campos!", 3);
        // }
    };

    $scope.edit = function($ev, $el){
        $scope['agent'][$el]['edit'] = !$scope['agent'][$el]['edit'];
        $ev.preventDefault();
    };

    $scope.save = function($ev){
        var form = $ev.target.name;
        var url = $ev.target.action;
        var params = {
            idAgent : $scope.agent.num
        };

        params[form] = $scope.agent[form].input;
        if ('file' in params[form] && params[form].file.length > 0){
            var fd = new FormData();
            for (var i = 0; i < params[form].file.length; i++){
                fd.append("file"+i, params[form].file[i]);
            }

            for (var key in params) {
                if (angular.isObject(params[key])){
                    fd.append(key, JSON.stringify(params[key], function(a,b){
                        if (a === 'file') return undefined;
                        else return b;
                    }));
                }else{
                    fd.append(key, params[key]);
                }
            }

            $http.post(url, fd, {
                withCredentials: true,
                headers: {'Content-Type': undefined },
                transformRequest: angular.identity
            }).then(function(response){
                switch (response.data.response) {
                    case 0: // Internal Error
                        show("Falha de conexão, verifique sua internet", 4);
                        break;
                    case 1: // Successful
                        show(response.data.message, response.data.response);
                        switch (form) {
                            case "atualizacao":
                                $scope.atualizacaoMinuta($scope.minuta.numero);
                                $scope.minuta.atualizacao = {file: []};
                                angular.element("#fileAtualizacao").val(null);
                                break;
                            case "ocorrencia":
                                $scope.ocorrenciaMinuta($scope.minuta.numero);
                                $scope.minuta.ocorrencia = {file: []};
                                angular.element("#fileOcorrencia").val(null);
                                break;
                            case 'min':
                                $scope['minuta'][form]['editar'] = false;
                                break;
                            default:
                        }
                        break;
                    case 2: // Error
                        show(response.data.message, 3);
                        break;
                    default:
                        show("Fatal Error", 4)
                }
            }, function(resp){
                console.log(resp);
            });

        }else{
            $http.post(url, params).then(function(response){
                switch (response.data.response) {
                    case 0: // Internal Error
                        show("Falha de conexão, verifique sua internet", 4);
                        break;
                    case 1: // Successful
                        show(response.data.message, 2);
                        $scope['agent'][form]['edit'] = false;
                        switch (form) {
                            case "gen":
                                $scope.agent.num = response.data.data[0].id;
                                break;
                            case 'min':
                                break;
                            default:
                        }
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
        }
    };

    $scope.selectAll = function($el){
        $scope.agent.table[$el].selected = !$scope.agent.table[$el].selected;
        angular.forEach($scope.agent.table[$el], function (item) {
            item.selected = $scope.agent.table[$el].selected;
        });
    };

    $scope.deleteCity = function($el){
        var url = base_url + 'agent/delete';
        var params = {
            input: $scope.agent.table.city[$el].cidadeAgente
        };
        $http.post(url, params).then(function(response){
            switch (response.data.response) {
                case 0: // Internal Error
                    show("Falha de conexão, verifique sua internet", 4);
                    break;
                case 1: // Successful
                    show(response.data.message, 2);
                    $scope.agent.table.city.splice($el, 1);
                    break;
                case 2: // Error
                    show(response.data.message, 3);
                    break;
                default:
                    show("Fatal Error", 4);
            }
            $scope.agent.modal.bank.run = false;
        }, function(){
            $scope.agent.modal.bank.run = true;
            show("Fatal Error", 4);
        });
    };

    $scope.editBank = function($el){
        $scope.agent.modal.bank.el = $el;
        $scope.agent.modal.bank.input = angular.copy($scope.agent.table.bank[$el]);
    };

    $scope.saveBank = function($ev){
        $scope.agent.modal.bank.run = true;
        var url = $ev.target.action;
        var form = $ev.target.name;
        var params = {
            type: form,
            agent : $scope.agent.num,
            input: $scope.agent.modal.bank.input
        };
        $http.post(url, params).then(function(response){
            switch (response.data.response) {
                case 0: // Internal Error
                    show("Falha de conexão, verifique sua internet", 4);
                    break;
                case 1: // Successful
                    $scope.agent.table.bank[$scope.agent.modal.bank.el] = angular.copy($scope.agent.modal.bank.input);
                    $scope.agent.table.bank[$scope.agent.modal.bank.el].emAberto = $scope.agent.modal.bank.input.status == 2 ? "Sim" : "Não";
                    if ($scope.agent.modal.bank.input.dataVencimento.length == 0){
                        $scope.agent.table.bank[$scope.agent.modal.bank.el].dataVencimento = "N/A";
                    }
                    show(response.data.message, 2);
                    $('#editBank').modal('close');
                    break;
                case 2: // Error
                    show(response.data.message, 3);
                    break;
                default:
                    show("Fatal Error", 4);
            }
            $scope.agent.modal.bank.run = false;
        }, function(){
            $scope.agent.modal.bank.run = true;
            show("Fatal Error", 4);
        });
    };

    $scope.searchCep = function($el){
        var cep = $scope.agent[$el]['input']['endereco']['cep'];
        if (cep != null && cep.length == 8){
            var url = base_url + 'ajax/cep/' + cep;
            $http.post(url, {}).then(function(response){
                $scope.agent[$el]['input']['endereco'] = response.data;
                var filter = $filter('filter')($scope.agent.comboVal.estado, function (d) {return d.estado === response.data['estado'];})[0];
                $scope.agent[$el]['input']['endereco']['idEstado'] = (filter != null) ? filter['e'] : '';
            }, function(response){
                show(response.statusText, 2);
            });
        }
    }
});
