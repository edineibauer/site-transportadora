<?php

echo template(TPL_1200, [
    "class" => "footer color-black",
    "content" => template(TPL_COL_2, [

        ]) .
        template(TPL_TEXT_CENTER, [
            "class" => "padding-8",
            "content" => SITENAME . " - Copyright © All Rights Reserved - " . date("Y")
        ])
]);