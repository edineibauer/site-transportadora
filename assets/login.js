defineEventDefault(document.getElementsByTagName('form'));

app.controller("loginController", function($scope, $http){
    $scope.login = {
        btnLogin: {
            classe: "",
            value: "ENTRAR"
        },
        info: {
            invalidData: false,
            submitted: false
        },
        data: {
            remember: checked
        }
    };

    $scope.loggin = function($ev){
        var url = $ev.target.action;
        var params = {
            "login": $scope.login.data
        };

        if ($scope.frmLogin.$valid){
            $scope.login.btnLogin.value = "CARREGANDO ...";
            $scope.login.info.submitted = true;
            $http.post(url, params).then(function(response){
                switch (response.data.response) {
                    case 0: // Internal Error
                        show("Falha de conexão, verifique sua internet", 4);
                        break;
                    case 1: // Successful
                        show(response.data.message, 2);
                        setTimeout(function(){ window.location.href = response.data.url; }, 1500);
                    break;
                    case 2: // Error
                        show(response.data.message, 3);
                    break;
                    default:
                        show("Fatal Error", 4);
                }
                $scope.login.btnLogin.value = " ENTRAR ";
                $scope.login.info.submitted = false;
            }, function(response){
                $scope.login.btnLogin.value = "Tente Novamente";
                $scope.login.info.submitted = false;
            });
        }else{
            $scope.login.invalidData = true;
            show("Preencha os campos corretamente");
        }
    }
});

app.controller("loginRecoveryController", function($scope){
    $scope.password = "";
    $scope.passworde = "";
    $scope.token = "";

    $scope.enviar = function ($ev) {
        if ($scope.recoveryPassForm.$valid) {
            if($scope.password === $scope.passworde) {
                post($ev.target.action, {password: $scope.password, token: $scope.token}, function () {
                    show("Nova Senha Aplicada. Redirecionando", 2);
                    $scope.password = "";
                    $scope.passworde = "";
                    $scope.token = "";
                    $scope.$apply();
                    setTimeout(function () {
                        window.location.href = base_url + "login";
                    }, 1500);
                });
            } else {
                show("Senhas não são idênticas", 3);
            }
        } else {
            show("Preencha os campos corretamente");
        }
    }
});

function show(msg, el){
    Materialize.toast(msg, 3000, 'rounded');
}
// els array forms
function defineEventDefault(els){
    for(var i = 0, len = els.length; i < len; i++) {
        els[i].onsubmit = function (ev) {
            ev.preventDefault();
        }
    }
}
