app.controller("coletaController", function ($scope, $http, $filter) {
    $scope.coleta = {
        btnDes: "Sem código",
        btnRem: "Sem código",
        send: false,
        endereco: {
            rem: {},
            des: {}
        },
        btnSend: {
            value: "ENVIAR"
        },
        rem: {
            input: {
                id: -1
            }
        },
        des: {
            input: {
                id: -1
            }
        },
        sol: {
            input: {}
        },
        comboVal: {
            estado: [],
            pais: [],
            conteudo: []
        },
        dataSol: {
            valor: 0,
            localColeta: "",
            localEntrega: ""
        },
        autocomplete: {
            sol: {
                nome: {}
            }
        }
    };

    post(base_url + "clienteColeta/loadBaseInfo", {}, function (data) {
        if(data) {
            if (data.tel1 === null)
                window.location = base_url + "cliente/conta?alert=telefone";
            else if (data.email === null)
                window.location = base_url + "cliente/conta?alert=email";

            $("#nomeSolicitante, #emailSolicitante, #telefone1Solicitante").attr("disabled", "disabled").attr("ng-disabled", "disabled").removeClass("validate invalid ng-valid ng-valid-required").removeAttr("ng-required required");

            $scope.coleta.sol.input = data;
            $scope.$apply();
        }
    });

    $scope.combo = function () {
        $http.post(base_url + 'ComboVal/combo', {type: ['estado', 'pais', 'conteudo']}).then(function (response) {
            switch (response.data.response) {
                case 0: // Internal Error
                    show("Falha de conexão, verifique sua internet", MESSAGE.ERROR);
                    break;
                case 1: // Successful
                    $scope.coleta.comboVal = response.data;
                    break;
                case 2: // Error
                    show(response.data.message, MESSAGE.WARNING);
                    break;
                default:
                    show("Fatal Error", MESSAGE.ERROR);
            }
        }, function (response) {
            console.log(response);
        });
    };

    $scope.$watch('[coleta.rem.input.endereco.logradouro, coleta.rem.input.endereco.numero, coleta.rem.input.endereco.bairro, coleta.rem.input.endereco.cidade, coleta.rem.input.endereco.idEstado, coleta.rem.input.endereco.cep, coleta.rem.input.endereco.complemento]', function (newValue, oldValue) {
        if (newValue != oldValue) {
            if($scope.coleta.rem.input.endereco !== null)
                $scope.coleta.sol.input.localColeta = $scope.coleta.rem.input.endereco.logradouro + ", " + $scope.coleta.rem.input.endereco.numero + " - " + $scope.coleta.rem.input.endereco.bairro + " - " + $scope.coleta.rem.input.endereco.cidade + "/" + $scope.coleta.rem.input.endereco.estadoSigla + " - " + $scope.coleta.rem.input.endereco.cep + " (" + $scope.coleta.rem.input.endereco.complemento + ")";
            else
                $scope.coleta.sol.input.localColeta = "";
        }
    }, true);

    $scope.$watch('[coleta.des.input.endereco.logradouro, coleta.des.input.endereco.numero, coleta.des.input.endereco.bairro, coleta.des.input.endereco.cidade, coleta.des.input.endereco.idEstado, coleta.des.input.endereco.cep, coleta.des.input.endereco.complemento]', function (newValue, oldValue) {
        if (newValue != oldValue) {
            if($scope.coleta.des.input.endereco !== null)
                $scope.coleta.sol.input.localEntrega = (typeof ($scope.coleta.des.input.endereco.logradouro) !== "undefined" ? $scope.coleta.des.input.endereco.logradouro : "") + ", " + $scope.coleta.des.input.endereco.numero + " - " + $scope.coleta.des.input.endereco.bairro + " - " + $scope.coleta.des.input.endereco.cidade + "/" + $scope.coleta.des.input.endereco.estadoSigla + " - " + $scope.coleta.des.input.endereco.cep + " (" + $scope.coleta.des.input.endereco.complemento + ")";
            else
                $scope.coleta.sol.input.localEntrega = "";
        }
    }, true);

    $scope.$watch('coleta.sol.input.nome', function (newValue, oldValue) {
        var identity = 'requester';
        var autocomplete = {
            data: angularData['autocomplete'][identity],
            val: newValue
        };

        var el = autocomplete.data.filter(function (a) {
            if (a.nome == autocomplete.val) {
                return a;
            }
        });

        if (el != null && el.length == 1) {
            var mail = [], phone = [];
            if (el[0]['email'] != null) {
                mail = el[0]['email'].split('#');
            }
            if (el[0]['telefone'] != null) {
                phone = el[0]['telefone'].split('#');
            }
            $scope.coleta.sol.input.email = mail[mail.length - 1];
            if (phone.length > 1) {
                $scope.coleta.sol.input.tel1 = phone[phone.length - 2];
                $scope.coleta.sol.input.tel2 = phone[phone.length - 1];
            } else {
                $scope.coleta.sol.input.tel1 = phone[phone.length - 1];
                $scope.coleta.sol.input.tel2 = null;
            }

        } else {
            $scope.coleta.sol.input.email = null;
            $scope.coleta.sol.input.tel1 = null;
            $scope.coleta.sol.input.tel2 = null

        }
    });

    $scope.show = function ($el) {
        $scope.coleta[$el]['show'] = !$scope.coleta[$el]['show'];
    };

    $scope.searchDoc = function ($el, $val) {
        if ($scope.coleta[$el].pessoa != null && $scope.coleta[$el].pessoa == 6) return false;
        var value = $scope.coleta[$el]['input'][$val];
        var doc = (value.length == 14 ? 'CNPJ' : 'CPF');
        if (value == null) return false;
        if (value.length < 11) return false;
        if (value.length > 11 && value.length < 14) return false;
        show("Analisando o " + doc + "&nbsp;<b>" + value + "</b>", 1, 2500);
        var url = base_url + 'clienteColeta/ajax';
        var params = {
            'people': 'pessoa',
            'val': value
        };

        $http.post(url, params).then(function (response) {
            if (response.data.data !== null) {
                if (response.data.response == 1) {
                    show("O " + doc + "&nbsp;<b>" + value + "</b>&nbsp;já está cadastrado com o cliente&nbsp;<b>" + response.data.data.codigoAcesso + "</b>", 3, 10000);
                } else {
                    show("O " + doc + "&nbsp;<b>" + value + "</b>&nbsp;não foi localizado", 3, 2500);
                }
            } else {
                show("Ocorreu um erro interno, tente novamente", 4);
            }
        }, function (response) {
            show(response.statusText, 3);
        });
    };

    $scope.searchPeople = function ($ev, $field, $people) {
        var url = $ev.target.action;
        var $el = ($ev.target.name != null ) ? $ev.target.name.substring(3).toLowerCase() : $ev;
        var params = {
            'people': $people,
            'val': $scope.coleta[$el][$field]
        };

        $scope.coleta[$el]['show'] = false;
        $scope.coleta[$el]['input'] = {
            endereco: {
                logradouro: "",
                numero: "",
                bairro: "",
                cidade: "",
                estado: "",
                idEstado: "",
                estadoSigla: "",
                complemento: "",
                cep: "",
                pais: "",
                paisSigla: "",
                idPais: ""
            }
        };

        $http.post(url, params).then(function (response) {
            if (response.data.data !== null) {
                $scope.coleta[$el]['show'] = (response.data.response == 1) ? true : false;
                $scope.coleta[$el]['input'] = response.data.data;
                show(response.data.message, response.data.response);
                if ('endereco' in response.data.data && response.data.data.endereco != null) {
                    if (response.data.data.endereco.length > 1) {
                        show('Mais de um endereço', 1);
                        $scope.coleta.endereco.name = $el;
                        $scope.coleta.endereco[$el].data = response.data.data.endereco;
                        $('#endereco').modal('open');
                    } else {
                        $scope.coleta[$el]['input']['endereco'] = response.data.data.endereco[0];
                    }
                }
            } else {
                show("Ocorreu um erro interno, tente novamente", 4);
            }
            //angular.copy(response.data.data.endereco[0], $scope.coleta[$el]['input']['endereco']);
        }, function (response) {
            show(response.statusText, 3);
        });
    };

    $scope.updateEndereco = function ($el, $val) {
        $scope.coleta[$el]['input']['endereco'] = {
            logradouro: "",
            numero: "",
            bairro: "",
            cidade: "",
            estado: "",
            idEstado: "",
            estadoSigla: "",
            complemento: "",
            cep: "",
            pais: "",
            paisSigla: "",
            idPais: ""
        };

        $scope.coleta[$el]['input']['endereco'] = $scope.coleta.endereco[$el].data[$val];
    };

    $scope.searchCep = function ($el) {
        var cep = $scope.coleta[$el]['input']['endereco']['cep'];
        var d = {
            num: $scope.coleta[$el]['input']['endereco']['numero'],
            comp: $scope.coleta[$el]['input']['endereco']['complemento']
        };

        if (cep !== null && cep.length === 8) {
            show('Localizando os dados do cep ' + cep, 1);
            var url = base_url + 'ajax/cep/' + cep;
            $http.post(url, {}).then(function (response) {
                $scope.coleta[$el]['input']['endereco'] = response.data;
                var filter = $filter('filter')($scope.coleta.comboVal.estado, function (d) {
                    return d.estado === response.data['estado'];
                })[0];
                $scope.coleta[$el]['input']['endereco']['idEstado'] = (filter != null) ? filter['e'] : '';
                $scope.coleta[$el]['input']['endereco']['numero'] = d.num;
                $scope.coleta[$el]['input']['endereco']['complemento'] = d.comp;
            }, function (response) {
                show(response.statusText, 2);
            });
        }
    };

    $scope.save = function ($ev) {
        var url = $ev.target.action;
        var params = {
            "sol": $scope.coleta.sol.input,
            "rem": $scope.coleta.rem.input,
            "des": $scope.coleta.des.input
        };
        if ($scope.frmRem.$valid && $scope.frmDes.$valid && $scope.frmCol.$valid) {
            $scope.coleta.btnSend.value = "ENVIANDO ...";
            $http.post(url, params).then(function (response) {
                console.log(response.data);
                if (response.data.response == 1) {
                    $scope.coleta.rem = {
                        input: {
                            id: -1,
                            endereco: {
                                logradouro: "",
                                numero: "",
                                bairro: "",
                                cidade: "",
                                estado: "",
                                idEstado: "",
                                estadoSigla: "",
                                cep: "",
                                pais: "",
                                paisSigla: "",
                                idPais: ""
                            }
                        }
                    };

                    $scope.coleta.des = {
                        input: {
                            id: -1,
                            endereco: {
                                logradouro: "",
                                numero: "",
                                bairro: "",
                                cidade: "",
                                estado: "",
                                idEstado: "",
                                estadoSigla: "",
                                cep: "",
                                pais: "",
                                paisSigla: "",
                                idPais: ""
                            }
                        }
                    };

                    $scope.coleta.sol.input = {};

                    $scope.coleta.rem.show = false;
                    $scope.coleta.des.show = false;

                    $scope.coleta.btnDes = "Sem código";
                    $scope.coleta.btnRem = "Sem código";

                    $scope.coleta.btnSend.value = "MINUTA CADASTRADA";
                    show("FNX" + pad(response.data.id, 8) + " - " + response.data.message, 2, 6000);
                } else {
                    show(response.data.message, 4);
                }

            }, function (response) {
                $scope.coleta.btnSend.value = "FALHA NO ENVIO";
                console.log(response);
            });
        } else {
            show("Preencha os campos corretamente", 2);
        }
    }
});