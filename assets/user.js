app.controller("table-controller", function ($scope, $http) {

    $scope.closeStatus = true;
    $scope.busca = {};
    $scope.user = {
        tabela: {},
        lengths: [30, 70, 200, 500],
        offset: 1,
        length: 30,
        tipo: 'Usuários'
    };

    $scope.status = {
        0: {
            0: "Usuários",
            1: 0
        },
        1: {
            0: "Funcionarios",
            1: 0
        },
        2: {
            0: "Clientes",
            1: 0
        },
        3: {
            0: "Agentes",
            1: 0
        },
        4: {
            0: "Representantes",
            1: 0
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

    function paginationExe() {
        if ($scope.user.offset > 3) {
            $scope.pagination.primeiro = $scope.user.offset - 2;
            $scope.pagination.segundo = $scope.user.offset - 1;
            $scope.pagination.terceiro = $scope.user.offset;
            $scope.pagination.quarto = $scope.user.offset + 1;
            $scope.pagination.quinto = $scope.user.offset + 2;
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
            $(".pagination:eq(" + $scope.user.offset + ")").addClass("active");
            $(".pagination:eq(" + ($scope.user.offset + 6) + ")").addClass("active");
        }

        $scope.pagination.backActivePagination = $scope.user.offset <= 1 ? 'disabled' : 'waves-effect';
        $scope.pagination.nextActivePagination = $scope.user.tabela.length < $scope.user.length ? 'disabled' : 'waves-effect';
    }

    paginationExe();

    $scope.readStatus = function () {
        $http.post(base_url + 'user/status', {}).then(function (response) {
            switch (response.data.response) {
                case 0: // Internal Error
                    show("Falha de conexão, verifique sua internet", 4);
                    break;
                case 1: // Successful
                    $scope.status = response.data.status;
                    break;
                case 2: // Error
                    show(response.data.error, 3);
                    break;
                default:
                    show("Fatal Error", 4)
            }
        }, function (response) {
            console.log(response);
        });
    };

    $scope.closeStatus = function () {
        $scope.closeStatus = false;
    };

    $scope.filterUser = function ($el) {
        if (!($scope.user.tabela.length < $scope.user.length && ($el > $scope.user.offset || $el === -1))) {
            switch ($el) {
                case -1:
                    $scope.user.offset++;
                    break;
                case -2:
                    $scope.user.offset--;
                    break;
                default:
                    $scope.user.offset = $el;
                    break;
            }
            $scope.user.offset = $scope.user.offset < 1 ? 1 : $scope.user.offset;
            $scope.readUsers();
            paginationExe();
        }
    };

    $scope.selectAll = function () {
        $scope.user.tabela.selected = !$scope.user.tabela.selected;
        angular.forEach($scope.user.tabela, function (item) {
            item.selected = $scope.user.tabela.selected;
        });
    };

    $scope.search = function (tipo) {
        var param = {
            limit: $scope.user.length,
            tipo: tipo,
            search: $scope.busca[tipo]
        };
        $http.post(base_url + 'user/search', param).then(function (response) {
            switch (response.data.response) {
                case 0: // Internal Error
                    show("Falha de conexão, verifique sua internet", 4);
                    break;
                case 1: // Successful
                    $scope.user.tabela = response.data.users;
                    break;
                case 2: // Error
                    show(response.data.error, 3);
                    break;
                default:
                    show("Fatal Error", 4)
            }
        }, function (response) {
            console.log(response);
        });
    };

    $scope.readUsers = function () {
        $scope.readStatus();
        var param = {
            offset: $scope.user.offset,
            limit: $scope.user.length,
            tipo: $scope.user.tipo
        };

        $http.post(base_url + 'user/readUsers', param).then(function (response) {
            switch (response.data.response) {
                case 0: // Internal Error
                    show("Falha de conexão, verifique sua internet", 4);
                    break;
                case 1: // Successful
                    $scope.user.tabela = response.data.users;
                    break;
                case 2: // Error
                    if ($scope.user.offset > 1) {
                        $scope.filterUser(-2);
                    } else {
                        show(response.data.message, 3);
                        $scope.user.tabela = [];
                        $scope.user.info.users = "Não há users cadastradas";
                    }
                    break;
                default:
                    show("Fatal Error", 4)
            }
        }, function (response) {
            console.log(response);
        });
    };

    $scope.deletar = function ($el) {
        $scope.deletarList = [];
        angular.forEach($scope.user.tabela, function (item) {
            if (item.selected) $scope.deletarList.pushIfNotExist(item.IDPessoa);
        });
        if ($scope.deletarList.length === 0) $scope.deletarList.pushIfNotExist($scope.user.tabela[$el].IDPessoa);
    };

    $scope.deleteUser = function () {
        var params = {
            'val': $scope.deletarList
        };

        $http.post(base_url + 'user/delete', params).then(function (response) {
            if (response.data != null) {
                $scope.readUsers();
                show(response.data.message, 2);
                $('#deletar').modal('close');
                $scope.deletarList = [];
            } else {
                show("Ocorreu um erro interno, tente novamente", MESSAGE.ERROR);
            }
        }, function (response) {
            show(response.statusText);
        });
    };
});

app.controller("cadastro-controller", function ($scope, $http) {
    $scope.pessoa = {};
    $scope.juridica = {};
    $scope.endereco = {};
    $scope.contato = {};
    $scope.login = {
        status: false,
        funcao: 1,
        cargo: 1
    };
    $scope.select = {
        estado: {},
        pais: {}
    };
    $scope.cargos = [];
    $scope.tipo = false;

    var MESSAGE = {
        INFO: 1,
        SUCCESS: 2,
        WARNING: 3,
        ERROR: 4
    };

    function show(msg, type, time) {
        if (type == null) {
            type = -1;
        }
        if (time != null) {
            Materialize.toast(msg, time, convertType(type));
        } else {
            Materialize.toast(msg, 3000, convertType(type));
        }
    }

    function convertType(t) {
        var r = 'rounded ';
        switch (t) {
            case MESSAGE.INFO:
                r += 'blue';
                break;
            case MESSAGE.SUCCESS:
                r += 'green';
                break;
            case MESSAGE.WARNING:
                r += 'orange';
                break;
            case MESSAGE.ERROR:
                r += 'red';
                break;
            default:

        }
        return r;
    }

    function isEmpty(variable) {
        return (variable === null || typeof(variable) === "undefined" || variable.length === 0);
    }

    function setUserInfo(data) {
        if ($scope.tipo) $scope.juridica = data;
        else $scope.pessoa = data;
        $scope.contato.IDPessoa = $scope.endereco.IDPessoa = $scope.login.IDPessoa = ($scope.tipo ? $scope.juridica.IDPessoaJuridica : $scope.pessoa.IDPessoaFisica);
    }

    function setContatoInfo(data) {
        if (data.email) $scope.contato.email = data.email;
        if (data.tel1) $scope.contato.tel1 = data.tel1;
        if (data.tel2) $scope.contato.tel2 = data.tel2;
    }

    function setEnderecoInfo(data) {
        if (!isEmpty(data)) {
            var id = $scope.endereco.IDPessoa;
            $scope.endereco = data[0];
            $scope.endereco.IDPessoa = id;
        }
    }

    function setLoginInfo(data) {
        if (!isEmpty(data)) {
            $scope.login = data;
        }
    }

    function validateCodigoAcesso(codigo) {
        return (codigo.length === 0 || codigo.match(/\d{6}/));
    }

    function validateRg(rg) {
        return (rg.length === 0 || rg.match(/\d{10}/));
    }

    function validateCnpj(cnpj) {
        return cnpj.match(/\d{14}/);
    }

    function readSelectEstadoPais() {
        $http.post(base_url + 'ComboVal/combo', {type: ['estado', 'pais']}).then(function (response) {
            switch (response.data.response) {
                case 0: // Internal Error
                    show("Falha de conexão, verifique sua internet", 4);
                    break;
                case 1: // Successful
                    $scope.select.pais = response.data.pais;
                    $scope.select.estado = response.data.estado;
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
    }

    readSelectEstadoPais();

    $scope.loadUser = function (id) {
        if (typeof (id) !== "undefined" && id > 0) {
            $http.post(base_url + 'user/readUser', {id: id}).then(function (response) {
                switch (response.data.response) {
                    case 0: // Internal Error
                        show("Falha de conexão, verifique sua internet", 4);
                        break;
                    case 1: // Successful
                        $scope.tipo = response.data.tipo;
                        setUserInfo(response.data.pessoa);
                        setContatoInfo(response.data.contato);
                        setEnderecoInfo(response.data.endereco);
                        setLoginInfo(response.data.login);
                        break;
                    case 2: // Error
                        show(response.data.error, 3);
                        break;
                    default:
                        show("Fatal Error", 4)
                }
            });
        }
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
    };

    $scope.saveUser = function () {
        var pessoa = $scope.tipo ? $scope.juridica : $scope.pessoa;

        if ($scope.tipo) {
            var codigo = $("#codigoAcessoj").val();
            var cnpj = $("#cnpj").val();
            var ie = $("#ie").val();
            if (!validateCodigoAcesso(codigo) || !validateCnpj(cnpj) || !validateCnpj(ie)) {
                if (!validateCodigoAcesso(codigo)) {
                    show("corrija o Código", 3, 1000);
                }
                if (!validateCnpj(cnpj)) {
                    show("corrija o CNPJ", 3, 1000);
                }
                if (!validateCnpj(ie)) {
                    show("corrija os IE", 3, 1000);
                }
            } else if (typeof($scope.juridica.razaoSocial) === "undefined" || $scope.juridica.razaoSocial.length < 1) {
                show("Razão Social Ausênte", 3, 1000);
            } else {
                $scope.sendSave(pessoa);
            }
        } else {
            var codigo = $("#codigoAcessof").val();
            var rg = $("#rg").val();
            if (!validateCodigoAcesso(codigo) || !validateRg(rg)) {
                if (!validateCodigoAcesso(codigo))
                    show("corrija o Código", 3, 1000);
                else
                    show("corrija o RG", 3, 1000);
            } else if (typeof($scope.pessoa.nome) === "undefined" || $scope.pessoa.nome.length < 1) {
                show("Nome Ausênte", 3, 1000);
            } else {
                $scope.sendSave(pessoa);
            }
        }
    };

    $scope.sendSave = function (pessoa) {
        $http.post(base_url + 'user/saveRegister', {tipo: $scope.tipo, pessoa: pessoa}).then(function (response) {
            switch (response.data.response) {
                case 0: // Internal Error
                    show("Falha de conexão, verifique sua internet", 4);
                    break;
                case 1: // Successful
                    if (response.data.pessoa) {
                        var creating = (($scope.tipo && isEmpty($scope.juridica.IDPessoaJuridica)) || (!$scope.tipo && isEmpty($scope.pessoa.IDPessoaFisica)));
                        setUserInfo(response.data.pessoa);
                        if (creating) {
                            $scope.saveContato(true);
                            $scope.saveEndereco(true);
                            $scope.saveLogin(true);
                            show("Salvando...", 1);
                            setTimeout(function () {
                                window.location = base_url + "user/register/" + $scope.contato.IDPessoa;
                            }, 500);
                        } else {
                            show("Salvo", 1, 1000);
                        }
                    }
                    break;
                case
                2
                : // Error
                    show(response.data.error, 3);
                    break;
                default:
                    show("Fatal Error", 4)
            }
        });
    };

    $scope.saveEndereco = function (showResponse) {
        if (typeof (showResponse) === "undefined") showResponse = false;
        $http.post(base_url + 'user/saveEndereco', {endereco: $scope.endereco}).then(function (response) {
            if (!showResponse) {
                switch (response.data.response) {
                    case 0: // Internal Error
                        show("Falha de conexão, verifique sua internet", 4);
                        break;
                    case 1: // Successful
                        show("Salvo", 1, 1500);
                        break;
                    case 2: // Error
                        show(response.data.error, 3);
                        break;
                    default:
                        show("Fatal Error", 4)
                }
            }
        });
    };

    $scope.saveContato = function (showResponse) {
        if (typeof (showResponse) === "undefined") showResponse = false;
        $http.post(base_url + 'user/saveContato', {contato: $scope.contato}).then(function (response) {
            if (!showResponse) {
                switch (response.data.response) {
                    case 0: // Internal Error
                        show("Falha de conexão, verifique sua internet", 4);
                        break;
                    case 1: // Successful
                        show("Salvo", 1, 1500);
                        break;
                    case 2: // Error
                        show(response.data.error, 3);
                        break;
                    default:
                        show("Fatal Error", 4)
                }
            }
        });
    };

    $scope.saveLogin = function (showResponse) {
        if (typeof (showResponse) === "undefined") showResponse = false;
        $http.post(base_url + 'user/saveLogin', {login: $scope.login}).then(function (response) {
            if (!showResponse) {
                switch (response.data.response) {
                    case 0: // Internal Error
                        show("Falha de conexão, verifique sua internet", 4);
                        break;
                    case 1: // Successful
                        show("Salvo", 1, 1500);
                        break;
                    case 2: // Error
                        show(response.data.error, 3);
                        break;
                    default:
                        show("Fatal Error", 4)
                }
            }
        });
    };

    $scope.setCargos = function () {
        $http.post(base_url + 'user/readCargos', {}).then(function (response) {
            switch (response.data.response) {
                case 0: // Internal Error
                    show("Falha de conexão, verifique sua internet", 4);
                    break;
                case 1: // Successful
                    $scope.cargos = response.data.cargos;
                    break;
                case 2: // Error
                    show(response.data.error, 3);
                    break;
                default:
                    show("Fatal Error", 4)
            }
        });
    }
});

$(function () {
    $('.datepicker').pickadate({
        monthsFull: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
        monthsShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        weekdaysFull: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
        weekdaysShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
        min: new Date(1900, 1, 1),
        max: new Date(),
        today: false,
        clear: 'Limpar',
        close: 'Fechar',
        labelMonthNext: 'Proximo mes',
        labelMonthPrev: 'Mes anterior',
        labelMonthSelect: 'Selecione um mes',
        labelYearSelect: 'Selecione um ano',
        selectMonths: true,
        selectYears: 110,
        format: 'yyyy-mm-dd',
        closeOnSelect: true
    });
});