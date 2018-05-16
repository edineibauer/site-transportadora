$(function(){
    $(".main").css("opacity", 1);
    $(".noAutoComplete input[type=text]").each(function(){
        $(this).attr("autocomplete", "off")
    })
    $(document).foundation();
    required = false;
    applyMask();
    $(document).on('submit', 'form', function(e) {
        e.preventDefault();
    });
});
//NAVBAR
/* Set the width of the side navigation to 250px */
function openNav() {
    document.getElementById("mobileSidenav").style.width = "17em";
}

/* Set the width of the side navigation to 0 */
function closeNav() {
    document.getElementById("mobileSidenav").style.width = "0";
}
function applyMask() {
    $('.site').attr("placeholder", "https://www.site.com.br, https://www.site.com.br");
    $(document).on("focus", ".site", function () {
        $(this).change(function () {
            var str = $(this).val();
            var emails = str.split(',');
            var invalidEmails = "";
            var validEmails = "";
            for (i = 0; i < emails.length; i++) {
                if (!validate(1, emails[i].trim())) {
                    invalidEmails += emails[i].trim() + "<br/>";
                } else {
                    validEmails += emails[i].trim() + ",";
                }
            }
            $(this).val(validEmails.substr(0, validEmails.length - 1));
            if (invalidEmails.length > 0) {
                console.log("Falha no site:<br/>" + invalidEmails);
            }
        });
    });
    $('.mail').attr("placeholder", "seu.email@dominio.com");
    $(document).on("focus", ".mail", function () {
        $(this).change(function () {
            var str = $(this).val();
            var emails = str.split(',');
            var invalidEmails = "";
            var validEmails = "";
            for (i = 0; i < emails.length; i++) {
                if (!validate(0, emails[i].trim())) {
                    invalidEmails += emails[i].trim() + "<br/>";
                } else {
                    validEmails += emails[i].trim() + ",";
                }
            }
            $(this).val(validEmails.substr(0, validEmails.length - 1));
            if (invalidEmails.length > 0) {
                console.log("Falha no email:<br/>" + invalidEmails);
            }
        });
    });

    var optionCNPJCPF = {
        onKeyPress: function (value, e, field, options) {
            var masks = ['###.###.###-##', '00.000.000/0000-00'];
            if (value.length > 14) {
                mask = masks[1];
            } else {
                mask = masks[0];
            }
            $('.cnpjCpf').mask(mask, options);
        },
        placeholder: "___.___.___-__",
        reserve: true,
        clearIfNotMatch: true
    };
    $('.cnpjCpf').mask('###.###.###-##', optionCNPJCPF);
    $('.cpf').mask('000.000.000-00', {
        placeholder: "___.___.___-__",
        clearIfNotMatch: true
    });
    $('.rg').mask('00.000.000-0', {
        placeholder: "__.___.___-_",
        clearIfNotMatch: true
    });
    $('.cep').mask('00000-000', {
        placeholder: "_____-___",
        clearIfNotMatch: true
    });
    $('.codEmpresa').mask('000000', {
        placeholder: "______",
        clearIfNotMatch: true
    });
    $('.uf').mask('SS', {
        'translation': {
            S: {pattern: /[A-Za-z]/},
        },
        clearIfNotMatch: true,
        placeholder: "__",
    });
    var optionIERG = {
        onKeyPress: function (value, e, field, options) {
            var masks = ['##.###.###-#', '000.000.000.000'];
            if (value.length > 12) {
                mask = masks[1];
            } else {
                mask = masks[0];
            }
            $('.ieRg').mask(mask, options);
        },
        placeholder: "__.___.___-_",
        reserve: true,
        clearIfNotMatch: true
    };
    $('.ieRg').mask('##.###.###-#', optionIERG);
    $('.tel').mask('(00) 0000-0000', {
        placeholder: "(__) ____-____"
    });
    var SPMaskBehavior = function (val) {
        return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
    },
    spOptions = {
        onKeyPress: function (val, e, field, options) {
            field.mask(SPMaskBehavior.apply({}, arguments), options);
        },
        placeholder: "(__) 9____-____",
        clearIfNotMatch: true
    };
    $('.cel').mask(SPMaskBehavior, spOptions);
    $('.date').mask('00/00/0000', {
        placeholder: "__/__/____",
        clearIfNotMatch: true
    });
    $('.currency:not([readonly]').mask('#.##0,00', {
        reverse: true,
        placeholder: '_.___.___.___,__',
        clearIfNotMatch: true
    });
    $('.number:not([readonly]').mask('0#');
    // /^[0-9.,]+$/
    //$('.boleto').mask('00000.00000 00000.000000 00000.000000 0 00000000000000', {
    $('.boleto').mask('00000 00000 00000 000000 00000 000000 0 00000000000000', {
        clearIfNotMatch: true,
        placeholder: '_____._____._____.______._____.______._.______________'
    });

    var desconto = {
        onKeyPress: function (value, e, field, options) {
            var masks = ['##,##', '000,00'];
            if (value.length > 5) {
                mask = masks[1];
            } else {
                mask = masks[0];
            }
            $('.desconto').mask(mask, options);
        },
        placeholder: "00,0",
        clearIfNotMatch: true
    };
    $('.desconto').mask('##,##', desconto);

    $(document).on("keyup", ".desconto", function(){
        if ($(this).val().replace(",", ".") > 99.99){
            $(this).val('');
        }
    });
    $(document).on("focus", ".date", function () {
        $(".date:not([readonly])").datepicker({
            dateFormat: 'dd/mm/yy',
            dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
            dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S', 'D'],
            dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
            monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
            monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
            showAnim: 'show',
            // minDate: new Date()
        });
    });
}
function isEmpty(value){
    return (value == null || value.length === 0);
}
var autoCompleteKeys = ['uf', 'estado', 'cep', 'cidade', 'logradouro', 'bairro', 'razaoSocial', 'cliente', 'company'];

// $(document).on("blur", '.complete', function(e) {
//     //console.log($(this).attr('id'));
// });
// $(document).on("input", '.complete', function(e) {
//     if ($(this).val().length == 0){
//         $(".complete-parent-"+$(this).attr("id").substring(3).toLowerCase()).prop('disabled', false).val('');
//     }
// });
$(document).on("input", '.complete', function(e) {
    if ($(this).next().is(":hidden")){
        $(this).next().val("");
    }
    var dataComplete = $(this).attr("data-complete-field");
    if (!isEmpty(dataComplete)){
        dataComplete = dataComplete.split(",");
        $.each(dataComplete, function (obj, val) {
            if ($("#"+val.trim()).is(':checkbox')){

            }else if ($("#"+val.trim()).is('select')){
                $("#"+val.trim()).val($("#"+val.trim()).find('option[selected]').val());
            }else{
                $("#"+val.trim()).val("");
            }
        });
    }
});

function fillFields(json, isDisabled = false){
    $.each(json, function (obj, val) {
        if (val != null && typeof val === "object"){
            fillFields(val);
        }
        if ($("#"+obj).length == 1){
            if ($("#"+obj).is(':checkbox')){
                $("#"+obj).prop("checked", true);
                $("#"+obj).closest('li').addClass('active');
            }else if($("#"+obj).is('select')){
                $("#"+obj).val($("#"+obj+" option:contains("+val+")").val()).trigger('change');
            }else{
                $("#"+obj).val(val).trigger('change');
            }
        }else{
            if (val != null && typeof val !== "object"){
                if ($("#"+obj+val).length == 1){
                    if($("#"+obj+val).is(':checkbox')){
                        $("#"+obj+val).prop("checked", true);
                        $("#"+obj+val).closest('li').addClass('active');
                    }else{
                        $("#"+obj+val).val(val).trigger('change');
                    }
                }
            }
        }
    });
}

$(document).on("focus", '.complete', function(e) {
    var key = $(this).attr('class').split(' ')[0];

    if (!isEmpty(key) && $.inArray(key, autoCompleteKeys) != -1){

        var t = $(this);
        var url = base_url.concat("autocomplete", "/", key);

        if (!$(t).data("autocomplete") ) { // If the autocomplete wasn't called yet:
        $(t).autocomplete({
            source: function(request, response){
                requestAjax(url, {event: 'autocomplete', search: $(t).val()}, 'json', function (data) {
                    if (isEmpty(data.code)){
                        response(data);
                    }
                });
            },
            response: function (e, i){
                if (i.content.length == 0){
                    //var id = $(t).attr("id");

                    // var id = $(t).attr("id");
                    // if (!isEmpty(id)){
                    //     $(id).next().val("");
                    // }
                    // var dataComplete = $(t).attr("data-complete-field");
                    // if (!isEmpty(dataComplete)){
                    //     $(dataComplete).each(function(){
                    //         $(this).val("");
                    //     });
                    // }
                }
            },
            focus: function(e, i){
                $(t).val(i.item.value);
            },
            select: function(e, i){
                var field = $(t).attr("data-complete-param");
                var data = {event: 'fill', search: $(t).val(), type: $(t).attr("id").slice(-1), param: !isEmpty(field)};
                requestAjax(url, data, 'json', function (data) {
                    if (!isEmpty(field)){
                        $("#"+field).val(data.data);
                    }
                    fillFields(data, true);
                });
            }
        });
    }
}
});

/* ajax */
function requestAjax(url, data, type, callback) {
    try {
        $.ajax({
            url: url,
            data: data,
            type: "POST",
            dataType: type,
            beforeSend: function(){
                $('body').addClass('wait');
            },
            complete: function(){
                $('body').removeClass('wait');
            },
            success: function (data, textStatus, jqXHR) {
                callback(data);
            },
            error: function (data, textStatus, errorThrown) {
                status = textStatus;
                codeResponse = data.status;
                statusResponse = data.statusText;
                response = data.responseText;
                console.log(status, codeResponse, statusResponse, response);
                show("Não foi possível atender a solicitação", 4);
                $("content").append("<div class='errorDialog hide'>" + response + "</div>");
                $(".errorDialog").fadeIn();
                $('body').removeClass('wait');
                callback({"code" : "-1", "message" : "Falha na solicitação"});
            }
        });
    } catch (e) {
        return false;
    } finally {
        $('body').removeClass('wait');
        return false;
    }
}
/* Messages */
var message = [];
var showStared = false;
function showMessage(t){
    showStared = true;
    var img = base_url;
    var c = "msg noselect h ";
    switch (t) {
        case 1: // Info
        img += "public/images/info-icon.png";
        c += "message-info";
        break;
        case 2: // Success
        img += "public/images/success-icon.png";
        c += "message-success";
        break;
        case 3: // Warning
        img += "public/images/warning-icon.png";
        c += "message-warning";
        break;
        case 4: // Error
        img += "public/images/error-icon.png";
        c += "message-error";
        $("#showErros").addClass("message-error");
        break;
    }

    //$("content").append("<div class='" + c + "'><img src='" + img + "' /><p>" + message[0].message + "</p></div>");
    $(".main").append("<div class='" + c + "'><img src='" + img + "' /><p>" + message[0].message + "</p></div>");
    $("body").append("<div class='" + c + "'><img src='" + img + "' /><p>" + message[0].message + "</p></div>");
    $('.msg').fadeIn();
    setTimeout(function(){
        $('.msg').fadeOut('fast', function(){
            $(this).remove();
        });
        showStared = false;
        message.shift();
        if (message.length > 0){
            setTimeout(showMessage(message[0].type), 500);
        }
    }, 3500);
}

function show(msg, t = 1){
    message.push({message : msg, type : t});
    if (!showStared){
        showMessage(t);
    }
}

function load(url){
    if (url.length > 3){
        var u = url.split(',');
        u.forEach(function(item, index){
            $(item).fadeOut(100);
            requestAjax($(item).data('url'), null, 'json', function (data) {
                $(item).html(data.value).fadeIn(200);

            });
        });
    }
}
function clear(dom){
    required = false;
    $(dom).find(".txt:not(.nodisabled), input[type=checkbox]").each(function (){
        if ($(this).is(':checkbox')){
            $(this).prop('checked', false);
            $(this).closest('li').removeClass('active');
        }else if ($(this).is('select')){
            $(this).val($(this).find('option[selected]').val());
        }else{
            $(this).val("");
            var data = $(this).attr("data-last");
            if (typeof data !== typeof undefined && data !== false) {
                if (data.trim().length != 0){
                    $("#txtEmpresa").attr("data-last", "")
                }
            }
        }
        $(this).change();
    });
}
function isNull(dom, message){
    var fieldsNull = 0;
    $(dom).find(".txt.required").removeClass('message-error').each(function(){
        if (!$(this).val() || $(this).val().trim().length == 0 || $(this).val().toLowerCase() == message) {
            fieldsNull++;
            $(this).attr('placeholder', message).addClass('message-error').parent().addClass('e');
        }
    });

    return (fieldsNull > 0);
}

$(document).on("click", '.save', function(){
    var messageBox = ($(this).closest('form').find('.box-message').length == 1) ? $(this).closest('form').find('.box-message') : null;
    var form = $(this).closest('form');
    var action = form.attr('action');

    if (messageBox != null){
        messageBox.fadeOut("fast");
    }

    if (!isNull(form, 'Campo obrigatório')){
        if (typeof action !== typeof undefined && action !== false){
            if ($("#method").length == 1){
                action += ($("#method").val().trim().length == 0) ? "/save" : "/" + $("#method").val();
            }
            requestAjax(action, form.serialize(), 'json', function (data) {
                if (data.code == 1){
                    clear(form);
                    if (data.isRequiredLoaded){
                        load(data.load);
                        $(".btnClient").val("Adicionar Cliente");
                        $(".btnUser").val("Adicionar Usuário");
                    }
                    if (messageBox != null){
                        messageBox.html(data.message);
                    }else{
                        show(data.message, 2);
                    }
                }else{
                    if (messageBox != null){
                        messageBox.html(data.message);
                    }else{
                        show(data.message, 3);
                    }
                }
            });
        }else{
            if (messageBox != null){
                messageBox.html("Erro interno");
            }
        }
    }else{
        if (messageBox != null){
            messageBox.html("Campos em branco");
        }else{
            show("Campos em branco", 3);
        }
        required = true;
        $('.message-error:first').focus();
    }
    if (messageBox != null){
        messageBox.fadeIn("fast");
    }
});

function validate(v, obj) {
    var regex = "";
    switch (v) {
        case 0: // isEmail
        //regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        break;
        case 1: // isSite
        regex = /^(http(s?):\/\/)?(www\.)+[a-zA-Z0-9\.\-\_]+(\.[a-zA-Z]{2,3})+(\/[a-zA-Z0-9\_\-\s\.\/\?\%\#\&\=]*)?$/;
        break;
    }

    return regex.test(obj);
}
