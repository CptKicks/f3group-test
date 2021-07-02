<?php
declare(strict_types=1);

namespace App\Http\Controllers;

use App\File\Csv\CsvCreator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class CsvExportController extends Controller {
    /**
     * Converts the user input into a CSV file and streams the file back to the user
     * @param Request $request
     * @param CsvCreator $csvCreator
     * @return StreamedResponse
     */
    public function convert(Request $request, CsvCreator $csvCreator): StreamedResponse
    {
        $request->validate([
            '*' => 'required|array|min:1',
        ]);

        $data = $request->all();

        $callback = function() use ($data, $csvCreator) {
            $csvCreator->create($data);
        };

        return Response::stream($callback, 200, array(
            "Content-type" => "text/csv",
            "Content-Disposition" => "attachment; filename=file.csv",
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0"
        ));
    }
}
