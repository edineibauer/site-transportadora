var app = angular.module('bootApp', ['ui.utils.masks', 'ui.materialize']);

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

function systemPost(t, n, a, d) {
    a = a || {};
    if (typeof (d) !== "undefined") {
        $.ajax({
            type: "POST",
            url: t,
            data: a,
            success: function (t) {
                console.log(t);
            }
        });
    } else {
        $.ajax({
            type: "POST",
            url: t,
            data: a,
            success: function (t) {
                n(t)
            },
            dataType: "json"
        });
    }
}

function post(t, a, n, d) {
    systemPost(t, function (t) {
        switch (t.response) {
            case 1:
                n(t.data);
                break;
            case 2:
                show(t.error, 3);
                break;
            default:
                show("Erro Desconhecido", 4);
        }
    }, a, d);
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

Array.prototype.pushIfNotExist = function (element) {
    if ($.inArray(element, this) == -1) {
        this.push(element);
    }
};

function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

app.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    /**
     * The workhorse; converts an object to x-www-form-urlencoded serialization.
     * @param {Object} obj
     * @return {String}
     */
    var param = function (obj) {
        var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

        for (name in obj) {
            value = obj[name];

            if (value instanceof Array) {
                for (i = 0; i < value.length; ++i) {
                    subValue = value[i];
                    fullSubName = name + '[' + i + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            }
            else if (value instanceof Object) {
                for (subName in value) {
                    subValue = value[subName];
                    fullSubName = name + '[' + subName + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            }
            else if (value !== undefined && value !== null)
                query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }

        return query.length ? query.substr(0, query.length - 1) : query;
    };

    // Override $http service's default transformRequest
    $httpProvider.defaults.transformRequest = [function (data) {
        return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }];
}]);

app.controller("appController", function ($scope) {
});

function ucFisrt(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}