app.filter('filterClientTable', function () {
    return function (input, search) {
        if (!input) return input;
        if (!search || (!search.nome && !search.acesso && !search.cnpjCpf && !search.cep)) return input;
        var result = {};
        angular.forEach(input, function (value, key) {
            var nome = ('' + value.nome).toLowerCase().trim(),
                acesso = ('' + value.acesso).toLowerCase().trim(),
                cnpjCpf = ('' + value.cnpjCpf).toLowerCase().trim(),
                cep = ('' + value.cep).toLowerCase().trim(),
                snome = ('' + search.nome).toLowerCase().trim(),
                sacesso = ('' + search.acesso).toLowerCase().trim(),
                scnpjCpf = ('' + search.cnpjCpf).toLowerCase().trim();
            scep = ('' + search.cep).toLowerCase().trim();

            if ((snome.length > 0 && nome.indexOf(snome) !== -1 ) || (sacesso.length > 0 && acesso.indexOf(sacesso) !== -1) || (scnpjCpf.length > 0 && cnpjCpf.indexOf(scnpjCpf) !== -1) || (scep.length > 0 && cep.indexOf(scep) !== -1 )) {
                result[key] = value;
            }
        });
        return result;
    }
});

app.controller("clientTableController", function ($scope, $http) {
    $scope.client = {
        table: {}
    };

    $scope.clearSearch = function () {
        $scope.client.search = {};
    };

    $scope.clients = function () {
        $http.post(base_url + 'client/clients', {}).then(function (response) {
            switch (response.data.response) {
                case 0: // Internal Error
                    show("Falha de conexão, verifique sua internet", 4);
                    break;
                case 1: // Successful
                    $scope.client.table = response.data.client;
                    break;
                case 2: // Error
                    show(response.data.message, 3);
                    break;
                default:
                    show("Fatal Error", 4)
            }
        }, function (response) {
            console.log(response);
        });
    };

    $scope.selectAll = function () {
        alert("select All");
    }
});

app.controller("clientSearchController", function ($scope) {
    $scope.minuta = "";
});

app.controller("clientRegisterController", function ($scope, $window, $http, $filter) {
    $scope.client = {
        gen: {
            edit: false
        },
        con: {
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
        table: {
            bank: [],
            city: []
        },
        modal: {
            email: {},
            bank: {}
        },
        comboVal: {}
    };

    // Functions
    $scope.combo = function () {
        $http.post(base_url + 'ComboVal/combo', {type: ['estado', 'pais', 'banco']}).then(function (response) {
            switch (response.data.response) {
                case 0: // Internal Error
                    show("Falha de conexão, verifique sua internet", 4);
                    break;
                case 1: // Successful
                    $scope.client.comboVal = response.data;
                    break;
                case 2: // Error
                    show(response.data.message, 3);
                    break;
                default:
                    show("Fatal Error", 4)
            }
            $('input.autocomplete').each(function () {
                $(this).autocomplete({
                    data: response.data[$(this).data('el')],
                    limit: 20
                });
            });
        }, function (response) {
            console.log(response);
        });
    };

    $scope.updateAddress = function (item) {
        $scope.client.con.input = {
            endereco: {
                idEnderecoPessoa: item.IDEnderecoPessoa,
                cidade: item.cidade,
                idEstado: item.IDEstado,
                idPais: item.IDPais,
                cep: item.cep,
                logradouro: item.logradouro,
                bairro: item.bairro,
                numero: item.numero,
                complemento: item.complemento
            }
        }
    };

    $scope.infoClient = function ($client) {
        $http.post(base_url + 'client/infoClient', {client: $client}).then(function (response) {
            console.log(response.data);
            switch (response.data.response) {
                case 0: // Internal Error
                    show("Falha de conexão, verifique sua internet", 4);
                    break;
                case 1: // Successful
                    $scope.client.gen = response.data.client.gen;
                    $scope.client.con = response.data.client.con;
                    $scope.client.user = response.data.client.user;
                    $scope.client.bank = response.data.client.bank;
                    $scope.client.table = response.data.client.table;
                    break;
                case 2: // Error
                    show(response.data.message, 3);
                    break;
                default:
                    show("Fatal Error", 4)
            }
        }, function (response) {
            show(response.statusText);
        });
    };

    $scope.add = function () {
        //if ($scope.city.$valid){
        $scope.client.table.city.push({
            'cidadeOrigem': $scope.client.city.input.cidadeOrigem,
            'cidadeDestino': $scope.client.city.input.cidadeDestino,
            'anexo': ($scope.client.city.files.length > 0) ? "Sim" : "Não",
            'observacao': $scope.client.city.input.observacao,
            'anexos': $scope.client.city.files
        });
        $scope.client.city.files = [];
        $scope.client.city.input = {}
        // }else{
        //     show("Preencha todos os campos!", 3);
        // }
    };

    $scope.edit = function ($ev, $el) {
        $scope['client'][$el]['edit'] = !$scope['client'][$el]['edit'];
        $ev.preventDefault();
    };

    $scope.save = function ($ev) {
        var form = $ev.target.name;
        var url = $ev.target.action;
        var params = {
            idClient: $scope.client.id
        };

        console.log($scope.client);

        params[form] = $scope.client[form].input;

        console.log(params[form]);

        $http.post(url, params).then(function (response) {
            console.log(response.data);
            switch (response.data.response) {
                case 0: // Internal Error
                    show("Falha de conexão, verifique sua internet", 4);
                    break;
                case 1: // Successful
                    show(response.data.message, 2);
                    $scope['client'][form]['edit'] = false;
                    switch (form) {
                        case 'con':
                            $scope.client.con.input.endereco.idEnderecoPessoa = response.data.data[0].id;
                            break;
                        case "gen":
                            console.log(response.data);
                            $scope.client.gen.input.codigoAcesso = response.data.data[0].codigoAcesso;
                            $scope.client.id = response.data.data[0].id;
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
        }, function (response) {
            console.log(response);
        });
    };

    $scope.selectAll = function ($el) {
        $scope.client.table[$el].selected = !$scope.client.table[$el].selected;
        angular.forEach($scope.client.table[$el], function (item) {
            item.selected = $scope.client.table[$el].selected;
        });
    };

    $scope.editBank = function ($el) {
        $scope.client.modal.bank.el = $el;
        $scope.client.modal.bank.input = angular.copy($scope.client.table.bank[$el]);
    };

    $scope.saveBank = function ($ev) {
        $scope.client.modal.bank.run = true;
        var url = $ev.target.action;
        var form = $ev.target.name;
        var params = {
            type: form,
            client: $scope.client.num,
            input: $scope.client.modal.bank.input
        };
        $http.post(url, params).then(function (response) {
            switch (response.data.response) {
                case 0: // Internal Error
                    show("Falha de conexão, verifique sua internet", 4);
                    break;
                case 1: // Successful
                    $scope.client.table.bank[$scope.client.modal.bank.el] = angular.copy($scope.client.modal.bank.input);
                    $scope.client.table.bank[$scope.client.modal.bank.el].emAberto = $scope.client.modal.bank.input.status == 2 ? "Sim" : "Não";
                    if ($scope.client.modal.bank.input.dataVencimento.length == 0) {
                        $scope.client.table.bank[$scope.client.modal.bank.el].dataVencimento = "N/A";
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
            $scope.client.modal.bank.run = false;
        }, function (response) {
            $scope.client.modal.bank.run = true;
            show("Fatal Error", 4);
        });
    };

    $scope.searchCep = function ($el) {
        var cep = $scope.client[$el]['input']['endereco']['cep'];
        if (cep != null && cep.length == 8) {
            var url = base_url + 'ajax/cep/' + cep;
            $http.post(url, {}).then(function (response) {
                var numero = $scope.client[$el]['input']['endereco']['numero'],
                    complemento = $scope.client[$el]['input']['endereco']['complemento'],
                    id = $scope.client[$el]['input']['endereco']['idEnderecoPessoa'];
                $scope.client[$el]['input']['endereco'] = response.data;
                var filter = $filter('filter')($scope.client.comboVal.estado, function (d) {
                    return d.estado === response.data['estado'];
                })[0];
                $scope.client[$el]['input']['endereco']['idEstado'] = (filter != null) ? filter['e'] : '';
                $scope.client[$el]['input']['endereco']['numero'] = numero;
                $scope.client[$el]['input']['endereco']['complemento'] = complemento;
                if (id != null) {
                    $scope.client[$el]['input']['endereco']['idEnderecoPessoa'] = id;
                }
            }, function (response) {
                show(response.statusText, 2);
            });
        }
    };

    if ($window.angularData !== null) {
        try {
            $scope.client.bank = {
                input: {
                    formaPagamento: $window.angularData.gen.formaPagamento
                },
                invoices: $window.angularData.invoices
            };

            $scope.client.user = {
                users: $window.angularData.users,
                input: {
                    username: $window.angularData.gen.codigoAcesso
                }
            };

            $scope.client.bank.input.formaPagamento = $scope.client.id = $window.angularData.gen.id;
            $scope.client.gen.input = $window.angularData.gen;
            $scope.client.con.adresses = $window.angularData.con;
            $scope.client.table.input = $window.angularData.table;
            if ($scope.client.con.adresses.length > 0) {
                $scope.updateAddress($scope.client.con.adresses[0]);
            }
            if ($window.angularData.mails.length > 0) {
                $scope.client.gen.input.email = $window.angularData.mails[$window.angularData.mails.length - 1].email;
            }

            if ($window.angularData.phones.length > 0) {
                switch ($window.angularData.phones.length) {
                    case 1:
                        $scope.client.gen.input.tel1 = $window.angularData.phones[0].numeroTelefone;
                        break;
                    case 2:
                        $scope.client.gen.input.tel1 = $window.angularData.phones[1].numeroTelefone;
                        $scope.client.gen.input.tel1 = $window.angularData.phones[2].numeroTelefone;
                        break;
                    default:
                        break;
                }
            }
        } catch (error) {
            console.log(error);
        }

    }
});
