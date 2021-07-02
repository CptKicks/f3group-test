<?php

namespace Tests\Feature;

use Tests\TestCase;

class CsvExporterTest extends TestCase
{

    /**
     * Checks if the /api/csv-export route returns a CSV based on sent data
     */
    public function testCsvCreate(): void
    {
        $data = [
            [
                'first_name' => 'John',
                'last_name' => 'Doe',
                'emailAddress' => 'john.doe@example.com'
            ],
            [
                'first_name' => 'Michael',
                'last_name' => 'Swam',
                'emailAddress' => 'michael.swam@example.com'
            ]
        ];
        $response = $this->patch('/api/csv-export', $data);
        $response->assertStatus(200);
        $response->assertHeader('Content-Disposition', 'attachment; filename=file.csv');

        $row_string_array = explode("\n", $response->streamedContent(), -1);
        $exploded_array = [];
        foreach($row_string_array as $row) {
            array_push($exploded_array, explode(",", $row));
        }

        $headers = $exploded_array[0];
        unset($exploded_array[0]);
        $exploded_array = array_values($exploded_array);

        $decoded_array = [];
        foreach($exploded_array as $array) {
            $decoded_array[] = array_combine($headers, $array);
        }

        $this->assertEquals($data, $decoded_array);
    }
}
