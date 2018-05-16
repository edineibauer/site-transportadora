defineEventDefault(document.getElementsByTagName('form'), true);
$(document).ready(function () {
    $(document).on('click', 'a[href*="#"]', function (e) {

        // target element id
        var id = $(this).attr('href');
        id = id.substring(id.indexOf("#"));

        // target element
        var $id = $(id);
        if ($id.length === 0) {
            return;
        }

        // prevent standard hash navigation (avoid blinking in IE)
        e.preventDefault();

        // top position relative to the document
        var pos = $id.offset().top - 64;

        // animated top scrolling
        $('body, html').animate({scrollTop: pos});
    });
});

app.controller("atendimentoController", function ($scope, $http) {
    $scope.assuntos = ["Cotação de Frete", "Informação sobre nossos serviços", "Outros Assuntos"];
    $scope.email = {
        nome: "",
        email: "",
        telefone: "",
        assunto: "-1",
        mensagem: ""
    };

    $scope.sendAtendimento = function ($ev) {
        if ($scope.atendimentoForm.$valid && $scope.email.assunto != '-1') {
            $scope.email.assunto = $scope.assuntos[$scope.email.assunto];
            post($ev.target.action , {atendimento: $scope.email}, function (data) {
                $scope.email = {};
                show("Enviado", 2);
                $scope.$apply();
            });

        } else {
            show("Preencha os campos corretamente");
        }
    }
});

app.controller("depoimentoController", function ($scope) {
    $scope.depoimentoEnvia = function ($ev) {
        if ($scope.depoimentoForm.$valid) {
            post($ev.target.action , {depoimento: $scope.email}, function (data) {
                console.log(data);
                $scope.email = {};
                show("Enviado", 2);
                $scope.$apply();
            });

        } else {
            show("Preencha os campos corretamente");
        }
    }
});

app.controller("trabalheController", function ($scope, $http) {
    $scope.email = {
        nome: "",
        email: "",
        telefone: "",
        celular: "",
        endereco: "",
        cep: "",
        uf: "",
        numero: "",
        complemento: "",
        cidade: "",
        objetivo: "",
        educacao: "",
        experiencia: "",
        file: "",
        mensagem: ""
    };

    $scope.trabalheEnvia = function () {
        $http.post(base_url + "sendEmail/trabalheConosco", {email: $scope.email}).then(function (response) {
            if (response.data === "2") {
                show("Erro no formulário, revise", 2);
            }
        });
    }
});

app.controller("rastreioController", function ($scope, $http) {
    $scope.rastreioCod = "";
    $scope.minutaRastreio = {};

    $scope.rastrear = function () {
        $scope.minutaRastreio = {};
        if ($scope.rastreioCod.length > 4) {
            $http.post(base_url + "rastreio/search", {minuta: $scope.rastreioCod}).then(function (response) {
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
        } else {
            show("informe o número de uma minuta", 2);
        }
    }
});

app.controller("homeController", function ($scope, $http) {
    $scope.home = {
        login: {
            btnLogin: {
                classe: "",
                value: "ENTRAR"
            },
            info: {
                invalidData: false,
                submitted: false
            },
            data: {
                remember: true
            }
        }
    };

    $scope.loggin = function ($ev) {
        var url = $ev.target.action;

        if ($scope.frmLogin.$valid) {
            $scope.home.login.btnLogin.value = "CARREGANDO ...";
            $scope.home.login.info.submitted = true;
            $http.post(url, $scope.home.login.data).then(function (response) {
                console.log(response.data);
                switch (response.data.response) {
                    case 0: // Internal Error
                        show("Falha de conexão, verifique sua internet", 4);
                        break;
                    case 1: // Successful
                        show(response.data.message, 2);
                        setTimeout(function () {
                            window.location.href = response.data.url;
                        }, 1500);
                        break;
                    case 2: // Error
                        show(response.data.message, 3);
                        break;
                    default:
                        show("Fatal Error", 4);
                }
                $scope.home.login.btnLogin.value = " ENTRAR ";
                $scope.home.login.info.submitted = false;
            }, function (response) {
                $scope.home.login.btnLogin.value = "Tente Novamente";
                console.log(response);
            });
        } else {
            $scope.home.login.invalidData = true;
            show("Preencha os campos corretamente");
        }
    }
});

app.controller("homeOffice", function ($scope) {
    $scope.submited = false;
    function emptyRepresentante() {
        $scope.representante = {
            nome: "",
            telefone: "",
            email: ""
        };
    }
    emptyRepresentante();

    $scope.enviar = function ($ev) {
        if ($scope.homeOffice.$valid) {
            post($ev.target.action , {representante: $scope.representante}, function () {
                emptyRepresentante();
                $scope.submited = true;
                show("Enviado", 2);
                $scope.$apply();
            });

        } else {
            show("Preencha os campos corretamente");
        }
    }
});

app.controller("recoveryController", function ($scope) {
    $scope.email = "";

    $scope.enviar = function ($ev) {
        if ($scope.recoveryForm.$valid) {
            post($ev.target.action , {email: $scope.email}, function () {
                show("Email de Recuperação Enviado", 2);
                $scope.email = "";
                $scope.$apply();
            });
        } else {
            show("Preencha os campos corretamente");
        }
    }
});

function show(msg, el) {
    Materialize.toast(msg, 3000, 'rounded');
}

// els array forms
function defineEventDefault(els) {
    for (var i = 0, len = els.length; i < len; i++) {
        els[i].onsubmit = function (ev) {
            ev.preventDefault();
        }
    }
}
