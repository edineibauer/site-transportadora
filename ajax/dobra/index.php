<?php
$data['data'][] = [
    "template" => TPL_SECTION_LARGE,
    "content" => [
        [
            "template" => TPL_COL_1,
            "content" => SITENAME,
            "class" => "font-xxlarge align-center font-light padding-bottom margin-bottom"
        ],
        ["template" => TPL_COL_1,
            "content" => "A <b>" . SITENAME . "</b> foi fundada para atuar no serviço de transporte com alta qualidade aos
                    clientes. A empresa possui uma equipe de criadores que auxiliam na otimização do serviço e máxima
                    interação com os nossos colaboradores. As nossas coletas são feitas contando com frota de veículos
                    próprios identificados, além de funcionários uniformizados para oferecer maior credibilidade e
                    confiança. Estamos estruturados operacionalmente para oferecer um serviço personalizado para cada
                    cliente, para maior satisfação com nosso atendimento.",
            "class" => "font-light margin-bottom"
        ],
        ["template" => TPL_UL,
            "content" =>
                [
                    "<b>Visão:</b> Ser referência em transporte com confiança e excelência em todo Brasil.",
                    "<b>Missão:</b> Atuar com excelência no mercado de transporte de cargas e encomendas urgentes nos modais aéreo e rodoviário para todo território nacional com serviço de porta-a-porta.",
                    "<b>Valores/Princípios:</b> Qualidade, Interação, Respeito, Compromisso, Transparência.",
                    "<b>Objetivo:</b> Conquistar confiança de nossos clientes com um trabalho de alto padrão de qualidade e preços justos."
                ]
        ]
    ]
];

$data['data'][] = [
    "template" => TPL_SECTION_LARGE,
    "class" => "color-grey-light align-justify",
    "content" => [
        "template" => TPL_COL_3,
        "content" => [
            [
                "template" => TPL_POST_CARD,
                "title" => "Área de Atuação",
                "href" => HOME . "areaAtuacao",
                "src" => HOMEDEV . "assets/img/ilustracao-atuacao.jpg",
                "content" => "A Fênix Cargo está em constante crescimento para atender seus clientes com a máxima qualidade e excelência. Confira as localidades e seus prazos de entrega atendidos pela nossa empresa."
            ],
            [
                "template" => TPL_POST_CARD,
                "title" => "Depoimentos",
                "href" => HOME . "depoimentos",
                "src" => HOMEDEV . "assets/img/ilustracao-depoimento2.jpg",
                "content" => "Somos uma empresa com grande responsabilidade na satisfação de nossos clientes. Envie o seu depoimento sobre nossos serviços."
            ],
            [
                "template" => TPL_POST_CARD,
                "title" => "Trabalhe Conosco",
                "href" => HOME . "trabalheConosco",
                "src" => HOMEDEV . "assets/img/ilustracao-tconosco2.jpg",
                "content" => "Venha fazer parte de nossa equipe e conquiste sua oportunidade para mostrar os seus talentos em nossa organização."
            ]
        ]
    ]
];

$data['data'][] = [
    "template" => TPL_SECTION_LARGE,
    "content" => [
        "template" => TPL_COL_3,
        "class" => "padding-32",
        "content" => [
            [
                "template" => TPL_POST_FLAT,
                "title" => "Entrega Diplomata",
                "icon" => "work",
                "iconClass" => "color-text-teal",
                "content" => "Colocamos à sua disposição um funcionário de nossa empresa, que transportará a sua
                    encomenda para qualquer lugar do pais para ser efetuado o embarque no primeiro vôo para a cidade de
                    destino com a máxima urgência e segurança, acompanhada de nosso representante."
            ],
            [
                "template" => TPL_POST_FLAT,
                "title" => "Central de Atendimento",
                "icon" => "group",
                "iconClass" => "color-text-teal",
                "content" => "Nossa central de atendimento dispõe de equipe qualificada e preparada para manter o
                    cliente informado sobre qualquer situação referente aos nossos serviços.
                    <br>Para qualquer solicitação ou consultar informações basta ligar gratuitamente para <b>0800 031
                        0302</b> e entrar em contato com nossa equipe."
            ],
            [
                "template" => TPL_POST_FLAT,
                "title" => "Solicitações Online",
                "icon" => "language",
                "iconClass" => "color-text-teal",
                "content" => "Para facilidade e agilidade no atendimento, nossos clientes podem efetuar solicitações
                    de coleta ou efetuar cotações de valores diretamente por nosso website pela opção Fale Conosco.
                    Obtendo uma resposta poucos minutos após o envio da solicitação."
            ]
        ]
    ]
];

$data['data'][] = [
    "template" => TPL_PARALLAX,
    "background" => HOMEDEV . "assets/img/background3.jpg",
    "height" => 320,
    "content" => [
        "template" => 'col_1',
        "class" => "padding-128 align-center font-xxxlarge color-text-white text-shadow",
        "content" => "Obrigado por escolher a Fênix Cargo"
    ]
];

$data['data'][] = [
    "template" => TPL_SECTION_LARGE,
    "class" => "footer color-black",
    "content" =>
        [
            "template" => TPL_COL_1,
            "class" => "padding-8 align-center",
            "content" => SITENAME . " - Copyright © All Rights Reserved - " . date("Y")
        ]
];