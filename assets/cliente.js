app.controller("contaController", function ($scope, $http) {
    $scope.pessoa = {};
    $scope.juridica = {};
    $scope.endereco = {};
    $scope.contato = {};
    $scope.select = {
        estado: {},
        pais: {}
    };
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

        $scope.contato.IDPessoa = $scope.endereco.IDPessoa = ($scope.tipo ? data.IDPessoaJuridica : data.IDPessoaFisica);
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

    post(base_url + 'cliente/readUser', {}, function (data) {
        console.log(data);
        $scope.tipo = data.tipo;
        setUserInfo(data.pessoa);
        setContatoInfo(data.contato);
        setEnderecoInfo(data.endereco);
        $scope.$apply();
    });

    $scope.saveUser = function () {
        if ($scope.tipo) {
            if (!validateCnpj($("#cnpj").val()) || !validateCnpj($("#ie").val())) {
                if (!validateCnpj($("#cnpj").val()))
                    show("corrija o CNPJ", 3, 1000);
                else
                    show("corrija os IE", 3, 1000);

            } else if (typeof($scope.juridica.razaoSocial) === "undefined" || $scope.juridica.razaoSocial.length < 1) {
                show("Razão Social Ausênte", 3, 1000);

            } else {
                $scope.sendSave($scope.juridica);
            }

        } else {
            if (!validateRg($("#rg").val()))
                show("corrija o RG", 3, 1000);
            else if (typeof($scope.pessoa.nome) === "undefined" || $scope.pessoa.nome.length < 1)
                show("Nome Ausênte", 3, 1000);
            else
                $scope.sendSave($scope.pessoa);
        }
    };

    $scope.sendSave = function (pessoa) {
        post(base_url + 'cliente/saveRegister', {pessoa: pessoa}, function (data) {
            show("Salvo", 1, 1000);
            $scope.$apply();
        });
    };

    $scope.saveEndereco = function (showResponse) {
        post(base_url + 'cliente/saveEndereco', {endereco: $scope.endereco}, function () {
            if (typeof (showResponse) === "undefined")
                show("Salvo", 1, 1500);
        });
    };

    $scope.saveContato = function (showResponse) {
        post(base_url + 'cliente/saveContato', {contato: $scope.contato}, function () {
            if (typeof (showResponse) === "undefined")
                show("Salvo", 1, 1500);
        });
    };

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
});

app.controller("rastreioController", function ($scope, $http) {
    $scope.rastreioCod = "";
    $scope.minutaRastreio = {};

    post(base_url + "cliente/meusRastreios", {}, function (data) {
        console.log(data);
        $scope.rastreios = data;
        $scope.$apply();
    });

    function rastrearMinuta(minuta) {
        $http.post(base_url + "rastreio/search", {minuta: minuta}).then(function (response) {
            switch (response.data.response) {
                case 0: // Internal Error
                    show("Falha de conexão, verifique sua internet", 4);
                    break;
                case 1: // Successful
                    $scope.minutaRastreio = response.data.minutaRastreio;
                    $scope.rastreioCodTrat = $scope.rastreioCod.replace(/fnx/ig, "");
                    $('#modal1').modal('open');
                    break;
                case 2: // Error
                    show(response.data.message, 3);
                    break;
                default:
                    show("Fatal Error", 4);
            }
        });
    }

    $scope.rastrear = function () {
        $scope.minutaRastreio = {};
        if ($scope.rastreioCod.length > 4) {
            rastrearMinuta($scope.rastreioCod);
        } else {
            show("informe o número de uma minuta", 2);
        }
    }
});