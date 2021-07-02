<?php

namespace App\File\Csv;

use App\File\FileCreator;

class CsvCreator implements FileCreator {
    /** Creates a csv file from array of array of strings
     * @param array $data
     */
    function create(array $data):void {
        $fp = fopen('php://output', 'w');

        $headerRow = array_keys($data[0]);
        fputcsv($fp, $headerRow);

        foreach ($data as $fields) {
            fputcsv($fp, $fields);
        }

        fclose($fp);
    }
}
