<?php
$data['data'][] = [
    "template" => TPL_PARALLAX,
    "content" => [
        "template" => TPL_IMG,
        "src" => HOMEDEV . "assets/img/aviao.png",
        "width" => 200,
        "class" => "margin-jumbo"
    ],
    "background" => HOMEDEV . 'assets/img/Tower-Skyscrapers-l.jpg',
    "height" => 500
];

$data['data'][] = [
    "template" => TPL_SECTION_MEDIUM,
    "class" => "color-grey-light",
    "content" => [
        [
            "template" => TPL_COL_1,
            "class" => "font-light align-center font-xlarge color-text-grey-dark-medium",
            "content" => "Rastreie sua Minuta"
        ],
        [
            "template" => TPL_INPUT_ICON,
            "content" => "N° Minuta",
            "icon" => "description"
        ],
        [
            "template" => TPL_BUTTON_ICON,
            "content" => "Rastrear",
            "icon" => "my_location"
        ],
        [
            "template" => TPL_COL_1,
            "content" => "Consulte as informações da sua carga passo a passo",
            "class" => "font-light align-center padding-top margin-top"
        ]
    ]
];