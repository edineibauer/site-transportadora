<?php
echo template(TPL_SECTION_LARGE, [
    "class" => "footer color-black",
    "content" => template(TPL_COL_2, [

        ]) .
        template(TPL_COL_1, [
            "class" => "padding-8 align-center",
            "content" => SITENAME . " - Copyright © All Rights Reserved - " . date("Y")
        ])
]);