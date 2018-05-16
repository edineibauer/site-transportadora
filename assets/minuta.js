app.filter('filterMinutaTable', function () {
    return function (input, search) {
        if (!input) return input;
        if (!search || (!search.cliente && !search.minuta)) return input;
        var result = {};
        angular.forEach(input, function (value, key) {
            var remetente = ('' + value.remetente).toLowerCase(),
                destinatario = ('' + value.destinatario).toLowerCase(),
                minuta = ('' + value.minuta).toLowerCase(),
                scliente = ('' + search.cliente).toLowerCase(),
                sminuta = ('' + search.minuta).toLowerCase();
            if ((scliente.length > 0 && remetente.indexOf(scliente) !== -1) || (scliente.length > 0 && destinatario.indexOf(scliente) !== -1) || (sminuta.length > 0 && minuta.indexOf(sminuta) !== -1)) {
                result[key] = value;
            }
        });
        return result;
    }
});

app.controller("minutaTabelaController", function ($scope, $http) {

    $scope.minuta = {
        tabela: {},
        lengths: [30, 70, 200, 500],
        offset: 1,
        length: 30,
        modal: {
            fatura: {
                titulo: "Informações de Fatura",
                procurarEndereco: false,
                enderecos: [],
                input: {
                    valor: 0,
                    minutas: []
                }
            },
            deletar: {
                input: {
                    minutas: []
                }
            }
        },
        info: {
            minutas: 'Procurando minutas'
        }
    };

    $scope.pagination = {
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

    $scope.clearSearch = function () {
        $scope.minuta.search = {};
    };

    $scope.saveFatura = function ($ev) {
        var url = $ev.target.action;
        var params = {
            "fatura": $scope.minuta.modal.fatura.input
        };
        if ($scope.frmFaturaModal.$valid) {
            $http.post(url, params).then(function (response) {
                if (response.data != null) {
                    $scope.minutas();
                    show(response.data.message, 2);
                    $('#fatura').modal('close');
                    $scope.minuta.modal.fatura.input = {valor: 0, minutas: []};
                } else {
                    show("Ocorreu um erro interno, tente novamente", MESSAGE.WARNING);
                }
            }, function (response) {
                console.log(response);
            });
        } else {
            show("Preencha os campos corretamente", MESSAGE.WARNING);
            return false;
        }
    };

    function paginationExe() {
        if ($scope.minuta.offset > 3) {
            $scope.pagination.primeiro = $scope.minuta.offset - 2;
            $scope.pagination.segundo = $scope.minuta.offset - 1;
            $scope.pagination.terceiro = $scope.minuta.offset;
            $scope.pagination.quarto = $scope.minuta.offset + 1;
            $scope.pagination.quinto = $scope.minuta.offset + 2;
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
            $(".pagination:eq(" + $scope.minuta.offset + ")").addClass("active");
            $(".pagination:eq(" + ($scope.minuta.offset + 6) + ")").addClass("active");
        }

        $scope.pagination.backActivePagination = $scope.minuta.offset <= 1 ? 'disabled' : 'waves-effect';
        $scope.pagination.nextActivePagination = $scope.minuta.tabela.length < $scope.minuta.length ? 'disabled' : 'waves-effect';
    }

    $scope.filterMinuta = function ($el) {
        if (!($scope.minuta.tabela.length < $scope.minuta.length && ($el > $scope.minuta.offset || $el === -1))) {
            switch ($el) {
                case -1:
                    $scope.minuta.offset++;
                    break;
                case -2:
                    $scope.minuta.offset--;
                    break;
                default:
                    $scope.minuta.offset = $el;
                    break;
            }
            $scope.minuta.offset = $scope.minuta.offset < 1 ? 1 : $scope.minuta.offset;
            $scope.minutas();
            paginationExe();
        }
    };

    $scope.minutas = function () {
        var param = {
            offset: $scope.minuta.offset,
            length: $scope.minuta.length
        };

        $http.post(base_url + 'minuta/minutas', param).then(function (response) {
            console.log(response.data);
            switch (response.data.response) {
                case 0: // Internal Error
                    show("Falha de conexão, verifique sua internet", 4);
                    break;
                case 1: // Successful
                    $scope.minuta.tabela = response.data.minuta;
                    break;
                case 2: // Error
                    if ($scope.minuta.offset > 1) {
                        $scope.filterMinuta(-2);
                    } else {
                        show(response.data.message, 3);
                        $scope.minuta.tabela = [];
                        $scope.minuta.info.minutas = "Não há minutas cadastradas";
                    }
                    break;
                default:
                    show("Fatal Error", 4)
            }
        }, function (response) {
            console.log(response);
        });
    };

    function filtroResponseMinutas(data) {
        switch (data.response) {
            case 0: // Internal Error
                show("Falha de conexão, verifique sua internet", 4);
                break;
            case 1: // Successful
                $scope.minuta.tabela = data.minuta;
                show($scope.minuta.tabela.length + " " + data.message, 2, 500);
                break;
            case 2: // Error
                show(data.message, 3, 500);
                $scope.minuta.tabela = [];
                $scope.minuta.info.minutas = "Não há minutas cadastradas";
                break;
            default:
                show("Fatal Error", 4)
        }
    }

    $scope.searchNomeCliente = function () {
        var param = {
            offset: $scope.minuta.offset,
            length: $scope.minuta.length,
            cliente: $scope.minuta.busca.cliente
        };

        $http.post(base_url + 'minuta/minutas', param).then(function (response) {
            filtroResponseMinutas(response.data);
        }, function (response) {
            console.log(response);
        });
    };

    $scope.searchNumeroFiscal = function () {
        var param = {
            offset: $scope.minuta.offset,
            length: $scope.minuta.length,
            fiscal: $scope.minuta.busca.fiscal
        };

        $http.post(base_url + 'minuta/minutas', param).then(function (response) {
            filtroResponseMinutas(response.data);
        }, function (response) {
            console.log(response);
        });
    };

    $scope.searchNumeroMinuta = function () {
        var minuta = $scope.minuta.busca.minuta.replace('FNX', '').replace('FX', '').replace('FN', '').replace('NX', '').replace("fnx", '').replace("fn", '').replace("nx", '').replace("fx", '');
        var param = {
            offset: $scope.minuta.offset,
            length: $scope.minuta.length,
            minuta: minuta
        };

        $http.post(base_url + 'minuta/minutas', param).then(function (response) {
            filtroResponseMinutas(response.data);
        });
    };

    /*
    $scope.updateTomadorServico = function ($el) {
        var endereco = '';
        var codigoAcesso = '';
        var cliente = '';
        switch ($el) {
            case '1':
                // endereco = $scope.minuta.tabela[$scope.minuta.modal.fatura.idTabela].logradouroOrigem + ', ' +
                // $scope.minuta.tabela[$scope.minuta.modal.fatura.idTabela].numeroOrigem +
                // ($scope.minuta.tabela[$scope.minuta.modal.fatura.idTabela].complementoOrigem != null ? ' - ' + $scope.minuta.tabela[$scope.minuta.modal.fatura.idTabela].complementoOrigem + ' - ' : ' - ') +
                // $scope.minuta.tabela[$scope.minuta.modal.fatura.idTabela].bairroOrigem + ' - ' +
                // $scope.minuta.tabela[$scope.minuta.modal.fatura.idTabela].cidadeOrigem + '/' +
                // $scope.minuta.tabela[$scope.minuta.modal.fatura.idTabela].siglaEstadoOrigem;
                codigoAcesso = $scope.minuta.tabela[$scope.minuta.modal.fatura.idTabela].caRemetente;
                cliente = $scope.minuta.tabela[$scope.minuta.modal.fatura.idTabela].idRemetente;
                break;
            case '2':
                // endereco = $scope.minuta.tabela[$scope.minuta.modal.fatura.idTabela].logradouroDestino + ', ' +
                // $scope.minuta.tabela[$scope.minuta.modal.fatura.idTabela].numeroDestino +
                // ($scope.minuta.tabela[$scope.minuta.modal.fatura.idTabela].complementoDestino != null ? ' - ' + $scope.minuta.tabela[$scope.minuta.modal.fatura.idTabela].complementoDestino + ' - ' : ' - ') +
                // $scope.minuta.tabela[$scope.minuta.modal.fatura.idTabela].bairroDestino + ' - ' +
                // $scope.minuta.tabela[$scope.minuta.modal.fatura.idTabela].cidadeDestino + '/' +
                // $scope.minuta.modal.fatura.input.endereco = endereco;
                // $scope.minuta.tabela[$scope.minuta.modal.fatura.idTabela].siglaEstadoDestino;
                codigoAcesso = $scope.minuta.tabela[$scope.minuta.modal.fatura.idTabela].caDestinataro;
                cliente = $scope.minuta.tabela[$scope.minuta.modal.fatura.idTabela].idDestinatario;
                break;
            case '3':
                $scope.minuta.modal.fatura.enderecos = [];
                $scope.minuta.modal.fatura.input.endereco = null;
                break;
            default:
        }
        $scope.minuta.modal.fatura.input.codigoAcesso = codigoAcesso;
        $scope.minuta.modal.fatura.input.cliente = cliente;
        // $scope.minuta.modal.fatura.input.endereco = endereco;
    };*/

    $scope.novaFatura = function ($el) {
        $scope.minuta.modal.fatura.input = {valor: 0, minutas: []};
        angular.forEach($scope.minuta.tabela, function (item) {
            if (item.selected) {
                $scope.minuta.modal.fatura.input.valor += parseFloat(item.valor);
                $scope.minuta.modal.fatura.input.minutas.pushIfNotExist(item.minuta);
            }
        });
        if ($scope.minuta.modal.fatura.input.minutas.length == 0) {
            $scope.minuta.modal.fatura.input.minutas.pushIfNotExist($scope.minuta.tabela[$el].minuta);
        }
        if ($scope.minuta.modal.fatura.input.minutas.length == 1) {
            $scope.minuta.modal.fatura.idTabela = $el;
            $scope.minuta.modal.fatura.input.valor = parseFloat($scope.minuta.tabela[$el].valor);
            $scope.minuta.modal.fatura.input.docFiscal = $scope.minuta.tabela[$el].docFiscal;
            $scope.minuta.modal.fatura.input.numeroFatura = $scope.minuta.tabela[$el].fatura;
        }
    };

    $scope.close = function () {
        $scope.minuta.modal.fatura.input = {valor: 0, minutas: []};
        $scope.minuta.modal.fatura.enderecos = [];
    };

    $scope.selectAll = function () {
        $scope.minuta.tabela.selected = !$scope.minuta.tabela.selected;
        angular.forEach($scope.minuta.tabela, function (item) {
            item.selected = $scope.minuta.tabela.selected;
        });
    };

    $scope.$watch('minuta.modal.fatura.input.codigoAcesso', function (newValue, oldValue) {
        if (newValue === null) {
            return false;
        }
        if (newValue !== oldValue && newValue.length == 6) {
            $scope.minuta.modal.fatura.enderecos = [];
            $scope.minuta.modal.fatura.input.endereco = null;
            $scope.minuta.modal.fatura.input.cliente = null;
            $scope.minuta.modal.fatura.titulo = "Localizando o endereço do cliente";
            $scope.minuta.modal.fatura.procurarEndereco = true;
            $scope.searchPeople(newValue, 'pessoa', function (data) {
                $scope.minuta.modal.fatura.titulo = "Informações de Fatura";
                $scope.minuta.modal.fatura.procurarEndereco = false;
                $scope.minuta.modal.fatura.input.cliente = data.id;
                if ('endereco' in data && data.endereco != null) {
                    $scope.minuta.modal.fatura.enderecos = data.endereco;
                    // if(data.endereco.length > 1){
                    //     show('Mais de um endereço', MESSAGE.INFO);
                    //     $('#endereco').modal('open');
                    // }else{
                    //     console.log(data.endereco);
                    //     $scope.minuta.modal.fatura.input.endereco = data.endereco[0].logradouro + ', ' +
                    //     data.endereco[0].numero +
                    //     (data.endereco[0].complemento != null ? ' - ' + data.endereco[0].complemento + ' - ' : ' - ') +
                    //     data.endereco[0].bairro + ' - ' +
                    //     data.endereco[0].cidade + '/' +
                    //     data.endereco[0].estadoSigla + ' - ' +
                    //     data.endereco[0].cep;
                    // }
                } else {
                    show("Este cliente não possui endereço associado", MESSAGE.WARNING);
                }
            });
        }
    });

    $scope.searchPeople = function ($val, $people, callback) {
        var url = base_url + '/ajax/searchPeople';
        var params = {
            'people': $people,
            'val': $val
        };

        $http.post(url, params).then(function (response) {
            if (response.data.data != null) {
                callback(response.data.data);
            } else {
                show("Ocorreu um erro interno, tente novamente", MESSAGE.WARNING);
            }
            //angular.copy(response.data.data.endereco[0], $scope.coleta[$el]['input']['endereco']);
        }, function (response) {
            show(response.statusText, 4);
        });
    };

    $scope.deleteMinuta = function () {
        var params = {
            'val': $scope.minuta.modal.deletar.input.minutas
        };

        $http.post(base_url + 'minuta/delete', params).then(function (response) {
            if (response.data != null) {
                $scope.minutas();
                show(response.data.message, 2);
                $('#deletar').modal('close');
                $scope.minuta.modal.deletar.input = {minutas: []};
            } else {
                show("Ocorreu um erro interno, tente novamente", MESSAGE.ERROR);
            }
        }, function (response) {
            show(response.statusText);
        });
    };

    $scope.deletar = function ($el) {
        $scope.minuta.modal.deletar.input = {minutas: []};
        angular.forEach($scope.minuta.tabela, function (item) {
            if (item.selected) {
                $scope.minuta.modal.deletar.input.minutas.pushIfNotExist(item.minuta);
            }
        });
        if ($scope.minuta.modal.deletar.input.minutas.length == 0) {
            $scope.minuta.modal.deletar.input.minutas.pushIfNotExist($scope.minuta.tabela[$el].minuta);
        }
    };

});