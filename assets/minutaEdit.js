app.controller("minutaEditController", function ($scope, $location, $filter, $http) {
    $scope.minuta = {
        min: {
            editar: false,
            rem: {input: {}},
            sol: {input: {}},
            des: {input: {}}
        },
        sale: {input: {}},
        info: {
            atualizacao: 'Carregando informações da minuta',
            ocorrencia: 'Carregando ocorrencias da minuta',
            combo: 'Carregando . . .'
        },
        tabela: {
            atualizacao: {},
            ocorrencia: {},
            atualizacaoSelecteds: 0,
            ocorrenciaSelecteds: 0,
        },
        modal: {
            atualizacao: {
                titulo: "Alterar atualização da minuta"
            },
            ocorrencia: {
                titulo: "Alterar ocorrencia da minuta"
            }
        },
        atualizacao: {file: []},
        ocorrencia: {file: []},
        comboVal: {}
    };
    $scope.anexo = {};

    $scope.searchPeopleBase = function ($ev, $field, $people) {
        var url = $ev.target.action;
        var $el = ($ev.target.name !== null ) ? $ev.target.name.substring(3).toLowerCase() : $ev;
        if ($scope.minuta.min[$el][$field] !== undefined && $scope.minuta.min[$el][$field] !== null) {
            var params = {
                'people': $people,
                'val': $scope.minuta.min[$el][$field]
            };

            $scope.minuta.min[$el]['show'] = false;
            $scope.minuta.min[$el]['input'] = {
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
            };

            $http.post(url, params).then(function (response) {
                if (response.data.data !== null) {
                    $scope.minuta.min[$el]['show'] = response.data.response === 1;
                    $scope.minuta.min[$el]['input'] = response.data.data;
                    show(response.data.message, response.data.response);

                    if ('endereco' in $scope.minuta.min[$el]['input'] && $scope.minuta.min[$el]['input']['endereco'] !== null) {
                        if (response.data.data.endereco.length > 1) {
                            show('Mais de um endereço', 1);
                            $scope.minuta.min.endereco.name = $el;
                            $scope.minuta.min.endereco[$el].data = response.data.data.endereco;
                            $('#endereco').modal('open');
                        } else {
                            $scope.minuta.min[$el]['input']['endereco'] = response.data.data.endereco[0];
                        }
                    }
                } else {
                    show("Ocorreu um erro interno, tente novamente", 4);
                }
            }, function (response) {
                show(response.statusText, 3);
            });
        }
    };

    $scope.combo = function () {
        $http.post(base_url + 'ComboVal/combo', {type: ['estado', 'pais', 'conteudo', 'statusMinuta', 'agente']}).then(function (response) {
            switch (response.data.response) {
                case 0: // Internal Error
                    show("Falha de conexão, verifique sua internet", 4);
                    break;
                case 1: // Successful
                    $scope.minuta.comboVal = response.data;
                    $scope.minuta.info.combo = "Selecione";
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

    $scope.infoMinuta = function ($minuta) {
        $http.post(base_url + 'minuta/infoMinuta', {minuta: $minuta}).then(function (response) {
            switch (response.data.response) {
                case 0: // Internal Error
                    show("Falha de conexão, verifique sua internet", 4);
                    break;
                case 1: // Successful
                    $scope.minuta.min.rem.input = response.data.rem;
                    $scope.minuta.min.des.input = response.data.des;
                    $scope.minuta.min.sol.input = response.data.minuta;
                    $scope.minuta.sale.input = response.data.sale;
                    console.log($scope.minuta.sale.input);
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

    $scope.$watch('minuta.ocorrencia.agenteName', function (newValue, oldValue) {
        var autocomplete = {
            data: angularData['autocomplete']['agente'],
            val: newValue
        };

        var el = autocomplete.data.filter(function (a) {
            if (a.razaoSocialNome == autocomplete.val) {
                return a;
            }
        });

        if(el !== null && el.length === 1) {
            $scope.minuta.ocorrencia.agente = el[0]['id'];
        }
    });

    $scope.$watch('minuta.min.sol.input.nome', function (newValue, oldValue) {
        var autocomplete = {
            data: angularData['autocomplete']['requester'],
            val: newValue
        };

        var el = autocomplete.data.filter(function (a) {
            if (a.nome === autocomplete.val) {
                return a;
            }
        });

        if (el !== null && el.length === 1) {
            var mail = [], phone = [];
            if (el[0]['email'] !== null) {
                mail = el[0]['email'].split('#');
            }
            if (el[0]['telefone'] !== null) {
                phone = el[0]['telefone'].split('#');
            }
            $scope.minuta.min.sol.input.email = mail[mail.length - 1];
            if (phone.length > 1) {
                $scope.minuta.min.sol.input.tel1 = phone[phone.length - 2];
                $scope.minuta.min.sol.input.tel2 = phone[phone.length - 1];
            } else {
                $scope.minuta.min.sol.input.tel1 = phone[phone.length - 1];
                $scope.minuta.min.sol.input.tel2 = null;
            }

        } else {
            $scope.minuta.min.sol.input.email = null;
            $scope.minuta.min.sol.input.tel1 = null;
            $scope.minuta.min.sol.input.tel2 = null

        }
    });

    $scope.save = function ($ev) {
        var form = $ev.target.name;
        var url = $ev.target.action;
        var params = {
            idMinuta: $scope.minuta.numero,
            name: form
        };

        params[form] = $scope.minuta[form];

        if (params[form] == null){
            return false;
        }

        if (params[form].file) {

            fd = dadosEstendidosComFiles(params, form);

            $http.post(url, fd, {
                withCredentials: true,
                headers: {'Content-Type': undefined},
                transformRequest: angular.identity
            }).then(function (response) {
                saveResponse(response, form);
            }, function (resp) {
                console.log(resp);
            });

        } else {

            $http.post(url, params).then(function (response) {
                saveResponse(response, form);
            }, function (response) {
                console.log(response);
            });

        }
    };

    $scope.selectAll = function (id) {
        var check = !$("#selectAll-" + id).is(":checked");
        angular.forEach($scope.minuta.tabela[id], function (item) {
            item.selected = check;
        });
        $scope.minuta.tabela[id + 'Selecteds'] = check ? $scope.minuta.tabela[id].length : 0;
    };

    $scope.selectOne = function (id, index) {
        $scope.minuta.tabela[id + 'Selecteds'] = $scope.minuta.tabela[id + 'Selecteds'] + ($scope.minuta.tabela[id][index].selected ? 1 : -1);
    };

    $scope.deleteOneDadoEstendido = function(id, index) {
        angular.forEach($scope.minuta.tabela[id], function (item) {
            item.selected = false;
        });
        $scope.minuta.tabela[id][index].selected = true;
        $scope.minuta.tabela[id + 'Selecteds'] = 1;
        $("#selectAll-" + id).prop("checked", false);
    };

    $scope.dadosEstendidosUnSelect = function (id) {
        angular.forEach($scope.minuta.tabela[id], function (item) {
            item.selected = false;
        });
        $scope.minuta.tabela[id + 'Selecteds'] = 0;
        $("#selectAll-" + id).prop("checked", false);
    };

    $scope.deleteDadosEstendidos = function (id) {
        var idName = ucFisrt(id);

        function sortfunction(a, b){
            return (a < b)
        }
        var ids = [];
        var idIndex = [];
        var index = 1;
        angular.forEach($scope.minuta.tabela[id], function (item) {
            if (item.selected) {
                ids[item['ID' + idName + 'Minuta']] = item['ID' + idName + 'Minuta'];
                idIndex[index] = index;
            }
            index ++;
        });
        idIndex.sort(sortfunction);
		
		function filterId(id) {
			return id > 0;
		}
		ids = ids.filter(filterId); 

        $http.post(base_url + 'minuta/deleteDadosEstendidos' , {'name': id, 'id': ids}).then(function (response) {
            switch (response.data) {
                case "1":
                    $.each(idIndex, function (i, index) {
                        if(index) {
                            index--;
                            $scope.minuta.tabela[id].splice(index, 1);
                        }
                    });

                    $scope.dadosEstendidosUnSelect(id);
                    $("#delete" + idName).modal('close');
                    break;
                case "2":
                    Materialize.toast("id inválida", 2000);
                    break;
                default:
                    show("Erro Desconhecido", 4);
                    console.log(response.data);
            }
        });
    };

    $scope.loadAnexo = function(tipo, id) {
        $scope.anexo = {};
            $http.post(base_url + 'anexo/open/' + id, {tipo: tipo}).then(function (response) {
            switch (response.data.response) {
                case 0: // Internal Error
                    show("Falha de conexão, verifique sua internet", 4);
                    break;
                case 1: // Successful
                    $scope.anexo = response.data.anexo;

                    break;
                case 2: // Error
                    //show(response.data.message, 3);
                    $scope.minuta.info.ocorrencia = "Esta minuta não possui " + ucFisrt(id);
                    break;
                default:
                    show("Fatal Error", 4)
            }
        });
    };

    $scope.dadosEstendidosMinuta = function (id) {
        $http.post(base_url + 'minuta/' + id + 'Minuta', {minuta: $scope.minuta.numero}).then(function (response) {
            switch (response.data.response) {
                case 0: // Internal Error
                    show("Falha de conexão, verifique sua internet", 4);
                    break;
                case 1: // Successful
                    $scope.minuta.tabela[id] = response.data.dataResponse;
                    break;
                case 2: // Error
                    //show(response.data.message, 3);
                    $scope.minuta.info.ocorrencia = "Esta minuta não possui " + ucFisrt(id);
                    break;
                default:
                    show("Fatal Error", 4)
            }
        }, function (response) {
            show(response.statusText, 4);
        });
    };

    $scope.editarDadosEstendidosMinuta = function (tipo, id) {
        var tipoName = ucFisrt(tipo);
        $scope.minuta['edicao' + tipoName] = {file: []};

        $http.post(base_url + 'minuta/get' + tipoName + 'Minuta', {id: id}).then(function (response) {
            switch (response.data.response) {
                case 0: // Internal Error
                    Materialize.toast("Falha de conexão, verifique sua internet", 4);
                    break;
                case 1: // Successful
                    $scope.minuta['edicao' + tipoName] = response.data.data;
                    $scope.minuta['edicao' + tipoName]['valor'] = parseFloat($scope.minuta['edicao' + tipoName]['valor']);
                    break;
                case 2: // Error
                    Materialize.toast(tipoName + " não encontrada para Edição");
                    break;
                default:
                    show("Fatal Error", 4);
            }
        }, function (response) {
            show(response.statusText);
        });
    };

    $scope.addFile = function (files, $el) {
        $scope.minuta[$el].file = files && files.length > 0 ? files : $scope.minuta[$el].file ? $scope.minuta[$el].file : null;
    };

    $scope.deleteAnexo = function (id) {
        $http.post(base_url + 'minuta/deleteAnexo', {id: id}).then(function (response) {
            switch (response.data) {
                case "1": // Successful
                    break;
                case "2": // Erro
                    show("Anexo não encontrado", 4);
                    break;
                default:
                    show("Fatal Error", 4);
            }
        }, function (response) {
            show(response.statusText);
        });
    };

    $scope.people = function ($el, $people, $field) {
        if ($scope.minuta[$el[0]][$el[1]] != null && $scope.minuta[$el[0]][$el[1]][$field] != null) {
            var val = $scope.minuta[$el[0]][$el[1]][$field];
            $scope.searchPeople(val, $people, function (data) {
                $scope.minuta[$el[0]][$el[1]] = data;
                if ('endereco' in data && data.endereco != null) {
                    if (data.endereco.length > 1) {
                        show('Mais de um endereço', 1);
                        // $scope.coleta.endereco.name = $el;
                        // $scope.coleta.endereco[$el].data = response.data.data.endereco
                        // $('#endereco').modal('open');
                    } else {
                        $scope.minuta[$el[0]][$el[1]]['endereco'] = data.endereco[0];
                    }
                }
            })
        }

    };

    $scope.searchPeople = function ($val, $people, callback) {
        var url = base_url + 'ajax/searchPeople';
        var params = {
            'people': $people,
            'val': $val,
        }
        $http.post(url, params).then(function (response) {
            if (response.data.data != null) {
                callback(response.data.data);
            } else {
                show("Ocorreu um erro interno, tente novamente", MESSAGE.WARNING);
            }
            //angular.copy(response.data.data.endereco[0], $scope.coleta[$el]['input']['endereco']);
        }, function (response) {
            show(response.statusText, 2);
        });
    };

    $scope.searchCep = function ($el) {
        if ($scope.minuta.min[$el]['input']['endereco'] == null) {
            return false
        }
        var cep = $scope.minuta.min[$el]['input']['endereco']['cep'];
        var d = {
            num: $scope.minuta.min[$el]['input']['endereco']['numero'],
            comp: $scope.minuta.min[$el]['input']['endereco']['complemento'],
        }
        if (cep != null && cep.length == 8) {
            show('Localizando os dados do cep ' + cep, 1);
            var url = base_url + 'ajax/cep/' + cep;
            $http.post(url, {}).then(function (response) {
                $scope.minuta.min[$el]['input']['endereco'] = response.data;
                var filter = $filter('filter')($scope.minuta.comboVal.estado, function (d) {
                    return d.estado === response.data['estado'];
                })[0];
                $scope.minuta.min[$el]['input']['endereco']['idEstado'] = (filter != null) ? filter['e'] : '';
                $scope.minuta.min[$el]['input']['endereco']['numero'] = d.num;
                $scope.minuta.min[$el]['input']['endereco']['complemento'] = d.comp;
            }, function (response) {
                show(response.statusText, 2);
            });
        }
    };

    $scope.$watch('[minuta.min.rem.input.endereco.logradouro,' +
        'minuta.min.rem.input.endereco.numero,' +
        'minuta.min.rem.input.endereco.bairro,' +
        'minuta.min.rem.input.endereco.cidade,' +
        'minuta.min.rem.input.endereco.estado, ' +
        'minuta.min.rem.input.endereco.cep]',
        function (newValue, oldValue) {
            if (newValue != oldValue && $scope.minuta.min.rem.input.endereco !== null) {
                $scope.minuta.min.sol.input.localColeta =
                    ($scope.minuta.min.rem.input.endereco.logradouro !== undefined ? $scope.minuta.min.rem.input.endereco.logradouro : "") + ", " +
                    ($scope.minuta.min.rem.input.endereco.numero !== undefined ? $scope.minuta.min.rem.input.endereco.numero : "") + " - " +
                    ($scope.minuta.min.rem.input.endereco.bairro !== undefined ? $scope.minuta.min.rem.input.endereco.bairro : "") + " - " +
                    ($scope.minuta.min.rem.input.endereco.cidade !== undefined ? $scope.minuta.min.rem.input.endereco.cidade : "") + "/" +
                    ($scope.minuta.min.rem.input.endereco.estadoSigla !== undefined ? $scope.minuta.min.rem.input.endereco.estadoSigla : "") + " - " +
                    ($scope.minuta.min.rem.input.endereco.cep !== undefined ? $scope.minuta.min.rem.input.endereco.cep : "");
            }
        }, true);

    $scope.$watch('[minuta.min.des.input.endereco.logradouro,' +
        'minuta.min.des.input.endereco.numero,' +
        'minuta.min.des.input.endereco.bairro,' +
        'minuta.min.des.input.endereco.cidade,' +
        'minuta.min.des.input.endereco.estado,' +
        'minuta.min.des.input.endereco.cep]',
        function (newValue, oldValue) {
            if (newValue != oldValue) {
                $scope.minuta.min.sol.input.localEntrega =
                    $scope.minuta.min.des.input.endereco.logradouro + ", " +
                    $scope.minuta.min.des.input.endereco.numero + " - " +
                    $scope.minuta.min.des.input.endereco.bairro + " - " +
                    $scope.minuta.min.des.input.endereco.cidade + "/" +
                    $scope.minuta.min.des.input.endereco.estadoSigla + " - " +
                    $scope.minuta.min.des.input.endereco.cep;
            }
        }, true);

    function saveResponse(response, form) {
        switch (response.data.response) {
            case 0: // Internal Error
                show("Falha de conexão, verifique sua internet", 4);
                break;
            case 1: // Successful
                show(response.data.message, response.data.response);
                switch (form) {
                    case 'min':
                        $scope['minuta'][form]['editar'] = false;
                        break;
                    default:
                        $scope.minuta[form] = {file: []};
                        $("#"+ form +"_nome_file").val("");
                        $('#editarAtualizacao, #editarOcorrencia').modal('close');
                        if(form === "edicaoAtualizacao" || form === "edicaoOcorrencia") {
                            var formTemp = form.replace('edicao', '').toLowerCase();
                        } else {
                            formTemp = form;
                        }

                        $http.post(base_url + 'minuta/' + formTemp + 'Minuta', {minuta: $scope.minuta.numero}).then(function (response) {
                            switch (response.data.response) {
                                case 0: // Internal Error
                                    show("Falha de conexão, verifique sua internet", 4);
                                    break;
                                case 1: // Successful
                                    $scope.minuta.tabela[formTemp] = response.data.dataResponse;
                                    break;
                                case 2: // Error
                                    //show(response.data.message, 3);
                                    $scope.minuta.info.ocorrencia = "Esta minuta não possui " + ucFisrt(formTemp);
                                    break;
                                default:
                                    show("Fatal Error", 4)
                            }
                        }, function (response) {
                            show(response.statusText, 4);
                        });
                }
                break;
            case 2: // Error
                show(response.data.message, 3);
                break;
            default:
                show("Fatal Error", 4)
        }
    }

    function dadosEstendidosComFiles(params, form) {

        var fd = new FormData();
        for (var i = 0; i < params[form].file.length; i++) {
            fd.append("file" + i, params[form].file[i]);
        }
        for (var key in params) {
            if (angular.isObject(params[key])) {
                fd.append(key, JSON.stringify(params[key], function (a, b) {
                    return (a === 'file' ? undefined : b);
                }));
            } else {
                fd.append(key, params[key]);
            }
        }

        return fd;
    }
});