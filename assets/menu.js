defineEventDefault(document.getElementsByTagName('form'), true);

app.controller("menuController", function($scope){
    $scope.admin = {
        login: {
            btnLogin: {
                classe: "",
                value: "ENTRAR",
            },
            info: {
                invalidData: false,
                submitted: false
            },
            data: {}
        }
    }
})

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
