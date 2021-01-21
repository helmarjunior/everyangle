<?php


namespace App\Http;


use Illuminate\Support\Facades\Log;

class HttpResponse
{
    function replyError($error){

        Log::error(sprintf("%s [%s]:%d | [%s] %s",
            date("Y-m-d H:i:s"),
            $error->getFile(),
            $error->getLine(),
            $error->getCode(),
            $error->getMessage()
        ));

        $message = null;

        if($error->getCode() == 23000)
            $message = array('message' => 'Duplicated entry');

        return response()->json($message, 400);
    }
}
