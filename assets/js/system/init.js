
function init() {
    $(":input[required]").each(function () {
        var txt = $(this).next().text();
        $(this).next().text(txt + " *");
    });

    $('input.autocomplete').each(function () {
        var autocomplete = $(this).data('autocomplete-data');
        var dataAutocomplete = {};
        if (angularData !== null && angularData['autocomplete'] !== null && angularData['autocomplete'][autocomplete].length > 0) {
            angularData['autocomplete'][autocomplete].forEach(function (a) {
                if (autocomplete === "requester") {
                    dataAutocomplete[a.nome] = null;
                } else if (autocomplete === 'agente') {
                    dataAutocomplete[a.razaoSocialNome] = null;
                }
            });
            $(this).autocomplete({
                data: dataAutocomplete,
                limit: 5,
                minLength: 1,
                onAutocomplete: function (val) {
                    angularData['autocomplete']['isSelected'] = true;
                    angularData['autocomplete']['value'] = val;
                },
            });
        }
    });

    $("form").submit(function (e) {
        e.preventDefault();
        return false;
    });

    $(document).on("click", ".modal-action.modal-close, .deleteTable, .noClick", function (e) {
        e.preventDefault();
    });

    $('.datepicker').pickadate({
        monthsFull: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
        monthsShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        weekdaysFull: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
        weekdaysShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
        today: 'Hoje',
        clear: 'Limpar',
        close: 'Fechar',
        labelMonthNext: 'Proximo mes',
        labelMonthPrev: 'Mes anterior',
        labelMonthSelect: 'Selecione um mes',
        labelYearSelect: 'Selecione um ano',
        selectMonths: true,
        selectYears: 110,
        format: 'dd/mm/yyyy',
        closeOnSelect: true
    });

    $('.button-collapse').sideNav();
    $('.parallax').parallax();
    $('.modal').modal({
        dismissible: false,
        opacity: .5, // Opacity of modal background
        inDuration: 300, // Transition in duration
        outDuration: 200, // Transition out duration
        startingTop: '4%', // Starting top style attribute
        endingTop: '15%', // Ending top style attribute
    });

    $(document).ready(function(){
        $('.modal').modal();
    });
}

$(function () {
    init();
});