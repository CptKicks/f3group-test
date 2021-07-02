<?php

namespace App\File;

interface FileCreator {
    /**
     * @param array $data
     */
    function create(array $data): void;
}
