
/* seta plugins */
function plugin() {
    $(".plugin").each(function () {
        var $this = $(this);
        $this.attr("data-plugin").trim().split(' ').forEach(function (plug) {
            $this[plug.trim()]();
        });
    });
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

function tplObject(obj, $elem, prefix) {
    prefix = typeof (prefix) === "undefined" ? "" : prefix;
    if (typeof (obj) === "object") {
        $.each(obj, function (key, value) {
            if (obj instanceof Array) $elem = tplObject(value, $elem, prefix + key);
            else $elem = typeof (value) === "object" ? tplObject(value, $elem, prefix + key + ".") : $elem.replace(regexTpl(prefix + key), value);
        });
    } else {
        $elem = $elem.replace(regexTpl(prefix), obj);
    }

    return $elem;
}

/* Clona elementos */
function cloneTo(element, destino, variable, position) {
    var $elem = $(element).clone().removeClass("hide").removeAttr("id").prop('outerHTML');
    $elem = tplObject(variable, $elem);
    if (typeof (position) === "undefined") $($elem).prependTo(destino);
    else if (position === "after") $($elem).after(destino);
    else if (position === "before") $($elem).before(destino);
    else $($elem).appendTo(destino);
}

function regexTpl(v) {
    return new RegExp('{{\\s*\\$' + v + '\\s*}}', 'g');
}

/* Cria slug names */
function slug(val, replaceBy) {
  replaceBy = replaceBy || '-';
  var mapaAcentosHex 	= { // by @marioluan and @lelotnk
  	a : /[\xE0-\xE6]/g,
  	A : /[\xC0-\xC6]/g,
  	e : /[\xE8-\xEB]/g, // if you're gonna echo this
  	E : /[\xC8-\xCB]/g, // JS code through PHP, do
  	i : /[\xEC-\xEF]/g, // not forget to escape these
  	I : /[\xCC-\xCF]/g, // backslashes (\), by repeating
  	o : /[\xF2-\xF6]/g, // them (\\)
  	O : /[\xD2-\xD6]/g,
  	u : /[\xF9-\xFC]/g,
  	U : /[\xD9-\xDC]/g,
  	c : /\xE7/g,
  	C : /\xC7/g,
  	n : /\xF1/g,
  	N : /\xD1/g,
  };

  for ( var letra in mapaAcentosHex ) {
  	var expressaoRegular = mapaAcentosHex[letra];
  	val = val.replace( expressaoRegular, letra );
  }

  val = val.toLowerCase();
  val = val.replace(/[^a-z0-9\-]/g, " ");

  val = val.replace(/ {2,}/g, " ");

  val = val.trim();
  val = val.replace(/\s/g, replaceBy);

  return val;
}

function contain(t, e) {
    var n;
    for (n = 0; n < e.length; n++) if (e[n] === t) return n;
    return -1
}

$(function (t) {
    $.fn.loading = function () {
        this.siblings(".loading").remove();
        this.after('<ul class="loading"><li class="fl-left one"></li><li class="fl-left two"></li><li class="fl-left three"></li></ul>');
    };
    $.fn.model = function () {

        var dados = {
            entity: this.attr("data-table") || "null",
            callback: this.attr("action") || "null"
        };

        var model = {
            setDados: function($this) {
                if (typeof($this.attr("data-model")) !== "undefined") {
                    dados[$this.attr("data-model")] = $this.val();
                }
            },
            update: function ($this) {
                $this.find("input").each(function () {
                    model.setDados($(this));
                });

                $this.find("textarea").each(function () {
                    model.setDados($(this));
                });

                $this.find("select").each(function () {
                    model.setDados($(this));
                });
            }
        };

        model.update(this);

        this.on("keyup", "input", function () {
            model.setDados($(this));
        });

        this.on("click", "button[type=submit], input[type=submit]", function () {

        });

        return this;
    };
}(jQuery));

$(function () {
    $("form").submit(function (e) {
        e.preventDefault();
    });
    plugin();
});